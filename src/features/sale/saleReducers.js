import {
    CHEST_VALUE_RECEIVED,
    SALE_STATE_RECEIVED, USER_BALANCE_RECEIVED
} from './saleConstants';

export const sale = (state = {}, action) => {
  if (action.type === SALE_STATE_RECEIVED) {
    return {...state, saleState: action.payload.saleState}
  }

  if (action.type === USER_BALANCE_RECEIVED) {
    return {...state, balance: action.payload.balance};
  }

  if (action.type === CHEST_VALUE_RECEIVED) {
    return {...state, chestValue: action.payload};
  }

  return state;
};
