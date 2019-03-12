import firebase from 'firebase/app';

require('firebase/database');
require('firebase/firestore');
require('firebase/storage');

const config = {
  apiKey: process.env.REACT_APP_FB_API,
  authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FB_DB_URL,
  projectId: process.env.REACT_APP_FB_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FB_STORAGE,
  messagingSenderId: process.env.REACT_APP_FB_MSG_SENDER_ID,
};

firebase.initializeApp(config);

export const storage = firebase.storage();
export const rtdb = firebase.database();
// eslint-disable-next-line
export let db = firebase.firestore();

// const firestore = new Firestore();
//   const settings = {/* your settings... */ timestampsInSnapshots: true};
//   firestore.settings(settings);

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
