import { TX_STARTED, TX_COMPLETED, TX_ERROR } from './txConstants';

import { setError } from '../../app/appActions';

export const startTx = payload => ({ type: TX_STARTED, payload });

export const completedTx = receipt => ({ type: TX_COMPLETED, payload: receipt });
export const ErrorTx = error => ({ type: TX_ERROR, payload: error });

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
