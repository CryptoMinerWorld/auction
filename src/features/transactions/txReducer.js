import {
  RESOLVE_PENDING_TRANSACTIONS,
} from './txConstants';


export const txReducer = (state = [], action) => {
  if (action.type === RESOLVE_PENDING_TRANSACTIONS) {
    return action.payload;
  }


  return state;
};
