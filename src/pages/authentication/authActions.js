import {db} from '../../utils/firebase'
import store from "../../store";
import getWeb3 from "../../utils/getWeb3";
import {
  CURRENT_USER_AVAILABLE,
  CURRENT_USER_NOT_AVAILABLE,
  WEB3_AVAILABLE,
  USER_EXISTS,
  NEW_USER
} from "./authConstants";
import {getUserGems} from '../dashboard/dashboardActions'

export const checkIfUserExists = (userId) => (dispatch) => 
  db.doc(`users/${userId}`)
  .get()
  .then(doc => 
     doc.exists ? dispatch({type: USER_EXISTS, payload: doc.data()}) : dispatch({type: NEW_USER})
  )
  .catch(error => console.error('error', error))

export const createNewUser = (payload) => (dispatch) => {
  const {walletId} = payload
  return db
  .doc(`users/${walletId}`)
  .set(payload)
  .then( () => dispatch({type: USER_EXISTS, payload}))
  .catch(error => console.error('error', error))
}



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




