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
const REACT_APP_WORLD_CHEST="0x2281f7Dc57011dA1668eA9460BB40340dB89e29e";
const REACT_APP_MONTHLY_CHEST="0x5446c218245a9440Ac3B03eda826260a9198C7a9";

export const getAvailableCountryPlots = (countryId) => async (dispatch, getState) => {
    const plotService = getState().app.plotServiceInstance;
    const totalPlots = COUNTRY_PLOTS_DATA[countryId - 1];
    const plotsMinted = await plotService.getPlotsMintedByCountryId(countryId);
    console.log("PLOTS MINTED: ", plotsMinted);
    console.log("TOTAL PLOTS: ", totalPlots);
    console.log("DIFF:", totalPlots - plotsMinted);
    //country.availablePlots = totalPlots - plotsMinted;
    return totalPlots - plotsMinted;
};

export const getChestValues = () => async (dispatch, getState) => {
    console.log("AAAAAAAAAAAA");
    const web3 = getState().app.web3;
    const worldChestValue = weiToEth(await web3.eth.getBalance(REACT_APP_WORLD_CHEST));
    const monthlyChestValue = weiToEth(await web3.eth.getBalance(REACT_APP_MONTHLY_CHEST));
    console.log("AAAAAAAAAAAAa", worldChestValue, monthlyChestValue);
    dispatch({
        type: PLOT_SALE_CHEST_VALUES_RECEIVED,
        payload: {worldChestValue, monthlyChestValue}
    });
};


export const buyPlots = (countryId, totalAmount, amountExceeded, referrer, hidePopup) => async (dispatch, getState) => {

    const plotPrice = 0.02;
    //const priceInEth = plotPrice*amount;
    const priceInEthNotExceeded = (totalAmount - amountExceeded)*plotPrice;
    const priceInEthExceeded = (amountExceeded)*plotPrice;
    const plotService = getState().app.plotServiceInstance;
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
    const foundersPlotsContract = getState().app.foundersPlotsContractInstance;
    console.log("FOUNDERS PLOTS CONTRACT", foundersPlotsContract, userId);
    const balance = await foundersPlotsContract.methods.geodeBalances(userId).call();
    console.log("BALANCE:", balance);
    dispatch({
        type: FOUNDERS_PLOTS,
        payload: {foundersPlotsBalance: balance}
    })
};

export const getFounderPlots = (n, callback) => async(dispatch, getState) => {
    const plotAntarcticaContract = getState().app.plotAntarcticaContractInstance;
    const currentUserId = getState().auth.currentUserId;
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
      })
      .on('error', err => {
          if (txHash) {
              getUpdatedTransactionHistory()(dispatch, getState);
          }
      });
};