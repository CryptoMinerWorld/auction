import { combineReducers } from "redux";
import {
  marketActionsReducer,
  marketReducer
} from "../features/market/marketReducers";

import auction from "../features/items/itemReducer";
import auth from "../features/auth/authReducer";
import dashboard from "../features/dashboard/dashboardReducer";

import {
  WEB3_ADDED,
  DUTCH_CONTRACT_ADDED,
  GEM_CONTRACT_ADDED,
  FETCH_DATA_FAILED,
  FETCH_DATA_BEGUN,
  FETCH_DATA_SUCCEEDED,
  CURRENT_ACCOUNT_ADDED
} from "./reduxConstants";

const initialState = {
  loading: false,
  error: false
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case "WEB3_ADDED":
      return { ...state, web3: action.payload };
    case "GEM_CONTRACT_ADDED":
      return { ...state, gemsContractInstance: action.payload };
    case "DUTCH_CONTRACT_ADDED":
      return { ...state, dutchContractInstance: action.payload };
    case "FETCH_DATA_BEGUN":
      return { ...state, loading: true };
    case "FETCH_DATA_SUCCEEDED":
      return { ...state, loading: false };
    case "FETCH_DATA_FAILED":
      return { ...state, error: action.payload, loading: false };
    case "CURRENT_ACCOUNT_ADDED":
      return { ...state, currentAccount: action.payload };
    default:
      return state;
  }
};

// const appReducer = (state = initialState, action) => {
//   if (action.type === WEB3_ADDED) {
//     return { ...state, web3: action.payload };
//   }

//   if (action.type === GEM_CONTRACT_ADDED) {
//     console.log('gem pig', action)
//     return { ...state, gemsContractInstance: action.payload };
//   }

//   if (action.type === DUTCH_CONTRACT_ADDED) {
//     return { ...state, dutchContractInstance: action.payload };
//   }

//   if (action.type === FETCH_DATA_BEGUN) {
//     return { ...state, loading: true };
//   }

//   if (action.type === FETCH_DATA_SUCCEEDED) {
//     return { ...state, loading: false };
//   }

//   if (action.type === FETCH_DATA_FAILED) {
//     return { ...state, error: action.payload, loading: false };
//   }

//   if (action.type === CURRENT_ACCOUNT_ADDED) {
//     return { ...state, currentAccount: action.payload }
//   }

//   return state;
// };

// const appReducer = (state = initialState, action) =>
//   ({
//     [WEB3_ADDED]: { ...state, web3: action.payload },
//     [GEM_CONTRACT_ADDED]: { ...state, gemsContractInstance: action.payload },
//     [DUTCH_CONTRACT_ADDED]: { ...state, dutchContractInstance: action.payload },
//     [FETCH_DATA_BEGUN]: { ...state, loading: true },
//     [FETCH_DATA_FAILED]: { ...state, error: action.payload, loading: false },
//     [FETCH_DATA_SUCCEEDED]: { ...state, loading: false },
//     [CURRENT_ACCOUNT_ADDED]: { ...state, currentAccount: action.payload }
//   }[action.type] || state);

export default combineReducers({
  app: appReducer,
  market: marketReducer,
  marketActions: marketActionsReducer,
  auction,
  auth,
  dashboard
});
