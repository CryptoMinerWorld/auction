import { USER_GEMS_RETRIEVED, ALL_USER_GEMS_RETRIEVED, ALL_USER_GEMS_UPLOADED, USER_HAS_NO_GEMS_IN_WORKSHOP, WANT_TO_SEE_ALL_GEMS, ONLY_WANT_TO_SEE_GEMS_IN_AUCTIONS } from "./dashboardConstants";

export default function dashboardReducer(state = {}, action) {
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


  return state;
}

  
