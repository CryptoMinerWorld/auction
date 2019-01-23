// // DEV
// const AUCTION_CONTRACT = '0x4ec415d87e00101867fbfa28db19cce0d564d8b3';
// const GEM_CONTRACT = '0x82ff6bbd7b64f707e704034907d582c7b6e09d97';
// const COUNTRY_CONTRACT = '0x6AC79cbA4Cf4c07303d30410739b13Ee6914b619';

// PROD
const AUCTION_CONTRACT = '0x1F4f6625e92C4789dCe4B92886981D7b5f484750';
const GEM_CONTRACT = '0xeae9d154da7a1cd05076db1b83233f3213a95e4f';
const COUNTRY_CONTRACT = '0xE49F05Fd6DEc46660221a1C1255FfE335bc7fa7a'

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Web3 = require('web3');
const {
  getMapIndexFromCountryId,
  getCountryNameFromCountryId
} = require('./helpers');

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

const countryContract = require('./ABI/CountryContractABI.json');

const countryContractABI = countryContract.abi;

// @notice instantiating gem contract
const gemsContract = new web3.eth.Contract(gemsABI);
gemsContract.options.address = GEM_CONTRACT;
const auctionContract = new web3.eth.Contract(dutchAuctionABI);
auctionContract.options.address = AUCTION_CONTRACT;

const countryContractInstance = new web3.eth.Contract(
  countryContractABI,
  COUNTRY_CONTRACT
);
countryContractInstance.options.address = COUNTRY_CONTRACT;
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
      console.log('::::::::::::::::::functions/index.js:::::::::::::::::::::');
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

exports.countryReconciliation = functions.https.onRequest(() => {
  // create an array of number from 1 to 190, to represent country indexes
  const countries = Array.from(Array(190), (_, x) => Number(x) + 1);
  const processCountries = async countryList => {
    for (const countryId of countryList) {
      const mapIndex = getMapIndexFromCountryId(countryId);
      console.log('mapIndex', mapIndex);
      const countryName = getCountryNameFromCountryId(countryId);
      console.log('countryName', countryName);
      // eslint-disable-next-line
      await countryContractInstance.methods
        .ownerOf(Number(countryId))
        .call()
        .then(async owner => {
          // console.log('country already sold', countryId, owner);
          const lowercaseOwner = owner
            .split('')
            .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
            .join('');

          await admin
            .database()
            .ref(`/worldMap/objects/units/geometries/${mapIndex}/properties`)
            .update({ sold: true });

          // eslint-disable-next-line
          await admin
            .firestore()
            .doc(`countries/${countryName}`)
            .get()
            .then(async doc => {
              if (!doc.exists) {
                // console.log('No such document!');
                const countryDetails = await admin
                  .database()
                  .ref(
                    `/worldMap/objects/units/geometries/${mapIndex}/properties`
                  )
                  .once('value')
                  .then(snap => snap.val());

                console.log('sold countryDetails', countryDetails);
                await admin
                  .firestore()
                  .doc(`countries/${countryName}`)
                  .set({
                    id: countryName,
                    owner: lowercaseOwner,
                    onSale: false,
                    lastPrice: countryDetails.price,
                    lastBought: Date.now(),
                    totalPlots: countryDetails.plots,
                    plotsBought: 0,
                    plotsMined: 0,
                    plotsAvailable: countryDetails.plots,
                    name: countryName,
                    imageLinkLarge: countryDetails.imageLinkLarge,
                    imageLinkMedium: countryDetails.imageLinkMedium,
                    imageLinkSmall: countryDetails.imageLinkSmall,
                    countryId: countryDetails.countryId,
                    mapIndex: countryDetails.mapIndex,
                    roi: countryDetails.roi
                  })
                  .then(() => console.log('sold country details updated'));
                return;
              } else {
                console.log('Document data:', doc.data());
                // eslint-disable-next-line
                await admin
                  .firestore()
                  .doc(`countries/${countryName}`)
                  .update({
                    owner: lowercaseOwner
                  })
                  .then(() => console.log('unsold country details updated'));
                return;
              }
            })
            .catch(err => {
              console.log('Error getting document', err);
            });

          return true;
        })
        .catch(async error => {
          // eslint-disable-next-line
          await admin
            .database()
            .ref(`/worldMap/objects/units/geometries/${mapIndex}/properties`)
            .update({ sold: false });

          console.log('done marking country sold', countryId);
          // eslint-disable-next-line
          await admin
            .firestore()
            .doc(`countries/${countryName}`)
            .get()
            .then(async doc => {
              if (!doc.exists) {
                console.log('No such document!');
                return;
              } else {
                console.log('Document data:', doc.data());
                // eslint-disable-next-line
                await admin
                  .firestore()
                  .doc(`countries/${countryName}`)
                  .update({
                    owner: '0x'
                  })
                  .then(() => console.log('unsold country details updated'));
                return;
              }
            })
            .catch(err => {
              console.log('Error getting document', err);
            });

          console.log(
            'done updating user database',
            getCountryNameFromCountryId(countryId)
          );
        });
    }
    console.log('done everything');
  };
  return processCountries(countries);
});
