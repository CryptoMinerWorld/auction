import {
    SALE_STATE_RECEIVED, USER_BALANCE_RECEIVED
} from './saleConstants';

export const sale = (state = {}, action) => {
  if (action.type === SALE_STATE_RECEIVED) {
    return {...state, saleState: action.payload.saleState}
  }

  if (action.type === USER_BALANCE_RECEIVED) {
    return {...state, balance: action.payload.balance};
  }

  return state;
};
