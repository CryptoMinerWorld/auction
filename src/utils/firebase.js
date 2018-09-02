
import firebase from 'firebase/app';

require('firebase/storage')

require('firebase/firestore')


const config = {
  apiKey: process.env.FB_API_KEY,
  authDomain: process.env.FB_AUTH_DOMAIN,
  databaseURL: process.env.FB_DB_URL,
  projectId: "cryptominerworld-7afd6",
  storageBucket: "cryptominerworld-7afd6.appspot.com",
  messagingSenderId: process.env.FB_MESSAGING_SENDER_ID
};

firebase.initializeApp(config);

export const storage = firebase.storage();
// eslint-disable-next-line
export let db = firebase.firestore();


firebase
  .firestore()
  .enablePersistence()
  // eslint-disable-next-line
  .then(() =>
    // eslint-disable-next-line
    db = firebase.firestore()
  )
  .catch(err => {
    // eslint-disable-next-line
    console.error(err.code, err);
    return firebase.firestore();
  });

