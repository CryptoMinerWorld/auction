import {
  USER_GEMS_RETRIEVED,
  ALL_USER_GEMS_RETRIEVED,
  ALL_USER_GEMS_UPLOADED,
  USER_HAS_NO_GEMS_IN_WORKSHOP,
  WANT_TO_SEE_ALL_GEMS,
  ONLY_WANT_TO_SEE_GEMS_IN_AUCTIONS,
  FETCH_USER_GEMS_BEGUN,
  FETCH_USER_GEMS_SUCCEEDED,
  FETCH_USER_GEMS_FAILED,
  FETCH_USER_DETAILS_BEGUN,
  FETCH_USER_DETAILS_SUCCEEDED,
  USER_DETAILS_RETRIEVED,
  FETCH_USER_DETAILS_FAILED,
  DASHBOARD_WAS_FILTERED,
  RERENDER_SORT_BOX,
  SORT_BOX_RERENDERED,
  PAGINATE
} from './dashboardConstants';

import { NO_USER_EXISTS } from '../auth/authConstants';
import {
  NEW_AUCTION_CREATED
  // OWNERSHIP_TRANSFERRED
} from '../items/itemConstants';
export default function dashboardReducer(
  state = {
    gemsLoading: true,
    gemsLoadingError: false,
    userGems: [],
    filter: [],
    sortBox: true,
    paginate: []
  },
  action
) {
  if (action.type === USER_GEMS_RETRIEVED) {
    // return { ...state, userGems: action.payload };
    // console.log('action.payload.', action.payload)
    const paginated =
      action.payload.length > 15 ? action.payload.slice(0, 15) : action.payload;

    return { ...state, userGems: action.payload, filter: paginated };
  }

  if (action.type === NO_USER_EXISTS) {
    return { ...state, userGems: '', filter: '' };
  }

  if (action.type === ALL_USER_GEMS_RETRIEVED) {
    const paginated =
      action.payload.length > 15 ? action.payload.slice(0, 15) : action.payload;
    return {
      ...state,
      allUserGems: action.payload,
      filter: paginated
    };
  }

  if (action.type === ALL_USER_GEMS_UPLOADED) {
    console.log('ALL_USER_GEMS_UPLOADED action.payload', action.payload);
    console.log('state.userGems', state.userGems);

    // merge without duplicates
    const newGems = state.userGems
      .concat(action.payload)
      .reduce((total, item) => {
        if (!total.find(current => item.id === current.id)) {
          total.push(item);
        }

        return total;
      }, []);

    // const newGems = unionBy(state.allUserGems, action.payload, 'id');
    const paginated = newGems.length > 15 ? newGems.slice(0, 15) : newGems;

    console.log('newGems', newGems);
    return {
      ...state,
      allUserGems: newGems,
      userGems: newGems,
      filter: paginated
    };
  }

  if (action.type === USER_HAS_NO_GEMS_IN_WORKSHOP) {
    return { ...state, userHasNoGems: true };
  }

  if (action.type === USER_HAS_NO_GEMS_IN_WORKSHOP) {
    return { ...state, userHasNoGems: true };
  }

  if (action.type === DASHBOARD_WAS_FILTERED) {
    return { ...state, filter: action.payload };
  }

  if (action.type === 'DASHBOARD_GEMS_READY') {
    return { ...state, filter: action.payload, userGems: action.payload, gemsLoading: false };
  }

  if (action.type === 'REORDER_DASHBOARD') {
    const key = action.payload[0];
    const direction = action.payload[1];

    const currentDashboardItems = state.filter;
    const newMarket = [...currentDashboardItems].sort(
      (a, b) => (direction === 'desc' ? a[key] - b[key] : b[key] - a[key])
    );

    // returns ordered data and resets pagination to first page]
    return { ...state, filter: newMarket, start: 0, end: 15, page: 1 };
  }

  if (action.type === 'FILTER_DASHBOARD') {
    const allGems = state.userGems;
    let newGemSelection;

    if (action.payload === 'all') {
      newGemSelection = [...allGems];
    }

    if (action.payload === 'inAuction') {
      newGemSelection = allGems.filter(gem => gem.auctionIsLive === true);
    }

    if (action.payload === 'notInAuction') {
      newGemSelection = allGems.filter(gem => gem.auctionIsLive === false);
    }

    // returns ordered data and resets pagination to first page]
    return { ...state, filter: newGemSelection, start: 0, end: 15, page: 1 };
  }


  if (action.type === ONLY_WANT_TO_SEE_GEMS_IN_AUCTIONS) {
    return {
      ...state,
      filter: state.userGems.filter(gem => gem.auctionIsLive)
    };
  }

  if (action.type === WANT_TO_SEE_ALL_GEMS) {
    return { ...state, filter: [...state.userGems] };
  }

  if (action.type === FETCH_USER_GEMS_BEGUN) {
    return { ...state, gemsLoading: false, gemsLoadingError: false };
  }

  if (action.type === FETCH_USER_GEMS_BEGUN) {
    return { ...state, gemsLoading: true, gemsLoadingError: false };
  }

  if (action.type === FETCH_USER_GEMS_SUCCEEDED) {
    return { ...state, gemsLoading: false, gemsLoadingError: false };
  }

  if (action.type === FETCH_USER_GEMS_FAILED) {
    return { ...state, gemsLoading: false, gemsLoadingError: action.payload };
  }

  if (action.type === FETCH_USER_DETAILS_BEGUN) {
    return { ...state, userLoading: true, userLoadingError: false };
  }

  if (action.type === FETCH_USER_DETAILS_SUCCEEDED) {
    return { ...state, userLoading: false, userLoadingError: false };
  }

  if (action.type === FETCH_USER_DETAILS_FAILED) {
    return { ...state, userLoading: false, userLoadingError: action.payload };
  }

  if (action.type === USER_DETAILS_RETRIEVED) {
    return { ...state, userLoading: false, userDetails: action.payload };
  }

  if (action.type === RERENDER_SORT_BOX) {
    return { ...state, sortBox: false };
  }

  if (action.type === SORT_BOX_RERENDERED) {
    return { ...state, sortBox: true };
  }

  if (action.type === PAGINATE) {
    const start = action.payload[0] * action.payload[1] - action.payload[1];
    const end = action.payload[0] * action.payload[1];
    return { ...state, start, end, page: action.payload[0] };
  }

  // if (action.type === OWNERSHIP_TRANSFERRED) {
  //   console.log('action.payload', action.payload);
  //   return { ...state, userGems: [...state.userGems, action.payload], filter: [...state.filter, action.payload]};
  // }

  if (action.type === NEW_AUCTION_CREATED) {
    console.log('action.payload', action.payload);
    const newFilter = state.userGems.map(gem => {
      if (gem.id === action.payload.id) {
        return { ...gem, auctionIsLive: true };
      } else {
        return gem;
      }
    });

    return { ...state, userGems: newFilter };
  }

  if (action.type === 'GEM_REMOVED_FROM_AUCTION') {
    const newFilter = state.userGems.map(gem => {
      if (gem.id === action.payload) {
        return { ...gem, auctionIsLive: false };
      } else {
        return gem;
      }
    });

    return { ...state, userGems: newFilter };
  }

  return state;
}
