import {db} from '../../app/utils/firebase';
import store from '../../app/store';
import getWeb3 from '../../app/utils/getWeb3';
import {
    CURRENT_USER_AVAILABLE,
    GUEST_USER,
    NEW_USER,
    NO_USER_EXISTS,
    USER_EXISTS,
    WEB3_AVAILABLE,
} from './authConstants';
import {getUserGems,} from '../dashboard/dashboardActions';
import {setError} from '../../app/appActions';
import {
    FETCH_USER_DETAILS_BEGUN,
    FETCH_USER_DETAILS_FAILED,
    FETCH_USER_DETAILS_SUCCEEDED,
    USER_DETAILS_RETRIEVED
} from "../dashboard/dashboardConstants";

//todo: replace with userService call
export const checkIfUserExists = userId => (dispatch) => {
    const userIdToLowerCase = userId
      .split('')
      .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
      .join('');

    return db
      .doc(`users/${userIdToLowerCase}`)
      .get()
      .then(
        doc => {
            console.log('OK? ', doc.exists);
            return doc.exists
              ? dispatch({type: USER_EXISTS, payload: doc.data()})
              : dispatch({type: NO_USER_EXISTS, payload: userId})
        })
      .catch(error => setError(error));
};


export const getUserDetails = userId => (dispatch) => {
    dispatch({type: FETCH_USER_DETAILS_BEGUN});
    try {
        db.collection('users')
          .where('walletId', '==', userId)
          .onSnapshot((collection) => {
              const userDetails = collection.docs.map(doc => doc.data());
              console.log('USER DETAILS: ', userDetails);
              dispatch({type: FETCH_USER_DETAILS_SUCCEEDED});
              dispatch({type: USER_DETAILS_RETRIEVED, payload: userDetails[0]});
          });
    } catch (err) {
        dispatch({type: FETCH_USER_DETAILS_FAILED, payload: err});
    }
};

export const updateWalletId = walletId => (dispatch, getState) => {

    console.log('update wallet id:', walletId);

    if (!walletId) {
        dispatch({type: GUEST_USER});
        dispatch({type: 'SHOW_SIGN_IN_BOX'});
    }

    let oldAddress = getState().auth.currentUserId;
    oldAddress = oldAddress && oldAddress.split('')
      .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
      .join('');

    const newAddress = walletId && walletId
      .split('')
      .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
      .join('');

    if (oldAddress !== newAddress) {
        dispatch(checkIfUserExists(walletId));
        dispatch(getUserDetails(walletId));
    }
};

//todo: replace with userService call
// this is called in `authentication/index` when you submit a new form
export const createNewUser = payload => (dispatch) => {
    const {walletId} = payload;

    const userIdToLowerCase = walletId
      .split('')
      .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
      .join('');

    return db
      .doc(`users/${userIdToLowerCase}`)
      .set(payload)
      .then(() => {
          console.log('USER_EXISTS_OK');
          dispatch({type: USER_EXISTS, payload});

          //getDetailsForAllGemsAUserCurrentlyOwns(userIdToLowerCase);
      })
      .catch(error => setError(error));
};

export const showSignInModal = () => dispatch => dispatch({type: NEW_USER});

export const notInterestedInSigningUp = () => ({type: 'NOT_SIGNING_UP'});

// @dev this action fires when the app starts up
export const getCurrentUser = () => () => getWeb3
  .then(result => {
      console.log('FUCK', result);
      return result.web3
  })
  .then(async (web3) => {
      await web3.eth.net.getNetworkType((err, network) => console.log(222222222222222, network));
      store.dispatch({type: WEB3_AVAILABLE, payload: web3});
      store.dispatch({type: 'NOT_SIGNING_UP'});
      return web3.eth.getAccounts();
  })
  .then(accounts => {
      console.log('ACCOUNTS:', accounts);
      return accounts[0]
  })
  .then((currentUser) => {
      if (currentUser !== undefined) {
          store.dispatch({type: CURRENT_USER_AVAILABLE, payload: currentUser});
          store.dispatch(checkIfUserExists(currentUser));
          //store.dispatch(getUserGems(currentUser));
      } else {
          //store.dispatch({type: 'SHOW_SIGN_IN_BOX'});
          //store.dispatch({ type: CURRENT_USER_NOT_AVAILABLE });
          store.dispatch({type: GUEST_USER});
      }
  }).catch((err) => store.dispatch({type: 'SHOW_SIGN_IN_BOX'}));
