// DEV
const AUCTION_CONTRACT = '0x4ec415d87e00101867fbfa28db19cce0d564d8b3';
const GEM_CONTRACT = '0x82ff6bbd7b64f707e704034907d582c7b6e09d97';

// // PROD
// const AUCTION_CONTRACT = '0x1F4f6625e92C4789dCe4B92886981D7b5f484750';
// const GEM_CONTRACT = '0xeae9d154da7a1cd05076db1b83233f3213a95e4f';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
var Web3 = require('web3');

admin.initializeApp();

const db = admin.database();

// DEV
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    'https://rinkeby.infura.io/qWWCAOLoD65CmWAo4jLg'
  )
);

// // PROD
// const web3 = new Web3(
//   new Web3.providers.HttpProvider(
//     'https://mainnet.infura.io/qWWCAOLoD65CmWAo4jLg '
//   )
// );

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

// this function is fired once every 24 hours and checks that all the active gems are in auction
exports.updateGemDetails = functions.https.onRequest(() =>
  admin
    .firestore()
    .collection('stones')
    .get()
    .then(coll => {
      const docs = coll.docs.map(doc => [doc.id, doc.data()]);
      return docs;
    })
    .then(docs =>
      Promise.all(
        docs.map(doc =>
          gemsContract.methods
            .ownerOf(doc[1].id)
            .call()
            .then(address => [doc[0], address])
        )
      )
    )
    .then(addresses => {
      // maybe in the future get image and name from db and update that too
      return addresses.forEach(address => {
        if (
          web3.utils.toChecksumAddress(address[1]) ===
          web3.utils.toChecksumAddress(AUCTION_CONTRACT)
        ) {
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
          admin
            .firestore()
            .collection('stones')
            .doc(address[0])
            .update({
              owner: userIdToLowerCase,
              auctionIsLive: false
            });
        }
      });
    })
    .catch(err => console.log('err reconciling stones', err))
);

// Fifteen minutes after the reconciliation function run this updater function will go through the database and update all the live auction details with data from the blockchain.
exports.updateLiveAuctionDetails = functions.https.onRequest(() =>
  admin
    .firestore()
    .collection('stones')
    .where('auctionIsLive', '==', true)
    .get()
    .then(coll => {
      const docs = coll.docs.map(doc => doc.id);
      return docs;
    })
    .then(docIds => {
      console.log('docIds', docIds);
      return Promise.all(
        docIds.map(doc =>
          auctionContract.methods
            .items(GEM_CONTRACT, Number(doc))
            .call()
            .then(details => {
              console.log('details', details);
              const { t0, t1, p0, p1 } = result;
              return [doc, t1, p0, p1];
            })
            .catch(err => console.log('err getting auction details', err))
        )
      );
    })
    .then(([docId, deadline, maxPrice, minPrice]) => {
      console.log(
        'docId, deadline, maxPrice, minPrice',
        docId,
        deadline,
        maxPrice,
        minPrice
      );
      return admin
        .firestore()
        .collection('stones')
        .doc(docId)
        .update({
          deadline,
          maxPrice,
          minPrice
        })
        .catch(err =>
          console.log('err updating db with new auction details', err)
        );
    })
    .catch(err => console.log('err updating live auction cloud function', err))
);
