import { USER_GEMS_RETRIEVED, ALL_USER_GEMS_RETRIEVED, ALL_USER_GEMS_UPLOADED, USER_HAS_NO_GEMS_IN_WORKSHOP, WANT_TO_SEE_ALL_GEMS, ONLY_WANT_TO_SEE_GEMS_IN_AUCTIONS, FETCH_USER_GEMS_BEGUN,FETCH_USER_GEMS_SUCCEEDED, FETCH_USER_GEMS_FAILED, FETCH_USER_DETAILS_BEGUN, FETCH_USER_DETAILS_SUCCEEDED, USER_DETAILS_RETRIEVED, FETCH_USER_DETAILS_FAILED } from "./dashboardConstants";

export default function dashboardReducer(state = {
  gemsLoading: true, 
  gemsLoadingError: false
}, action) {
  if (action.type === USER_GEMS_RETRIEVED) {
    return { ...state, userGems: action.payload, filter:action.payload };
  }
  
  if (action.type === ALL_USER_GEMS_RETRIEVED) {
   
    return { ...state, allUserGems: action.payload,  };
  }

  if (action.type === ALL_USER_GEMS_UPLOADED) {
    return { ...state, allUserGems: action.payload, filter:action.payload };
  }

  if (action.type === USER_HAS_NO_GEMS_IN_WORKSHOP) {
    return { ...state, userHasNoGems: true };
  }


  if (action.type === USER_HAS_NO_GEMS_IN_WORKSHOP) {
    return { ...state, userHasNoGems: true };
  }

  if (action.type === ONLY_WANT_TO_SEE_GEMS_IN_AUCTIONS) {
    return { ...state, filter: state.userGems.filter( gem => gem.auctionIsLive) };
  }

  if (action.type === WANT_TO_SEE_ALL_GEMS) {
    return { ...state, filter: [...state.userGems] };
  }

  if (action.type === FETCH_USER_GEMS_BEGUN) {
    return { ...state, gemsLoaded: false, error: false };
  }

  if (action.type === FETCH_USER_GEMS_BEGUN) {
    return { ...state, gemsLoading: true, gemsLoadingError: false };
  }

  if (action.type === FETCH_USER_GEMS_SUCCEEDED) {
    return { ...state, gemsLoading: false, gemsLoadingError: false };
  }

  if (action.type === FETCH_USER_GEMS_FAILED) {
    return { ...state, gemsLoading: false, gemsLoadingError:  action.payload,};
  }


  if (action.type === FETCH_USER_DETAILS_BEGUN) {
    return { ...state, userLoading: true, userLoadingError: false  };
  }

  if (action.type === FETCH_USER_DETAILS_SUCCEEDED) {
    return { ...state, userLoading: false, userLoadingError: false };
  }

  if (action.type === FETCH_USER_DETAILS_FAILED) {
    return { ...state, userLoading: false, userLoadingError:   action.payload,};
  }


  if (action.type === USER_DETAILS_RETRIEVED) {
    return { ...state, userLoading: false, userDetails:   action.payload,};
  }

  


  


  return state;
}

  
