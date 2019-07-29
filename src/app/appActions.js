import {CLEAR_ERROR, CONTRACTS_ADDED, SET_ERROR,} from './reduxConstants';


export const sendContractsToRedux = (web3, contracts, services, currentAccount) => (dispatch) => {

    console.info("SEND CONTRACTS TO REDUX", contracts, services);

    dispatch({
        type: CONTRACTS_ADDED,
        payload: {
            web3,
            currentAccount,
            ...contracts,
            ...services
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

export const instantiateContracts = async (assistInstance, web3, ABISet, currentAccountId) => {


    let auctionContract, tokenHelperContract, gemContract, countryContract, refPointsTrackerContract, goldContract,
      silverContract, workshopContract, balanceContract, silverSaleContract, silverCouponsContract, plotSaleContract,
      plotContract,
      minerContracts, artifactContract, plotAntarcticaContract, foundersPlotsContract;

    if (assistInstance) {
        try {
            [auctionContract, tokenHelperContract, gemContract, countryContract, refPointsTrackerContract, goldContract,
                silverContract, workshopContract, balanceContract, silverSaleContract, silverCouponsContract, plotSaleContract, plotContract,
                minerContracts, artifactContract, plotAntarcticaContract, foundersPlotsContract] = await Promise.all([
                assistInstance.Contract(await new web3.eth.Contract(ABISet.dutchAuctionABI,
                  process.env.REACT_APP_DUTCH_AUCTION, {from: currentAccountId})),
                assistInstance.Contract(new web3.eth.Contract(ABISet.dutchAuctionHelperABI,
                  process.env.REACT_APP_DUTCH_AUCTION_HELPER, {from: currentAccountId})),
                assistInstance.Contract(new web3.eth.Contract(ABISet.gemsABI,
                  process.env.REACT_APP_GEM_ERC721, {from: currentAccountId})),
                assistInstance.Contract(new web3.eth.Contract(ABISet.countryABI,
                  process.env.REACT_APP_COUNTRY_ERC721, {from: currentAccountId})),
                assistInstance.Contract(new web3.eth.Contract(ABISet.refPointsTrackerABI,
                  process.env.REACT_APP_REF_POINTS_TRACKER, {from: currentAccountId})),
                assistInstance.Contract(new web3.eth.Contract(ABISet.goldABI,
                  process.env.REACT_APP_GOLD_ERC721, {from: currentAccountId})),
                assistInstance.Contract(new web3.eth.Contract(ABISet.silverABI,
                  process.env.REACT_APP_SILVER_ERC721, {from: currentAccountId})),
                assistInstance.Contract(new web3.eth.Contract(ABISet.workshopABI,
                  process.env.REACT_APP_WORKSHOP, {from: currentAccountId})),
                assistInstance.Contract(new web3.eth.Contract(ABISet.balanceABI,
                  process.env.REACT_APP_BALANCE_PROXY)),
                assistInstance.Contract(new web3.eth.Contract(ABISet.silverSaleABI,
                  process.env.REACT_APP_SILVER_SALE, {from: currentAccountId})),
                {}, // assistInstance.Contract(new web3.eth.Contract(silverCouponsABI,process.env.REACT_APP_SILVER_COUPONS))
                assistInstance.Contract(new web3.eth.Contract(ABISet.plotSaleABI,
                  process.env.REACT_APP_PLOT_SALE, {from: currentAccountId})),
                assistInstance.Contract(new web3.eth.Contract(ABISet.plotABI,
                  process.env.REACT_APP_PLOT_ERC721, {from: currentAccountId})),
                Promise.all([
                    assistInstance.Contract(new web3.eth.Contract(ABISet.minerABI,
                      process.env.REACT_APP_MINER, {from: currentAccountId})),
                    assistInstance.Contract(new web3.eth.Contract(ABISet.minerABI,
                      process.env.REACT_APP_COUNTRY_GEMS_MINER, {from: currentAccountId})),
                ]),
                assistInstance.Contract(new web3.eth.Contract(ABISet.artifactABI,
                  process.env.REACT_APP_ARTIFACT_ERC20, {from: currentAccountId})),
                assistInstance.Contract(new web3.eth.Contract(ABISet.plotAntarcticaABI,
                  process.env.REACT_APP_PLOT_ANTARCTICA, {from: currentAccountId})),
                assistInstance.Contract(new web3.eth.Contract(ABISet.foundersPlotsABI,
                  process.env.REACT_APP_FOUNDERS_PLOTS, {from: currentAccountId}))
            ])
        } catch (err) {
            console.error("ERROR OCCURRED WHILE INSTANTIATING CONTRACTS WITH ASSIST:", err)
        }

    } else {
        try {
            [auctionContract, tokenHelperContract, gemContract, countryContract, refPointsTrackerContract, goldContract,
                silverContract, workshopContract, balanceContract, silverSaleContract, silverCouponsContract, plotSaleContract, plotContract,
                minerContracts, artifactContract, plotAntarcticaContract, foundersPlotsContract] = await Promise.all([
                (new web3.eth.Contract(ABISet.dutchAuctionABI,
                  process.env.REACT_APP_DUTCH_AUCTION, {from: currentAccountId})),
                (new web3.eth.Contract(ABISet.dutchAuctionHelperABI,
                  process.env.REACT_APP_DUTCH_AUCTION_HELPER, {from: currentAccountId})),
                (new web3.eth.Contract(ABISet.gemsABI,
                  process.env.REACT_APP_GEM_ERC721, {from: currentAccountId})),
                (new web3.eth.Contract(ABISet.countryABI,
                  process.env.REACT_APP_COUNTRY_ERC721, {from: currentAccountId})),
                (new web3.eth.Contract(ABISet.refPointsTrackerABI,
                  process.env.REACT_APP_REF_POINTS_TRACKER, {from: currentAccountId})),
                (new web3.eth.Contract(ABISet.goldABI,
                  process.env.REACT_APP_GOLD_ERC721, {from: currentAccountId})),
                (new web3.eth.Contract(ABISet.silverABI,
                  process.env.REACT_APP_SILVER_ERC721, {from: currentAccountId})),
                (new web3.eth.Contract(ABISet.workshopABI,
                  process.env.REACT_APP_WORKSHOP, {from: currentAccountId})),
                (new web3.eth.Contract(ABISet.balanceABI,
                  process.env.REACT_APP_BALANCE_PROXY)),
                (new web3.eth.Contract(ABISet.silverSaleABI,
                  process.env.REACT_APP_SILVER_SALE, {from: currentAccountId})),
                {}, //  (new web3.eth.Contract(silverCouponsABI,process.env.REACT_APP_SILVER_COUPONS))
                (new web3.eth.Contract(ABISet.plotSaleABI,
                  process.env.REACT_APP_PLOT_SALE, {from: currentAccountId})),
                (new web3.eth.Contract(ABISet.plotABI,
                  process.env.REACT_APP_PLOT_ERC721, {from: currentAccountId})),
                Promise.all([
                    (new web3.eth.Contract(ABISet.minerABI,
                      process.env.REACT_APP_MINER, {from: currentAccountId})),
                    (new web3.eth.Contract(ABISet.minerABI,
                      process.env.REACT_APP_COUNTRY_GEMS_MINER, {from: currentAccountId})),
                ]),
                (new web3.eth.Contract(ABISet.artifactABI,
                  process.env.REACT_APP_ARTIFACT_ERC20, {from: currentAccountId})),
                (new web3.eth.Contract(ABISet.plotAntarcticaABI,
                  process.env.REACT_APP_PLOT_ANTARCTICA, {from: currentAccountId})),
                (new web3.eth.Contract(ABISet.foundersPlotsABI,
                  process.env.REACT_APP_FOUNDERS_PLOTS, {from: currentAccountId}))
            ])
        } catch (e) {
            console.error("ERROR OCCURRED WHILE INSTANTIATING CONTRACTS", e)
        }
    }
    return {
        auctionContract,
        tokenHelperContract,
        gemContract,
        countryContract,
        refPointsTrackerContract,
        goldContract,
        silverContract,
        workshopContract,
        balanceContract,
        presaleContract: {},
        silverSaleContract,
        silverCouponsContract,
        plotSaleContract,
        plotContract,
        minerContracts,
        artifactContract,
        plotAntarcticaContract,
        foundersPlotsContract
    }
};