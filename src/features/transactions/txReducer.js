import {
  // RESOLVE_PENDING_TRANSACTIONS,
  TX_STARTED,
  TX_CONFIRMATIONS,
  TX_COMPLETED,
  TX_ERROR,
} from './txConstants';

export default (state = {}, action) => {
  // if (action.type === RESOLVE_PENDING_TRANSACTIONS) {
  //   return action.payload;
  // }
  if (action.type === TX_STARTED) {
    return { ...state, txHash: action.payload };
  }
  if (action.type === TX_CONFIRMATIONS) {
    return { ...state, txConfirmations: action.payload };
  }
  if (action.type === TX_COMPLETED) {
    return { ...state, txReceipt: action.payload };
  }
  if (action.type === TX_ERROR) {
    return { ...state, txError: action.payload };
  }

  return state;
};
