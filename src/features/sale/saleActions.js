import {
    addPendingTransaction,
    completedTx,
    ErrorTx,
    getUpdatedTransactionHistory,
    startTx
} from "../transactions/txActions";
import {parseTransactionHashFromError} from "../transactions/helpers";
import {BigNumber} from "bignumber.js";
import {
    CHEST_VALUE_RECEIVED,
    FOUNDERS_KEYS_ISSUED,
    SALE_STATE_RECEIVED, SUBMITTED_KEYS_BY_USER_RECEIVED,
    SUBMITTED_KEYS_RECEIVED,
    USER_BALANCE_RECEIVED
} from "./saleConstants";
import {utils} from "web3";
import {weiToEth} from "./helpers";
import {AUCTION_START} from "../items/itemConstants";
import {getUserDetails} from "../dashboard/dashboardActions";

const chestId = process.env.REACT_APP_FACTORY_CHEST_ID;
export const ONE_UNIT = 0.001;

export const buyGeode = (type, amount, etherUsed, referralPointsUsed, referrer, hidePopup) => async (dispatch, getState) => {

    const silverGoldService = getState().app.silverGoldService;
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
              description: `Buying ${type}`,
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

// export const getChestFactoryValue = (chestId) => async (dispatch, getState)

export const getChestValue = () => async (dispatch, getState) => {
    //const preSaleContract = getState().app.presaleContract;
    const chestFactoryContract = getState().app.chestFactoryContract;
    const web3 = getState().app.web3;
    const chestValue = weiToEth(await chestFactoryContract.methods.getValue(process.env.REACT_APP_FACTORY_CHEST_ID).call());
    // const chestFactoryValue = weiToEth(await web3.eth.getBalance(process.env.REACT_APP_FACTORY_FOUNDERS_CHEST));
    // const chestValue = weiToEth(await web3.eth.getBalance(process.env.REACT_APP_FOUNDERS_CHEST));
    dispatch({
        type: CHEST_VALUE_RECEIVED,
        payload: chestValue
    });
};

export const getKeysSubmittedByUser = (chestId, userAddress) => async (dispatch, getState) => {
    const chestFactoryContract = getState().app.chestFactoryContract;
    const allKeys = (await chestFactoryContract.methods
      .getKeyBalances(chestId, userAddress).call());

    const foundersKeys = allKeys.foundersKeys;
    const chestKeys = allKeys.chestKeys;

    dispatch({
        type: SUBMITTED_KEYS_BY_USER_RECEIVED,
        payload: Number(foundersKeys) + Number(chestKeys)
    });
};

export const getKeysSubmitted = (chestId) => async (dispatch, getState) => {
    const chestFactoryContract = getState().app.chestFactoryContract;
    const participants = await chestFactoryContract.methods.getParticipants(chestId).call();
    const userKeys = await Promise.all(participants.map(async userAddress => {
        const keys = (await chestFactoryContract.methods
          .getKeyBalances(chestId, userAddress).call());
        return {userAddress, foundersKeys: keys.foundersKeys, chestKeys: keys.chestKeys};
    }));
    const uniqueUserKeys = {};
    userKeys.forEach(el => uniqueUserKeys[el.userAddress] = (uniqueUserKeys[el.userAddress] || 0) + 1);
    const userKeysFiltered =  await Promise.all(Object.keys(uniqueUserKeys).map(async function(v){
        const userDetails = await getUserDetails(v);
        return {
            userAddress: v,
            keys: uniqueUserKeys[v],
            userName: userDetails.name,
            userImageUrl: userDetails.imageURL
        }
    }));

    userKeysFiltered.sort((a, b) => Number(b.keys) - Number(a.keys));
    dispatch({
        type: SUBMITTED_KEYS_RECEIVED,
        payload: userKeysFiltered
    });
};

export const getUserBalance = (userId) => async (dispatch, getState) => {
    const chestFactoryContract = getState().app.chestFactoryContract;
    const silverGoldService = getState().app.silverGoldService;
    const balances = await silverGoldService.getUserBalance(userId);
    const submittedKeys = (await chestFactoryContract.methods
      .getKeyBalances(chestId, userId).call());
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
                  keys: +Number(balances.foundersKeys) + Number(balances.chestKeys) + Number(submittedKeys.foundersKeys) + Number(submittedKeys.chestKeys),
                  foundersKeys: Number(balances.foundersKeys),
                  chestKeys: Number(balances.chestKeys)
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
    const silverGoldService = getState().app.silverGoldService;
    const rawSaleState = await silverGoldService.getSaleState();
    console.log('RAW SALE STATE:', rawSaleState);
    const saleState = parseSaleEventData(rawSaleState);
    dispatch({
        type: SALE_STATE_RECEIVED,
        payload: {saleState},
    });
};

export const getBoxesAvailableData = () => async (dispatch, getState) => {

    const silverGoldService = getState().app.silverGoldService;
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

export const getKeysIssued = () => async (dispatch, getState) => {
    const foundersKeyContract = getState().app.foundersKeyContract;
    const foundersKeysIssued = await foundersKeyContract.methods.totalSupply().call();
    const chestKeyContract = getState().app.chestKeyContract;
    const chestKeysIssued = await chestKeyContract.methods.totalSupply().call();

    dispatch({
        type: FOUNDERS_KEYS_ISSUED,
        payload: {chestKeysIssued, foundersKeysIssued}
    })
};
