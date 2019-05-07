import {USER_PLOTS_RECEIVED} from "./plotConstants";

export const getUserPlots = ownerId => async (dispatch, getState) => {
    console.warn("GETTING USER PLOTS>>>");
    const plotService = getState().app.plotServiceInstance;
    const userPlots = await plotService.getOwnerPlots(ownerId);
    dispatch({
        type: USER_PLOTS_RECEIVED,
        payload: {userPlots}
    });
}