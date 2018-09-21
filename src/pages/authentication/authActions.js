import {db} from '../../utils/firebase'
import store from "../../store";
import getWeb3 from "../../utils/getWeb3";
import {
  CURRENT_USER_AVAILABLE,
  CURRENT_USER_NOT_AVAILABLE,
  WEB3_AVAILABLE,
  USER_EXISTS
} from "./authConstants";

export const checkIfUserExists = (userId) => (dispatch) => 
  db.doc(`users/${userId}`)
  .get()
  .then(doc => 
     doc.exists && dispatch({type: USER_EXISTS, payload:doc.data()})
  )
  .catch(error => console.error('error', error))



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
      } else {
        store.dispatch({ type: CURRENT_USER_NOT_AVAILABLE });
      }
    });



export const createNewUser = () => () => {
  const Web3 = getWeb3;
  const { web3 } = Web3;

  web3.eth
    .getAccounts()
    .then(accounts => accounts[0])
    .then(currentUser =>
      store.dispatch({ type: CURRENT_USER_AVAILABLE, payload: currentUser })
    );
};
