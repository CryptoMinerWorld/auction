import {CLEAR_ERROR, CONTRACTS_ADDED, SET_ERROR,} from './reduxConstants';


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
  plotAntarcticaContract,
  foundersPlotsContract,
  plotService,
  gemService,
  auctionService,
  silverGoldService,
  countryService
) => (dispatch) => {

    console.log('App Actions gem service: ');
    console.log('Dispatching:',);

    console.error("DISPATCHING CONTRACTS_ADDED");

    dispatch({
        type: CONTRACTS_ADDED, payload: {
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
            plotAntarcticaContractInstance: plotAntarcticaContract,
            foundersPlotsContractInstance: foundersPlotsContract,
            plotServiceInstance: plotService,
            gemServiceInstance: gemService,
            auctionServiceInstance: auctionService,
            silverGoldServiceInstance: silverGoldService,
            countryServiceInstance: countryService
        }
    });
};

export const setError = (payload, title) => ({
    type: SET_ERROR,
    payload,
    error: true,
    meta: title,
});
export const clearError = () => ({type: CLEAR_ERROR});
