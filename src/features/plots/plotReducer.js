import {USER_PLOTS_RECEIVED} from "./plotConstants";

export const plots = (state = {}, action) => {
    if (action.type === USER_PLOTS_RECEIVED) {
        console.log("PLOT REDUCER PAYLOAD:", action.payload);
        return {...state, userPlots: action.payload.userPlots}
    }
    return state;
};
