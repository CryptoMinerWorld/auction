import {
  WEB3_ADDED,
  DUTCH_CONTRACT_ADDED,
  GEM_CONTRACT_ADDED,
  CURRENT_ACCOUNT_ADDED,
  PRESALE_CONTRACT_ADDED,
  SET_ERROR,
  CLEAR_ERROR,
  COUNTRY_CONTRACT_ADDED,
  COUNTRY_SALE_ADDED,
} from './reduxConstants';

export const sendContractsToRedux = (
  dutchAuctionContractInstance,
  gemsContractInstance,
  web3,
  presaleContract,
  currentAccount,
  countryContract,
  countrySaleContract,
) => (dispatch) => {
  dispatch({ type: WEB3_ADDED, payload: web3 });
  dispatch({ type: DUTCH_CONTRACT_ADDED, payload: dutchAuctionContractInstance });
  dispatch({ type: GEM_CONTRACT_ADDED, payload: gemsContractInstance });
  dispatch({ type: CURRENT_ACCOUNT_ADDED, payload: currentAccount });
  dispatch({ type: PRESALE_CONTRACT_ADDED, payload: presaleContract });

  dispatch({ type: COUNTRY_CONTRACT_ADDED, payload: countryContract });
  dispatch({ type: COUNTRY_SALE_ADDED, payload: countrySaleContract });
};

export const setError = (payload, title) => ({
  type: SET_ERROR,
  payload,
  error: true,
  meta: title,
});
export const clearError = () => ({ type: CLEAR_ERROR });
