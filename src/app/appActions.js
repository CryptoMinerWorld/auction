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

import DutchAuction from './ABI/DutchAuction.json';
import Gems from './ABI/GemERC721.json';
import Presale from './ABI/Presale2.json';

const dutchAuctionABI = DutchAuction.abi;
const gemsABI = Gems.abi;
const presaleABI = Presale.abi;

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


export const instantiateContracts = async (web3, handleSendContractsToRedux, handleSetError) => {
  const currentAccountId = await web3.eth.getAccounts().then(accounts => accounts[0]);

  // @notice instantiating auction contract
  const dutchContract = new web3.eth.Contract(
    dutchAuctionABI,
    process.env.REACT_APP_DUTCH_AUCTION,
    {
      from: currentAccountId,
    },
  );

  const presaleContract = new web3.eth.Contract(presaleABI, process.env.REACT_APP_PRESALE2, {
    from: currentAccountId,
  });

  // @notice instantiating gem contract
  const gemsContract = new web3.eth.Contract(gemsABI, process.env.REACT_APP_GEM_ERC721, {
    from: currentAccountId,
  });

  return Promise.all([dutchContract, gemsContract, currentAccountId, presaleContract])
    .then(([dutchAuctionContractInstance, gemsContractInstance, currentAccount, presale]) => {
      handleSendContractsToRedux(
        dutchAuctionContractInstance,
        gemsContractInstance,
        web3,
        presale,
        currentAccount,
      );
    })
    .catch(error => handleSetError(error));
};
