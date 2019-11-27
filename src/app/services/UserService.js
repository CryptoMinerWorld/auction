import queryString from "query-string";
import Cookies from "universal-cookie";
import {db, storage} from '../../app/utils/firebase';
import {
    CURRENT_USER_AVAILABLE,
    CURRENT_USER_NOT_AVAILABLE,
    NO_USER_EXISTS,
    USER_EXISTS,
    WEB3_AVAILABLE
} from "../../features/auth/authConstants";
import {setError} from "../appActions";
import getWeb3 from "../utils/getWeb3";
import store from "../store";

export default class UserService {

    constructor(refPointsTrackerContract) {
        this.refPointsTrackerContract = refPointsTrackerContract;
    }

    getCurrentUser = () => () => getWeb3
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
              //store.dispatch(getUserGems(currentUser));
          } else {
              store.dispatch({ type: CURRENT_USER_NOT_AVAILABLE });
          }
      });

    checkIfUserExists = userId => (dispatch) => {
        const userIdToLowerCase = userId
          .split('')
          .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
          .join('');

        return db
          .doc(`users/${userIdToLowerCase}`)
          .get()
          .then(
            doc => {
                return doc.exists
                  ? dispatch({ type: USER_EXISTS, payload: doc.data(), walletId: userIdToLowerCase })
                  : dispatch({ type: NO_USER_EXISTS, payload: userIdToLowerCase })
            })
          .catch(error => setError(error));
    };

    createNewUser = payload => (dispatch) => {
        const { walletId } = payload;

        const userIdToLowerCase = walletId
          .split('')
          .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
          .join('');

        return db
          .doc(`users/${userIdToLowerCase}`)
          .set(payload, {merge: true})
          .then(() => {
              console.log('USER_EXISTS_OK');
              dispatch({ type: USER_EXISTS, payload });

              //getDetailsForAllGemsAUserCurrentlyOwns(userIdToLowerCase);
          })
          .catch(error => setError(error));
    };

    static setReferralId = (referrer, currentUserId) => {
      if (referrer) {
          if (referrer.startsWith("0x") && referrer.length === 42) {
            try {
              db.collection("users").doc(currentUserId.toLowerCase()).set({referrer: referrer.toLowerCase()}, {merge: true});
            }
            catch (err) {
              console.error(err);
            }
          }
      } 
      return referrer;
  };

}
