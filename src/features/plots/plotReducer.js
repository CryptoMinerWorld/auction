import {GEM_CHANGE_LOCK_STATE, USER_PLOTS_RECEIVED} from "./plotConstants";

export const plots = (state = {}, action) => {
    if (action.type === USER_PLOTS_RECEIVED) {
        console.log("PLOT REDUCER PAYLOAD:", action.payload);
        return {...state, userPlots: action.payload.userPlots, gemMiningIds: action.payload.gemMiningIds}
    }
    if (action.type === GEM_CHANGE_LOCK_STATE) {
        console.log("PAYLOAD: ", action.payload);
        console.log("gemMiningIds", state.gemMiningIds);
        return {
            ...state,
            gemMiningIds: state.gemMiningIds.includes(action.payload.gemId.toString()) ?
              state.gemMiningIds.filter(id => id !== action.payload.gemId.toString()) :
              state.gemMiningIds.concat(action.payload.gemId.toString()),
        }
    }
    return state;
};
