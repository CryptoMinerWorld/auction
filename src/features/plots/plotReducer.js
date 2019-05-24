import {GEM_BINDING, GEM_CHANGE_LOCK_STATE, USER_PLOTS_RECEIVED} from "./plotConstants";

export const plots = (state = {}, action) => {
    if (action.type === USER_PLOTS_RECEIVED) {
        console.log("PLOT REDUCER PAYLOAD:", action.payload);
        return {...state, userPlots: action.payload.userPlots, gemMiningIds: action.payload.gemMiningIds}
    }

    if (action.type === GEM_BINDING) {
        return {
          ...state,
            gemMiningIds: (action.payload.state !== 0) ?
              state.gemMiningIds.concat(action.payload.gemId.toString()) :
              state.gemMiningIds.filter(id => id !== action.payload.gemId.toString())
        }
    }
    return state;
};
