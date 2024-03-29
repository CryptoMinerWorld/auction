import {
    GEM_BINDING,
    REFRESH_USER_PLOT,
    REFRESH_USER_PLOTS,
    USER_PLOTS_RECEIVED,
    USER_PLOTS_RELOAD_BEGUN
} from "./plotConstants";

export const plots = (state = {
    plotsLoaded: false,
    gemMiningIds: []
}, action) => {

    if (action.type === USER_PLOTS_RELOAD_BEGUN) {
        return {
            ...state,
            plotsLoaded: false,
            userPlots: null,
        }
    }

    if (action.type === USER_PLOTS_RECEIVED) {
        console.log("PLOT REDUCER PAYLOAD:", action.payload);
        return {...state, plotsLoaded: true, userPlots: action.payload.userPlots, gemMiningIds: action.payload.gemMiningIds}
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
        const refreshedPlots = state.userPlots ? state.userPlots.map(plot => {
            return (plot.id === action.payload.id) ? {...plot, ...action.payload} : plot;
        }) : [];
        return {
            ...state,
            userPlots: refreshedPlots,
        }
    }
    //two reducers for bulk and single processing
    if (action.type === REFRESH_USER_PLOTS) {
        const refreshedPlots = state.userPlots ? state.userPlots.map(plot => {
            return (action.payload.ids.includes(plot.id)) ? {...plot, miningState: action.payload.miningState} : plot;
        }) : [];
        return {
            ...state,
            userPlots: refreshedPlots,
        }
    }
    return state;
};
