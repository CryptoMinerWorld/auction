import { USER_GEMS_RETRIEVED } from "./dashboardConstants";

export default function dashboardReducer(state = {}, action) {
  if (action.type === USER_GEMS_RETRIEVED) {
    return { ...state, userGems: action.payload };
  }

  return state;
}
