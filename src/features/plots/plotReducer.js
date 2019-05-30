import {GEM_BINDING, REFRESH_USER_PLOT, USER_PLOTS_RECEIVED} from "./plotConstants";

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

    if (action.type === REFRESH_USER_PLOT) {

        const refreshedPlots = state.userPlots.map(plot => {
            return (plot.id === action.payload.id) ? {...plot, ...action.payload} : plot;
        });
        return {
            ...state,
            userPlots: refreshedPlots,
        }
    }
    return state;
};
