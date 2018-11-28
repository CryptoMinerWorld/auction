// // DEV
// const AUCTION_CONTRACT = '0x4ec415d87e00101867fbfa28db19cce0d564d8b3';
// const GEM_CONTRACT = '0x82ff6bbd7b64f707e704034907d582c7b6e09d97';

// PROD
const AUCTION_CONTRACT = '0x1F4f6625e92C4789dCe4B92886981D7b5f484750';
const GEM_CONTRACT = '0xeae9d154da7a1cd05076db1b83233f3213a95e4f';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Web3 = require('web3');

admin.initializeApp(functions.config().firebase);
admin.firestore().settings({ timestampsInSnapshots: true });

// // DEV
// const web3 = new Web3(
//   new Web3.providers.HttpProvider(
//     'https://rinkeby.infura.io/qWWCAOLoD65CmWAo4jLg'
//   )
// );

// PROD
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    'https://mainnet.infura.io/qWWCAOLoD65CmWAo4jLg '
  )
);

// Define the ABI of the contracts
const Gems = require('./ABI/GemABI.json');

const gemsABI = Gems.abi;
const DutchAuction = require('./ABI/DutchAuction.json');

const dutchAuctionABI = DutchAuction.abi;

// @notice instantiating gem contract
const gemsContract = new web3.eth.Contract(gemsABI);
gemsContract.options.address = GEM_CONTRACT;
const auctionContract = new web3.eth.Contract(dutchAuctionABI);
auctionContract.options.address = AUCTION_CONTRACT;

// this function is fired once every 4 hours and checks that all the active gems are in auction
exports.updateGemDetails = functions.https.onRequest(() =>
  // get all gems details from the database
  // check who is the owner of each gem
  // if the owner is a contract address
  // then update the db to confim the auction is live
  // otherwise update the db with the gems ownerId (in lowercase)
  admin
    .firestore()
    .collection('stones')
    .get()
    .then(coll => {
      // get all gems details from the database
      const docs = coll.docs.map(doc => [doc.id, doc.data()]);
      return docs;
    })
    .then(docs =>
      Promise.all(
        docs.map(doc =>
          // check who is the owner of each gem
          // eslint-disable-next-line
          gemsContract.methods
            // @ts-ignore
            .ownerOf(doc[1].id)
            .call()
            .then(address => [doc[0], address])
        )
      )
    )
    .then(addresses =>
      addresses.forEach(address => {
        if (
          // if the owner is a contract address
          web3.utils.toChecksumAddress(address[1]) ===
          web3.utils.toChecksumAddress(AUCTION_CONTRACT)
        ) {
          // update the db to confim the auction is live
          admin
            .firestore()
            .collection('stones')
            .doc(address[0])
            .update({
              auctionIsLive: true
            });
        } else {
          const userIdToLowerCase = address[1]
            .split('')
            .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
            .join('');

          // or update the db with the gems ownerId (in lowercase)
          admin
            .firestore()
            .collection('stones')
            .doc(address[0])
            .update({
              owner: userIdToLowerCase,
              auctionIsLive: false
            });
        }
      })
    )
    .catch(err => console.log('err reconciling stones', err))
);

// Fifteen minutes after the reconciliation function run this updater function will go through the
// db and update all the live auction details with data from the blockchain.
exports.updateLiveAuctionDetails = functions.https.onRequest(() =>
  // get all auction that are marked live
  // get the id for each gem in auction
  // make sure all the gem ids are numbers
  // get the details for each gem
  // filter out any auction that have an expired deadline  or price of zero
  // update the db with the deadline, max price and min price
  admin
    .firestore()
    .collection('stones')
    .where('auctionIsLive', '==', true)
    .get()
    .then(coll => {
      // get the id for each gem in auction
      const docs = coll.docs.map(doc => doc.id);
      return docs;
    })
    .then(docIds => {
      // make sure all the gem ids are numbers
      const numberedDocIds = docIds.filter(id => !isNaN(Number(id)));
      return Promise.all(
        numberedDocIds.map(doc =>
          // get the details for each gem

          // eslint-disable-next-line
          auctionContract.methods
            .items(GEM_CONTRACT, Number(doc))
            .call()
            .then(details => {
              const { t1, p0, p1 } = details;
              return {
                doc,
                t1,
                p0,
                p1
              };
            })
            .catch(err => console.log('err getting auction details', err))
        )
      );
    })
    .then(allDetails => {
      // filter out any auction that have an expired deadline  or price of zero
      const cleanedDetails = allDetails.filter(
        item => item.t1 !== '0' || item.p0 !== '0'
      );

      // update the db with the deadline, max price and min price
      return allDetails.forEach(item =>
        // eslint-disable-next-line
        admin
          .firestore()
          .collection('stones')
          .doc(item.doc)
          .update({
            deadline: Number(item.t1),
            maxPrice: Number(item.p0),
            minPrice: Number(item.p1)
          })
          .catch(err =>
            console.log('err updating db with new auction details', err)
          )
      );
    })
    .catch(err => console.log('err updating live auction cloud function', err))
);
