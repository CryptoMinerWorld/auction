import {db} from '../../app/utils/firebase'
import store from "../../app/store";
import getWeb3 from "../../app/utils/getWeb3";
import {
  CURRENT_USER_AVAILABLE,
  CURRENT_USER_NOT_AVAILABLE,
  WEB3_AVAILABLE,
  USER_EXISTS,
  NEW_USER,
  NO_USER_EXISTS
} from "./authConstants";
import {getUserGems, getDetailsForAllGemsAUserCurrentlyOwns} from '../dashboard/dashboardActions'

export const checkIfUserExists = (userId) => (dispatch) => 
  db.doc(`users/${userId}`)
  .get()
  .then(doc => 
     doc.exists ? dispatch({type: USER_EXISTS, payload: doc.data()}) : dispatch({type: NO_USER_EXISTS})
  )
  .catch(error => console.error('error', error))

// this is called in `authentication/index` when you submit a new form
export const createNewUser = (payload) => (dispatch) => {
  const {walletId} = payload
  return db
  .doc(`users/${walletId}`)
  .set(payload)
  .then( () => {
    dispatch({type: USER_EXISTS, payload})
    getDetailsForAllGemsAUserCurrentlyOwns(walletId)
  })
  .catch(error => console.error('error', error))
}

export const showSignInModal = () => (dispatch) => dispatch({type: NEW_USER})



// @dev this action fires when the app starts up
export const getCurrentUser = () => () =>
  getWeb3
    .then(result => result.web3)
    .then(web3 => {
      store.dispatch({ type: WEB3_AVAILABLE, payload: web3 });
      return web3.eth.getAccounts()})
    .then(accounts => accounts[0])
    .then(currentUser => {
      if (currentUser !== undefined) {
        store.dispatch({ type: CURRENT_USER_AVAILABLE, payload: currentUser });
        store.dispatch(checkIfUserExists(currentUser))
        store.dispatch(getUserGems(currentUser))
      } else {
        store.dispatch({ type: CURRENT_USER_NOT_AVAILABLE });
      }
    });




