import {
    AUCTION_SERVICE_ADDED,
    CLEAR_ERROR, CONTRACTS_ADDED,
    COUNTRY_CONTRACT_ADDED,
    COUNTRY_SALE_ADDED,
    CURRENT_ACCOUNT_ADDED,
    DUTCH_CONTRACT_ADDED, DUTCH_HELPER_CONTRACT_ADDED,
    GEM_CONTRACT_ADDED, GEM_SERVICE_ADDED,
    GOLD_CONTRACT_ADDED,
    PRESALE_CONTRACT_ADDED,
    REF_POINTS_TRACKER_CONTRACT_ADDED,
    SET_ERROR,
    SILVER_CONTRACT_ADDED, SILVER_COUPONS_CONTRACT_ADDED, SILVER_GOLD_SERVICE_ADDED, SILVER_SALE_CONTRACT_ADDED,
    WEB3_ADDED,
    WORKSHOP_CONTRACT_ADDED,
} from './reduxConstants';

import DutchAuction from './ABI/DutchAuction.json';
import DutchAuctionHelper from './ABI/DutchAuctionHelper';
import Gems from './ABI/GemERC721.json';
import Presale from './ABI/Presale2.json';
import RefPointsTracker from './ABI/RefPointsTracker.json';
import Gold from './ABI/GoldERC20.json';
import Silver from './ABI/SilverERC20.json';
import Workshop from './ABI/Workshop.json';
import SilverSale from './ABI/SilverSale';
import SilverCoupons from './ABI/SilverCoupons';
import queryString from "query-string";
import Cookies from "universal-cookie";
import GemService from './services/GemService';
import AuctionService from './services/AuctionService';
import SilverGoldService from "./services/SilverGoldService";

const dutchAuctionABI = DutchAuction.abi;
const dutchAuctionHelperABI = DutchAuctionHelper.abi;
const gemsABI = Gems.abi;
const presaleABI = Presale.abi;
const refPointsTrackerABI = RefPointsTracker.abi;
const goldABI = Gold.abi;
const silverABI = Silver.abi;
const workshopABI = Workshop.abi;
const silverSaleABI = SilverSale.abi;
const silverCouponsABI = SilverCoupons.abi;

export const sendContractsToRedux = (
  dutchAuctionContractInstance,
  dutchAuctionHelperContractInstance,
  gemsContractInstance,
  web3,
  presaleContract,
  currentAccount,
  countryContract,
  countrySaleContract,
  refPointsTrackerContract,
  silverContract,
  goldContract,
  workshopContract,
  silverSaleContract,
  silverCouponsContract,
  gemService,
  auctionService,
  silverGoldService
) => (dispatch) => {

    console.log('App Actions gem service: ');
    console.log('Dispatching:', );

    dispatch({type: CONTRACTS_ADDED, payload: {
            dutchContractInstance: dutchAuctionContractInstance,
            dutchHelperContractInstance: dutchAuctionHelperContractInstance,
            gemsContractInstance: gemsContractInstance,
            web3,
            presaleContractInstance: presaleContract,
            currentAccount,
            countrySaleInstance: countryContract,
            countryContractInstance: countrySaleContract,
            refPointsTrackerContractInstance: refPointsTrackerContract,
            silverContractInstance: silverContract,
            goldContractInstance: goldContract,
            workshopContractInstance: workshopContract,
            silverSaleContractInstance: silverSaleContract,
            silverCouponsContract,
            gemServiceInstance: gemService,
            auctionServiceInstance: auctionService,
            silverGoldServiceInstance: silverGoldService
    }});

    // dispatch({type: WEB3_ADDED, payload: web3});
    // dispatch({type: DUTCH_CONTRACT_ADDED, payload: dutchAuctionContractInstance});
    // dispatch({type: DUTCH_HELPER_CONTRACT_ADDED, payload: dutchAuctionHelperContractInstance});
    // dispatch({type: GEM_CONTRACT_ADDED, payload: gemsContractInstance});
    // dispatch({type: CURRENT_ACCOUNT_ADDED, payload: currentAccount});
    // dispatch({type: PRESALE_CONTRACT_ADDED, payload: presaleContract});
    //
    // dispatch({type: REF_POINTS_TRACKER_CONTRACT_ADDED, payload: refPointsTrackerContract});
    // dispatch({type: SILVER_CONTRACT_ADDED, payload: silverContract});
    // dispatch({type: GOLD_CONTRACT_ADDED, payload: goldContract});
    // dispatch({type: WORKSHOP_CONTRACT_ADDED, payload: workshopContract});
    // dispatch({type: SILVER_SALE_CONTRACT_ADDED, payload: silverSaleContract});
    // dispatch({type: SILVER_COUPONS_CONTRACT_ADDED, payload: silverCouponsContract});
    //
    // dispatch({type: COUNTRY_CONTRACT_ADDED, payload: countryContract});
    // dispatch({type: COUNTRY_SALE_ADDED, payload: countrySaleContract});
    //
    // dispatch({type: GEM_SERVICE_ADDED, payload: gemService});
    // dispatch({type: AUCTION_SERVICE_ADDED, payload: auctionService});
    // dispatch({type: SILVER_GOLD_SERVICE_ADDED, payload: silverGoldService});

};

export const setError = (payload, title) => ({
    type: SET_ERROR,
    payload,
    error: true,
    meta: title,
});
export const clearError = () => ({type: CLEAR_ERROR});

//not all contracts
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

    const dutchHelperContract = new web3.eth.Contract(
      dutchAuctionHelperABI,
      process.env.REACT_APP_DUTCH_AUCTION_HELPER,
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

    const workshopContract = new web3.eth.Contract(workshopABI, process.env.REACT_APP_WORKSHOP, {
        from: currentAccountId,
    });

    const silverSaleContract = new web3.eth.Contract(silverSaleABI, process.env.REACT_APP_SILVER_SALE, {
        from: currentAccountId,
    });

    const silverCouponsContract = new web3.eth.Contract(silverCouponsABI, process.env.REACT_APP_SILVER_COUPONS, {
        from: currentAccountId,
    });

    return Promise.all([dutchContract, dutchHelperContract, gemsContract, currentAccountId, presaleContract, refPointsTrackerContract, silverContract, goldContract, workshopContract, silverSaleContract, silverCouponsContract])
      .then(([dutchAuctionContractInstance, dutchAuctionHelperContractInstance, gemsContractInstance, currentAccount, presale, refPointsTracker, silver, gold, workshop, silverSaleContractInstance, silverCouponsContractInstance]) => {

          const gemService = new GemService(gemsContractInstance, web3, dutchAuctionContractInstance);
          const auctionService = new AuctionService(dutchAuctionContractInstance, dutchAuctionHelperContractInstance, gemsContractInstance);
          const silverGoldService = new SilverGoldService(silverSaleContractInstance, silver, gold, refPointsTracker, silverCouponsContractInstance);
          console.warn('GEM SERVICE: ', gemService);

          handleSendContractsToRedux(
            dutchAuctionContractInstance,
            dutchAuctionHelperContractInstance,
            gemsContractInstance,
            web3,
            presale,
            currentAccount,
            refPointsTracker,
            silver,
            gold,
            workshop,
            silverSaleContractInstance,
            silverCouponsContractInstance,
            gemService,
            auctionService,
            silverGoldService
          );
      })
      .catch(error => handleSetError(error));
};
