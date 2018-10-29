// import { db } from '../../app/utils/firebase';


// import store from '../../app/store';
// import { RESOLVE_PENDING_TRANSACTIONS } from './txConstants';

import { setError } from '../../app/appActions';


export const resolveTXStatus = (pendingTransactions, dbWrite, dbDelete, queryBlockchain) => {
  try {
    pendingTransactions.forEach(async (gemId) => {
      const payload = await queryBlockchain(gemId);
      dbWrite(gemId, payload)
        .then(() => dbDelete(gemId))
        .catch(err => setError(err));
    });
  } catch (err) {
    setError(err);
  }
};


export async function findPendingTransactions(userId, queryBlockchain, dbQuery, dbWrite, dbDelete, resolveTXStatus) {
  const payload = await dbQuery(userId);
  if (payload.length > 0) {
    return resolveTXStatus(payload, queryBlockchain, dbWrite, dbDelete);
  }
  return null;
}


// getWeb3
//   .then(result => result.web3)
//   .then((web3) => {
//     store.dispatch({ type: WEB3_AVAILABLE, payload: web3 });
//     return web3.eth.getAccounts();
//   })
//   .then(accounts => accounts[0])
//   .then((currentUser) => {
//     if (currentUser !== undefined) {
//       store.dispatch({ type: CURRENT_USER_AVAILABLE, payload: currentUser });
//       store.dispatch(checkIfUserExists(currentUser));
//       // store.dispatch(getUserGems(currentUser));
//     } else {
//       store.dispatch({ type: CURRENT_USER_NOT_AVAILABLE });
//     }
//   });
