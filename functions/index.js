const AUCTION_CONTRACT = '0x4ec415d87e00101867fbfa28db19cce0d564d8b3';
const GEM_CONTRACT = '0x82ff6bbd7b64f707e704034907d582c7b6e09d97';
const functions = require('firebase-functions');
const admin = require('firebase-admin');
var Web3 = require('web3');

admin.initializeApp();
// admin.initializeApp(functions.config().firebase);
const db = admin.database();

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    'https://rinkeby.infura.io/qWWCAOLoD65CmWAo4jLg'
  )
);

// Define the ABI of the contract, used to return the desired values
const Gems = require('./GemABI.json');
const gemsABI = Gems.abi;

// @notice instantiating gem contract
const gemsContract = new web3.eth.Contract(gemsABI);
gemsContract.options.address = GEM_CONTRACT;

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
        console.log(
          'gem',
          address[0],
          'gem owner',
          address[1],
          web3.utils.toChecksumAddress(address[1]),
          web3.utils.toChecksumAddress(address[1]) ===
            web3.utils.toChecksumAddress(AUCTION_CONTRACT)
        );
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
          admin
            .firestore()
            .collection('stones')
            .doc(address[0])
            .update({
              owner: address[1],
              auctionIsLive: false
            });
        }
      });
    })
    .catch(err => console.log('err', err))
);
