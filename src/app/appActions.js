import {
    CLEAR_ERROR,
    COUNTRY_CONTRACT_ADDED,
    COUNTRY_SALE_ADDED,
    CURRENT_ACCOUNT_ADDED,
    DUTCH_CONTRACT_ADDED,
    GEM_CONTRACT_ADDED,
    GOLD_CONTRACT_ADDED,
    PRESALE_CONTRACT_ADDED,
    REF_POINTS_TRACKER_CONTRACT_ADDED,
    SET_ERROR,
    SILVER_CONTRACT_ADDED,
    WEB3_ADDED,
} from './reduxConstants';

import DutchAuction from './ABI/DutchAuction.json';
import Gems from './ABI/GemERC721.json';
import Presale from './ABI/Presale2.json';
import RefPointsTracker from './ABI/RefPointsTracker';
import Gold from './ABI/GoldERC20';
import Silver from './ABI/SilverERC20';

const dutchAuctionABI = DutchAuction.abi;
const gemsABI = Gems.abi;
const presaleABI = Presale.abi;
const refPointsTrackerABI = RefPointsTracker.abi;
const goldABI = Gold.abi;
const silverABI = Silver.abi;

export const sendContractsToRedux = (
  dutchAuctionContractInstance,
  gemsContractInstance,
  web3,
  presaleContract,
  currentAccount,
  countryContract,
  countrySaleContract,
  refPointsTrackerContract,
  silverContract,
  goldContract
) => (dispatch) => {
    dispatch({type: WEB3_ADDED, payload: web3});
    dispatch({type: DUTCH_CONTRACT_ADDED, payload: dutchAuctionContractInstance});
    dispatch({type: GEM_CONTRACT_ADDED, payload: gemsContractInstance});
    dispatch({type: CURRENT_ACCOUNT_ADDED, payload: currentAccount});
    dispatch({type: PRESALE_CONTRACT_ADDED, payload: presaleContract});

    dispatch({type: REF_POINTS_TRACKER_CONTRACT_ADDED, payload: refPointsTrackerContract});
    dispatch({type: SILVER_CONTRACT_ADDED, payload: silverContract});
    dispatch({type: GOLD_CONTRACT_ADDED, payload: goldContract});

    dispatch({type: COUNTRY_CONTRACT_ADDED, payload: countryContract});
    dispatch({type: COUNTRY_SALE_ADDED, payload: countrySaleContract});


};

export const setError = (payload, title) => ({
    type: SET_ERROR,
    payload,
    error: true,
    meta: title,
});
export const clearError = () => ({type: CLEAR_ERROR});


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

    const refPointsTrackerContract = new web3.eth.Contract(refPointsTrackerABI, process.env.REACT_APP_REF_POINTS_TRACKER, {
        from: currentAccountId,
    });

    const goldContract = new web3.eth.Contract(goldABI, process.env.REACT_APP_GOLD_ERC721, {
        from: currentAccountId,
    });

    const silverContract = new web3.eth.Contract(silverABI, process.env.REACT_APP_SILVER_ERC721, {
        from: currentAccountId,
    });

    return Promise.all([dutchContract, gemsContract, currentAccountId, presaleContract, refPointsTrackerContract, silverContract, goldContract])
      .then(([dutchAuctionContractInstance, gemsContractInstance, currentAccount, presale, refPointsTracker, silver, gold]) => {
          handleSendContractsToRedux(
            dutchAuctionContractInstance,
            gemsContractInstance,
            web3,
            presale,
            currentAccount,
            refPointsTracker,
            silver,
            gold
          );
      })
      .catch(error => handleSetError(error));
};
