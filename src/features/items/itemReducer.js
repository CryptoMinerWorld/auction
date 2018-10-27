import { AUCTION_DETAILS_RECEIVED, CLEAR_GEM_PAGE } from './itemConstants';

export default function auctionReducer(state = {}, action) {
  if (action.type === AUCTION_DETAILS_RECEIVED) {
    return action.payload;
  }
  if (action.type === CLEAR_GEM_PAGE) {
    return null;
  }

  return state;
}
