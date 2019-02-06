import {combineReducers} from 'redux';
import {reducer as tooltip} from 'redux-tooltip';
import {marketActionsReducer, marketReducer} from '../features/market/marketReducers';
import auction from '../features/items/itemReducer';
import auth from '../features/auth/authReducer';
import dashboard from '../features/dashboard/dashboardReducer';
import txReducer from '../features/transactions/txReducer';

import {
    AUCTION_SERVICE_ADDED,
    CLEAR_ERROR,
    COUNTRY_CONTRACT_ADDED,
    COUNTRY_SALE_ADDED,
    CURRENT_ACCOUNT_ADDED,
    DUTCH_CONTRACT_ADDED,
    FETCH_DATA_BEGUN,
    FETCH_DATA_FAILED,
    FETCH_DATA_SUCCEEDED,
    GEM_CONTRACT_ADDED, GEM_SERVICE_ADDED,
    GOLD_CONTRACT_ADDED,
    MODAL_GONE,
    MODAL_VISIBLE,
    PRESALE_CONTRACT_ADDED,
    REF_POINTS_TRACKER_CONTRACT_ADDED,
    RELEASE_CONFETTI,
    SET_ERROR,
    SILVER_CONTRACT_ADDED, SILVER_SALE_CONTRACT_ADDED,
    WEB3_ADDED,
    WORKSHOP_CONTRACT_ADDED,
} from './reduxConstants';

const initialState = {
    loading: false,
    error: false,
    modalVisible: false,
    releaseConfetti: false,
};

const appReducer = (state = initialState, action) => ({
    [WEB3_ADDED]: {...state, web3: action.payload},
    [GEM_CONTRACT_ADDED]: {...state, gemsContractInstance: action.payload},
    [DUTCH_CONTRACT_ADDED]: {...state, dutchContractInstance: action.payload},
    [GEM_SERVICE_ADDED]: {...state, gemServiceInstance: action.payload},
    [AUCTION_SERVICE_ADDED]: {...state, auctionServiceInstance: action.payload},
    [FETCH_DATA_BEGUN]: {...state, loading: true},
    [FETCH_DATA_FAILED]: {...state, error: action.payload, loading: false},
    [FETCH_DATA_SUCCEEDED]: {...state, loading: false},
    [CURRENT_ACCOUNT_ADDED]: {...state, currentAccount: action.payload},
    [COUNTRY_CONTRACT_ADDED]: {...state, countryContractInstance: action.payload},
    [COUNTRY_SALE_ADDED]: {...state, countrySaleInstance: action.payload},
    [PRESALE_CONTRACT_ADDED]: {
        ...state,
        presaleContractInstance: action.payload,
    },
    [REF_POINTS_TRACKER_CONTRACT_ADDED]: {
        ...state,
        refPointsTrackerContractInstance: action.payload,
    },
    [SILVER_CONTRACT_ADDED]: {
        ...state,
        silverContractInstance: action.payload,
    },
    [GOLD_CONTRACT_ADDED]: {
        ...state,
        goldContractInstance: action.payload,
    },
    [WORKSHOP_CONTRACT_ADDED]: {
        ...state,
        workshopContractInstance: action.payload,
    },
    [SILVER_SALE_CONTRACT_ADDED]: {
        ...state,
        silverSaleContractInstance: action.payload,
    },
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
    tooltip,
    tx: txReducer,
});
