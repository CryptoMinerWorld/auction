import {
    addPendingTransaction,
    completedTx,
    ErrorTx,
    getUpdatedTransactionHistory,
    startTx
} from "../transactions/txActions";
import {parseTransactionHashFromError} from "../transactions/helpers";
import {getUserBalance} from "../sale/saleActions";
import {COUNTRY_PLOTS_DATA} from "./country_plots_data";
import {ZERO_ADDRESS} from "../../app/reduxConstants";
import {weiToEth} from "../sale/helpers";
import {CHEST_VALUE_RECEIVED} from "../sale/saleConstants";
import {PLOT_SALE_CHEST_VALUES_RECEIVED} from "./plotSaleReducer";
import {BINDING_GEM, FOUNDERS_PLOTS, PLOT_SALE} from "../plots/plotConstants";
import {AUCTION_START} from "../items/itemConstants";
const REACT_APP_WORLD_CHEST="0x29E007c1BFc9c9aA1351B8B3D3B01Cc45dF6Ae4D";
const REACT_APP_GEMSTONE_CHESTS="0x2906DA90D3f99D5913bB3461183682951ca7280c";
const REACT_APP_FOUNDERS_CHEST="0xC352f692F55dEf49f0B736Ec1F7CA0F862eabD23";
const REACT_APP_FACTORY_FOUNDERS_CHEST="0x3B9574A461bba11241A0314712259ef1906b6219";


export const getAvailableCountryPlots = (countryId) => async (dispatch, getState) => {
    const plotService = getState().app.plotService;
    const totalPlots = COUNTRY_PLOTS_DATA[countryId - 1];
    const plotsMinted = await plotService.getPlotsMintedByCountryId(countryId);
    console.log("PLOTS MINTED: ", plotsMinted);
    console.log("TOTAL PLOTS: ", totalPlots);
    console.log("DIFF:", totalPlots - plotsMinted);
    //country.availablePlots = totalPlots - plotsMinted;
    return totalPlots - plotsMinted;
};

export const getChestValues = () => async (dispatch, getState) => {
    const web3 = getState().app.web3;
    const chestFactoryContract = getState().app.chestFactoryContract;
    const worldChestValue = weiToEth(await web3.eth.getBalance(REACT_APP_WORLD_CHEST));
    const monthlyChestValue = weiToEth(await web3.eth.getBalance(REACT_APP_GEMSTONE_CHESTS));
    const foundersChestValue = weiToEth(await web3.eth.getBalance(REACT_APP_FOUNDERS_CHEST));
    const foundersChestFactoryValue = weiToEth(await web3.eth.getBalance(REACT_APP_FACTORY_FOUNDERS_CHEST));

    dispatch({
        type: PLOT_SALE_CHEST_VALUES_RECEIVED,
        payload: {worldChestValue, monthlyChestValue, foundersChestValue: foundersChestValue + foundersChestFactoryValue}
    });
};

export const buyPlots = (countryId, totalAmount, amountExceeded, referrer, hidePopup) => async (dispatch, getState) => {

    const plotPrice = 0.02;
    //const priceInEth = plotPrice*amount;
    const priceInEthNotExceeded = (totalAmount - amountExceeded)*plotPrice;
    const priceInEthExceeded = (amountExceeded)*plotPrice;
    const plotService = getState().app.plotService;
    const currentUser = getState().auth.currentUserId;
    let randomCountry;

    if(amountExceeded > 0) {
        let iterations = 0;
        while (!randomCountry && iterations <= 5) {
            //first 100 countries;
            const randomFive = await Promise.all([-1, -1, -1, -1, -1].map(async (n) => {
                 const randomCountryId = Math.floor(Math.random() * Math.floor(100));
                 const availablePlots = await getAvailableCountryPlots(randomCountryId)(dispatch, getState);
                 if (availablePlots > amountExceeded) {
                     return randomCountryId;
                 }
                 else {
                     return -1;
                 }
            }));
            randomCountry = randomFive.find((id) => id > -1);
            iterations++;
        }
    }

    if (totalAmount > amountExceeded) {
        let txHash;
        const txResult = plotService.buyPlots(countryId, totalAmount - amountExceeded, priceInEthNotExceeded, referrer || ZERO_ADDRESS)
          .on('transactionHash', (hash) => {
              txHash = hash;
              addPendingTransaction({
                  hash: hash,
                  userId: currentUser,
                  type: PLOT_SALE,
                  description: `Buying ${totalAmount - amountExceeded} plots`,
                  body: {
                      countryId: countryId,
                      count: totalAmount - amountExceeded,
                  }
              })(dispatch, getState);
          })
          .on('receipt', async (receipt) => {
              hidePopup();
          })
          .on('error', (err) => {
              if (txHash) {
                  getUpdatedTransactionHistory()(dispatch, getState);
              }
          });
    }

    if (randomCountry && amountExceeded > 0) {
        let txHash;
        const txResult = plotService.buyPlots(randomCountry, amountExceeded, priceInEthExceeded, referrer || ZERO_ADDRESS)
          .on('transactionHash', (hash) => {
              txHash = hash;
              addPendingTransaction({
                  hash: hash,
                  userId: currentUser,
                  type: PLOT_SALE,
                  description: `Buying ${amountExceeded} plots`,
                  body: {
                      countryId: countryId,
                      count: amountExceeded,
                  }
              })(dispatch, getState);
              hidePopup();
          })
          .on('receipt', async (receipt) => {
          })
          .on('error', (err) => {
              if (txHash) {
                  getUpdatedTransactionHistory()(dispatch, getState);
              }
          });
    }
};

export const getFounderPlotsNumber = (userId) => async(dispatch, getState) => {
    const foundersPlotsContract = getState().app.foundersPlotsContract;
    const plotAntarcticaContract = getState().app.plotAntarcticaContract;
    console.log("FOUNDERS PLOTS CONTRACT", foundersPlotsContract, userId);
    const [initialBalance, issuedTokens] = await Promise.all([
      foundersPlotsContract.methods.geodeBalances(userId).call(),
      plotAntarcticaContract.methods.issuedTokens(userId).call()
    ]);
    console.log("balance:", initialBalance - issuedTokens);
    dispatch({
        type: FOUNDERS_PLOTS,
        payload: {foundersPlotsBalance: initialBalance - issuedTokens}
    })
};

export const getFounderPlots = (n, callback) => async(dispatch, getState) => {
    const plotAntarcticaContract = getState().app.plotAntarcticaContract;
    const currentUserId = getState().auth.currentUserId;
    console.log("contract, userId", plotAntarcticaContract, currentUserId);
    let txHash;
    plotAntarcticaContract.methods.get(n).send()
      .on('transactionHash', hash => {
          txHash = hash;
          addPendingTransaction({
              hash: hash,
              userId: currentUserId,
              type: PLOT_SALE,
              description: `Getting founder's plots`,
              body: {
                  plotsNumber: n,
              }
          })(dispatch, getState);
      })
      .on('receipt', receipt => {
          callback();
      })
      .on('error', err => {
          if (txHash) {
              getUpdatedTransactionHistory()(dispatch, getState);
          }
          callback();
      });
};