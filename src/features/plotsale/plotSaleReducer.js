export const PLOT_SALE_CHEST_VALUES_RECEIVED = 'CHEST_VALUES_RECEIVED';

export const plotSale = (state = {}, action) => {
    if (action.type === PLOT_SALE_CHEST_VALUES_RECEIVED) {
        return {...state,
            monthlyChestValue: action.payload.monthlyChestValue,
            worldChestValue: action.payload.worldChestValue};
    }
    return state;
};
