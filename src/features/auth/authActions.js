import { db } from '../../app/utils/firebase';
import store from '../../app/store';
import getWeb3 from '../../app/utils/getWeb3';
import {
  CURRENT_USER_AVAILABLE,
  CURRENT_USER_NOT_AVAILABLE,
  USER_EXISTS,
  NEW_USER,
  NO_USER_EXISTS,
  WEB3_AVAILABLE,
} from './authConstants';
import {
  getUserGems,
  getDetailsForAllGemsAUserCurrentlyOwns,
  getUserDetails,
} from '../dashboard/dashboardActions';
import { setError } from '../../app/appActions';

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
        console.log('OK? ',doc.exists);
        return doc.exists
            ? dispatch({ type: USER_EXISTS, payload: doc.data() })
            : dispatch({ type: NO_USER_EXISTS, payload: userId })
      })
    .catch(error => setError(error));
};

export const updateWalletId = walletId => (dispatch, getState) => {
  const oldAddress = getState()
    .auth.currentUserId.split('')
    .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
    .join('');

  const newAddress = walletId
    .split('')
    .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
    .join('');

  if (oldAddress !== newAddress) {
    dispatch(checkIfUserExists(walletId));
    dispatch(getUserGems(walletId));
    dispatch(getUserDetails(walletId));
  }
};

// this is called in `authentication/index` when you submit a new form
export const createNewUser = payload => (dispatch) => {
  const { walletId } = payload;

  const userIdToLowerCase = walletId
    .split('')
    .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
    .join('');

  return db
    .doc(`users/${userIdToLowerCase}`)
    .set(payload)
    .then(() => {
        console.log('USER_EXISTS_OK');
      dispatch({ type: USER_EXISTS, payload });

      getDetailsForAllGemsAUserCurrentlyOwns(userIdToLowerCase);
    })
    .catch(error => setError(error));
};

export const showSignInModal = () => dispatch => dispatch({ type: NEW_USER });

export const notInterestedInSigningUp = () => ({ type: 'NOT_SIGNING_UP' });

// @dev this action fires when the app starts up
export const getCurrentUser = () => () => getWeb3
  .then(result => result.web3)
  .then((web3) => {
    store.dispatch({ type: WEB3_AVAILABLE, payload: web3 });
    return web3.eth.getAccounts();
  })
  .then(accounts => accounts[0])
  .then((currentUser) => {
    if (currentUser !== undefined) {
      store.dispatch({ type: CURRENT_USER_AVAILABLE, payload: currentUser });
      store.dispatch(checkIfUserExists(currentUser));
      store.dispatch(getUserGems(currentUser));
    } else {
      store.dispatch({ type: CURRENT_USER_NOT_AVAILABLE });
    }
  });
