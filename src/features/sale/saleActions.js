import {
    addPendingTransaction,
    completedTx,
    ErrorTx,
    getUpdatedTransactionHistory,
    startTx
} from "../transactions/txActions";
import {parseTransactionHashFromError} from "../transactions/helpers";
import {BigNumber} from "bignumber.js";
import {CHEST_VALUE_RECEIVED, SALE_STATE_RECEIVED, USER_BALANCE_RECEIVED} from "./saleConstants";
import {utils} from "web3";
import {weiToEth} from "./helpers";
import {AUCTION_START} from "../items/itemConstants";


export const ONE_UNIT = 0.001;

export const buyGeode = (type, amount, etherUsed, referralPointsUsed, referrer, hidePopup) => async (dispatch, getState) => {

    const silverGoldService = getState().app.silverGoldServiceInstance;
    const currentUser = getState().auth.currentUserId;
    console.log('SILVER gold service:', silverGoldService);
    let txHash;
    const txResult = silverGoldService.buyGeode(type, amount, etherUsed, referralPointsUsed, referrer)
      .on('transactionHash', (hash) => {
          hidePopup();
          txHash = hash;
          addPendingTransaction({
              hash: hash,
              userId: currentUser,
              type: 'Silver Sale',
              description: `Buying ${type}. Ether used: ${etherUsed}`,
              body: {}
          })(dispatch, getState);
      })
      .on('receipt', async (receipt) => {
          getUserBalance(currentUser)(dispatch, getState);
      })
      .on('error', (err) => {
          if (txHash) {
              getUpdatedTransactionHistory()(dispatch, getState);
          }
      });

    console.log('TX RESULT AWAITED:', txResult);

};

export const getChestValue = () => async (dispatch, getState) => {
    const preSaleContract = getState().app.presaleContractInstance;
    const web3 = getState().app.web3;
    const chestValue = weiToEth(await web3.eth.getBalance(process.env.REACT_APP_FOUNDERS_CHEST));
    dispatch({
        type: CHEST_VALUE_RECEIVED,
        payload: chestValue
    });
};

export const getUserBalance = (userId) => async (dispatch, getState) => {

    const silverGoldService = getState().app.silverGoldServiceInstance;
    const balances = await silverGoldService.getUserBalance(userId);
    dispatch({
        type: USER_BALANCE_RECEIVED,
        payload: {
            balance:
              {
                  referralPoints: balances.points,
                  silverAvailable: Math.floor(balances.silver*ONE_UNIT) ,
                  goldAvailable: Math.floor(balances.gold*ONE_UNIT),
                  gems: balances.gems,
                  plots: balances.plots,
                  artifacts: balances.artifacts,
                  keys: balances.foundersKeys + balances.chestKeys,
              }
        }
    })
};

export const updateSaleState = (event) => (dispatch) => {

    const rawSaleState = event.returnValues.state;
    const saleState = parseSaleEventData(rawSaleState);
    dispatch({
        type: SALE_STATE_RECEIVED,
        payload: {saleState},
    });

};

export const getSaleState = () => async (dispatch, getState) => {
    const silverGoldService = getState().app.silverGoldServiceInstance;
    const rawSaleState = await silverGoldService.getSaleState();
    console.log('RAW SALE STATE:', rawSaleState);
    const saleState = parseSaleEventData(rawSaleState);
    dispatch({
        type: SALE_STATE_RECEIVED,
        payload: {saleState},
    });
};

export const getBoxesAvailableData = () => async (dispatch, getState) => {

    const silverGoldService = getState().app.silverGoldServiceInstance;
    const boxesAvailable = await silverGoldService.getBoxesAvailable();
    console.log('BOXES AVAILABLE: ', boxesAvailable);
    const boxesPrices = await silverGoldService.getBoxesPricesArray();
    console.log('BOXES PRICES: ', boxesPrices);
    return {boxesAvailable, boxesPrices}
    //const total = await silverGoldService.getBoxesToSell();
};

export const parseSaleEventData = (rawSaleState) => {

    if (!rawSaleState || rawSaleState.length !== 4) {
        return;
    }

    const saleState = {
        0: {type: 'silver'},
        1: {type: 'rotund'},
        2: {type: 'goldish'},
        3: {type: 'sale'}
    };

    for (let i = 0; i < 3; i++) {
        console.log(55555555555, saleState[0]);
        const packedState = new BigNumber(rawSaleState[i]);
        saleState[i].boxesAvailable = packedState.dividedToIntegerBy(new BigNumber(2).pow(160)).modulo(new BigNumber(2).pow(16)).toNumber();
        saleState[i].currentPrice = Number(utils.fromWei(packedState
          .dividedToIntegerBy(new BigNumber(2).pow(64))
          .modulo(new BigNumber(2).pow(64)).toString(), 'ether'));
    }

    console.log('SALE STATE::::', saleState);

    const packedSaleState = new BigNumber(rawSaleState[3]);

    saleState[3].nextPriceTimestamp = packedSaleState.dividedToIntegerBy(new BigNumber(2).pow(32)).modulo(new BigNumber(2).pow(32)).toNumber();
    saleState[3].timeToNextPrice = packedSaleState.modulo(new BigNumber(2).pow(32)).toNumber();
    saleState[3].saleStart = packedSaleState.dividedToIntegerBy(new BigNumber(2).pow(128)).modulo(new BigNumber(2).pow(32)).toNumber();
    saleState[3].saleEnd = packedSaleState.dividedToIntegerBy(new BigNumber(2).pow(96).modulo(new BigNumber(2).pow(32))).dividedToIntegerBy(1000,10).toNumber();

    return saleState;
};