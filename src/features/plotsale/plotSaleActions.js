import {completedTx, ErrorTx, startTx} from "../transactions/txActions";
import {parseTransactionHashFromError} from "../transactions/helpers";
import {getUserBalance} from "../sale/saleActions";
import {COUNTRY_PLOTS_DATA} from "./country_plots_data";
import {ZERO_ADDRESS} from "../../app/reduxConstants";


export const getAvailableCountryPlots = (countryId) => async (dispatch, getState) => {
    const plotService = getState().app.plotServiceInstance;
    const totalPlots = COUNTRY_PLOTS_DATA[countryId - 1];
    const plotsMinted = await plotService.getPlotsMintedByCountryId(countryId);
    console.log("PLOTS MINTED: ", plotsMinted);
    console.log("TOTAL PLOTS: ", totalPlots);
    console.log("DIFF:", totalPlots - plotsMinted);
    //country.availablePlots = totalPlots - plotsMinted;
    return totalPlots - plotsMinted;
}

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
        const txResult = plotService.buyPlots(countryId, totalAmount - amountExceeded, priceInEthNotExceeded, referrer || ZERO_ADDRESS)
          .on('transactionHash', (hash) => {
              dispatch(
                startTx({
                    hash,
                    description: 'Buying ' + (totalAmount - amountExceeded) + ' plots',
                    currentUser,
                    txMethod: 'PLOT_SALE',
                    price: priceInEthNotExceeded,
                }),
              );
          })
          .on('receipt', async (receipt) => {
              hidePopup();
              console.log('111RECEIPT: ', receipt);
              //getUserBalance(currentUser)(dispatch, getState);
              dispatch(completedTx({
                  receipt,
                  txMethod: 'PLOT_SALE',
                  description: 'Plots bought',
                  hash: receipt.transactionHash,
              }));
          })
          .on('error', (err) => {
              //setLoading(false);
              hidePopup();
              dispatch(ErrorTx({
                  txMethod: 'PLOT_SALE',
                  description: 'Could not buy plots',
                  error: err,
                  hash: parseTransactionHashFromError(err.message)
              }));
          });
    }

    if (randomCountry && amountExceeded > 0) {
        const txResult = plotService.buyPlots(randomCountry, amountExceeded, priceInEthExceeded, referrer || ZERO_ADDRESS)
          .on('transactionHash', (hash) => {
              dispatch(
                startTx({
                    hash,
                    description: 'Buying ' + amountExceeded + ' plots',
                    currentUser,
                    txMethod: 'PLOT_SALE',
                    price: priceInEthExceeded,
                }),
              );
          })
          .on('receipt', async (receipt) => {
              hidePopup();
              console.log('111RECEIPT: ', receipt);
              //getUserBalance(currentUser)(dispatch, getState);
              dispatch(completedTx({
                  receipt,
                  txMethod: 'PLOT_SALE',
                  description: 'Plots bought',
                  hash: receipt.transactionHash,
              }));
          })
          .on('error', (err) => {
              //setLoading(false);
              hidePopup();
              dispatch(ErrorTx({
                  txMethod: 'PLOT_SALE',
                  description: 'Could not buy plots',
                  error: err,
                  hash: parseTransactionHashFromError(err.message)
              }));
          });
    }
};