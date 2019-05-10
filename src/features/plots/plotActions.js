import {USER_PLOTS_RECEIVED} from "./plotConstants";

export const getUserPlots = ownerId => async (dispatch, getState) => {
    console.warn("GETTING USER PLOTS>>>");
    const plotService = getState().app.plotServiceInstance;
    const {userPlots, gemsMining} = await plotService.getOwnerPlots(ownerId);
    dispatch({
        type: USER_PLOTS_RECEIVED,
        payload: {userPlots, gemsMining}
    });
}

export const bindGem = (plotId, gemId) => async (dispatch, getState) => {
    console.log(`BIND GEM ${gemId} to PLOT ${plotId}`);
    const currentUser = getState().auth.currentUserId;
    const result = await getState().app.plotServiceInstance.bindGem(plotId, gemId, currentUser);

    console.log("RESULT BIND: ", result);
}

export const releaseGem = (plotId, callback) => async (dispatch, getState) => {
    console.log(`RELEASE GEM ON PLOT ${plotId}`);
    const result = await getState().app.plotServiceInstance.releaseGem(plotId);
    console.log("RESULT RELEASE ", result);
    callback();
}