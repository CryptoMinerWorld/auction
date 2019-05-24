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
import Plot from './ABI/PlotERC721';
import PlotSale from './ABI/PlotSale';
import Miner from './ABI/Miner';
import queryString from "query-string";
import Cookies from "universal-cookie";
import GemService from './services/GemService';
import AuctionService from './services/AuctionService';
import SilverGoldService from "./services/SilverGoldService";
import PlotService from "./services/PlotService";

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
const plotABI = Plot.abi;
const plotSaleABI = PlotSale.abi;
const minerABI = Miner.abi;

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
  artifactContract,
  plotService,
  gemService,
  auctionService,
  silverGoldService,
  countryService
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
            countrySaleInstance: countrySaleContract,
            countryContractInstance: countryContract,
            refPointsTrackerContractInstance: refPointsTrackerContract,
            silverContractInstance: silverContract,
            goldContractInstance: goldContract,
            workshopContractInstance: workshopContract,
            silverSaleContractInstance: silverSaleContract,
            silverCouponsContractInstance: silverCouponsContract,
            artifactContractInstance: artifactContract,
            plotServiceInstance: plotService,
            gemServiceInstance: gemService,
            auctionServiceInstance: auctionService,
            silverGoldServiceInstance: silverGoldService,
            countryServiceInstance:countryService
    }});
};

export const setError = (payload, title) => ({
    type: SET_ERROR,
    payload,
    error: true,
    meta: title,
});
export const clearError = () => ({type: CLEAR_ERROR});
