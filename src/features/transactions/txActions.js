import { TX_STARTED, TX_COMPLETED, TX_ERROR } from './txConstants';

import { setError } from '../../app/appActions';

export const startTx = tx => ({type: TX_STARTED, payload: tx});
export const completedTx = tx => ({ type: TX_COMPLETED, payload: tx});
export const ErrorTx = tx => ({ type: TX_ERROR, payload: {error: tx.error, ...tx}});

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
