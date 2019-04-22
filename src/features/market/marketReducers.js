import {
    NEW_AUCTIONS_RECEIVED,
    MARKETPLACE_WAS_FILTERED,
    FETCH_NEW_AUCTIONS_SUCCEEDED,
    FETCH_NEW_AUCTIONS_FAILED,
    FETCH_NEW_AUCTIONS_BEGUN,
    MARKETPLACE_FILTER_BEGUN,
    MARKETPLACE_FILTER_FAILED,
    CHANGE_FILTER_GEM_VALUES,
    CHANGE_FILTER_VALUES,
    PAGINATE_MARKET, FETCH_AUCTIONS_PAGE_IMAGES,
} from './marketConstants';
import { NEW_AUCTION_CREATED } from '../items/itemConstants';

export const marketReducer = (state = {
  auctions: [],
    auctionsFiltered: [],
    paginated: null,
    auctionsLoading: true,
}, action) => {
  if (action.type === NEW_AUCTIONS_RECEIVED) {
    const newState = {...state, auctions: action.payload, auctionsFiltered: action.payload, auctionsLoading:false, updateImages: true};
    console.log('NEW STATE: ', newState);
    return newState;
  }

  if (action.type === NEW_AUCTION_CREATED) {
    const newAuction = action.payload;
    newAuction.currentPrice = action.payload.maxPrice;
    return [...state, newAuction];
  }

  if (action.type === FETCH_AUCTIONS_PAGE_IMAGES) {
    return {...state, updateImages: false}
  }

  if (action.type === MARKETPLACE_WAS_FILTERED) {
    return {...state, auctionsFiltered: action.payload, updateImages: true}
  }

  return state;
};

// @dev The reducer above was one of the first reducers I created
// and I shaped it as an array by MediaStreamTrackEvent, which means I couldn't extend it.
// Hence the extra reducer below, shaped as an object
const initialState = {
  loading: false,
  error: false,
  filterLoading: false,
  filterError: false,
  gems: {
    amethyst: true,
    garnet: true,
    sapphire: true,
    opal: true,
      ruby: true,
  },
  level: {
    min: 0,
    max: 5,
  },
  gradeType: {
    min: 1,
    max: 6,
  },
    //GWei price
  currentPrice: {
    min: 0,
    max: 100000000000,
  },
};

export const marketActionsReducer = (state = initialState, action) => {
  if (action.type === NEW_AUCTIONS_RECEIVED) {
    return { ...state, loading: false, error: false };
  }

  if (action.type === FETCH_NEW_AUCTIONS_FAILED) {
    return { ...state, loading: false, error: true };
  }

  if (action.type === FETCH_NEW_AUCTIONS_BEGUN) {
    return { ...state, loading: true, error: false };
  }

  if (action.type === MARKETPLACE_WAS_FILTERED) {
    return { ...state, filterLoading: false, filterError: false };
  }

  if (action.type === MARKETPLACE_FILTER_FAILED) {
    return { ...state, filterLoading: false, filterError: action.payload };
  }

  if (action.type === MARKETPLACE_FILTER_BEGUN) {
    return { ...state, filterLoading: true, filterError: false };
  }

  if (action.type === CHANGE_FILTER_GEM_VALUES) {
    const newGems = { ...state.gems };
    newGems[action.payload] = !newGems[action.payload];
    return { ...state, gems: newGems };
  }

  if (action.type === CHANGE_FILTER_VALUES) {
    const min = action.payload && action.payload[1] && action.payload[1][0];
    const max = action.payload && action.payload[1] && action.payload[1][1];
    return { ...state, [action.payload && action.payload[0]]: { min, max } };
  }

  if (action.type === PAGINATE_MARKET) {
    const start = action.payload[0] * action.payload[1] - action.payload[1];
    const end = action.payload[0] * action.payload[1];
    return {
      ...state,
      start,
      end,
      page: action.payload[0],
    };
  }

  return state;
};
