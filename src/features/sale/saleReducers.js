import {
    CHEST_VALUE_RECEIVED, FOUNDERS_KEYS_ISSUED,
    SALE_STATE_RECEIVED, SUBMITTED_KEYS_RECEIVED, USER_BALANCE_RECEIVED
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

  if (action.type === FOUNDERS_KEYS_ISSUED) {
    return {...state, foundersKeysIssued: action.payload.foundersKeysIssued, chestKeysIssued: action.payload.chestKeysIssued}
  }

  if (action.type === SUBMITTED_KEYS_RECEIVED) {
    return {...state, foundersKeysSubmitted: action.payload}
  }

  return state;
};
