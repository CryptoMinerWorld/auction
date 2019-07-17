import {combineReducers} from 'redux';
import {reducer as tooltip} from 'redux-tooltip';
import {marketActionsReducer, marketReducer} from '../features/market/marketReducers';
import auction from '../features/items/itemReducer';
import auth from '../features/auth/authReducer';
import dashboard from '../features/dashboard/dashboardReducer';
import txReducer from '../features/transactions/txReducer';
import {sale} from '../features/sale/saleReducers';

import {
    CONTRACTS_ADDED,
    CLEAR_ERROR,
    FETCH_DATA_BEGUN,
    FETCH_DATA_FAILED,
    FETCH_DATA_SUCCEEDED,
    MODAL_GONE,
    MODAL_VISIBLE,
    RELEASE_CONFETTI,
    SET_ERROR,
} from './reduxConstants';
import {plots} from "../features/plots/plotReducer";
import {plotSale} from "../features/plotsale/plotSaleReducer";

const initialState = {
    loading: false,
    error: false,
    modalVisible: false,
    releaseConfetti: false,
};

const appReducer = (state = initialState, action) => ({
    [CONTRACTS_ADDED]: {...state, ...action.payload},
    [FETCH_DATA_BEGUN]: {...state, loading: true},
    [FETCH_DATA_FAILED]: {...state, error: action.payload, loading: false},
    [FETCH_DATA_SUCCEEDED]: {...state, loading: false},
    [MODAL_VISIBLE]: {
        ...state,
        modalVisible: true,
    },
    [MODAL_GONE]: {
        ...state,
        modalVisible: false,
        releaseConfetti: false,
    },
    [RELEASE_CONFETTI]: {
        ...state,
        releaseConfetti: true,
    },
    [SET_ERROR]: {
        ...state,
        error: action.payload,
        errorTitle: action.meta,
    },
    [CLEAR_ERROR]: {
        ...state,
        error: '',
        errorTitle: '',
    },
}[action.type] || state);

export default combineReducers({
    app: appReducer,
    market: marketReducer,
    marketActions: marketActionsReducer,
    auction,
    auth,
    dashboard,
    sale,
    plotSale,
    plots,
    tooltip,
    tx: txReducer,
});
