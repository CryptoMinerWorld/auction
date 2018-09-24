import { USER_GEMS_RETRIEVED, ALL_USER_GEMS_RETRIEVED, ALL_USER_GEMS_UPLOADED, USER_HAS_NO_GEMS_IN_WORKSHOP } from "./dashboardConstants";

export default function dashboardReducer(state = {}, action) {
  if (action.type === USER_GEMS_RETRIEVED) {
    return { ...state, userGems: action.payload };
  }
  
  if (action.type === ALL_USER_GEMS_RETRIEVED) {
   
    return { ...state, allUserGems: action.payload };
  }

  if (action.type === ALL_USER_GEMS_UPLOADED) {
    return { ...state, allUserGems: action.payload };
  }

  if (action.type === USER_HAS_NO_GEMS_IN_WORKSHOP) {
    return { ...state, userHasNoGems: true };
  }
  return state;
}
