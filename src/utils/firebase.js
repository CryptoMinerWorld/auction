
import firebase from 'firebase/app';

require('firebase/firestore')
require('firebase/storage')


const config = {
  apiKey: "AIzaSyDWzdzOR1HrMNec53Mm3TBdb1tLSOWIdv8",
  authDomain: "cryptominerworld-7afd6.firebaseapp.com",
  databaseURL: "https://cryptominerworld-7afd6.firebaseio.com",
  projectId: "cryptominerworld-7afd6",
  storageBucket: "cryptominerworld-7afd6.appspot.com",
  messagingSenderId: "295876392813"
};

firebase.initializeApp(config);

export const storage = firebase.storage();
// eslint-disable-next-line
export let db = firebase.firestore();
const settings = {timestampsInSnapshots: true};
db.settings(settings);

// firebase
//   .firestore()
//   .enablePersistence()
//   // eslint-disable-next-line
//   .then(() =>
//     // eslint-disable-next-line
//     db = firebase.firestore()
//   )
//   .catch(err => {
//     // eslint-disable-next-line
//     console.error(err.code, err);
//     return firebase.firestore();
//   });

