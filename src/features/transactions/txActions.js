import { TX_STARTED, TX_COMPLETED, TX_ERROR } from './txConstants';

import { setError } from '../../app/appActions';

export const startTx = payload => ({ type: TX_STARTED, payload });
export const completedTx = receipt => ({ type: TX_COMPLETED, payload: receipt });
export const ErrorTx = error => ({ type: TX_ERROR, payload: error });

export const resolveTXStatus = async (pendingTransactions, dbWrite, dbDelete, queryBlockchain) => {
  // eslint-disable-next-line
  for (const gemId of pendingTransactions) {
    try {
      // pendingTransactions.forEach(async (gemId) => {
      // eslint-disable-next-line
      const payload = await queryBlockchain(gemId);
      dbWrite(gemId, payload)
        .then(() => dbDelete(gemId))
        .catch(err => setError(err));
    } catch (err) {
      setError(err);
    }
  }
};
