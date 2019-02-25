import {completedTx, ErrorTx, startTx} from "../transactions/txActions";
import {parseTransactionHashFromError} from "../transactions/helpers";
import {BigNumber} from "bignumber.js";
import {SALE_STATE_RECEIVED, USER_BALANCE_RECEIVED} from "./saleConstants";
import {utils} from "web3";


export const ONE_UNIT = 0.001;

export const buyGeode = (type, amount, etherUsed, referralPointsUsed, referrer, hidePopup) => async (dispatch, getState) => {

    const silverGoldService = getState().app.silverGoldServiceInstance;
    const currentUser = getState().auth.currentUserId;
    console.log('SILVER gold service:', silverGoldService);

    const txResult = silverGoldService.buyGeode(type, amount, etherUsed, referralPointsUsed, referrer)
      .on('transactionHash', (hash) => {
          hidePopup();
          dispatch(
            startTx({
                hash,
                description: 'Buying ' + type,
                currentUser,
                txMethod: 'SILVER_SALE',
                points: referralPointsUsed,
                ether: etherUsed,
                //todo insert ref points referrer and referral got
            }),
          );
      })
      .on('receipt', async (receipt) => {
          console.log('111RECEIPT: ', receipt);
          getUserBalance(currentUser)(dispatch, getState);
          dispatch(completedTx({
              receipt,
              txMethod: 'SILVER_SALE',
              description: 'Silver received',
              hash: receipt.transactionHash,
          }));
      })
      .on('error', (err) => {
          //setLoading(false);
          dispatch(ErrorTx({
              txMethod: 'SILVER_SALE',
              description: 'Silver sale failed',
              error: err,
              hash: parseTransactionHashFromError(err.message)
          }));
          // dispatch({
          //   type: MODAL_GONE,
          // });
          // dispatch({
          //   type: FETCH_DATA_FAILED,
          //   payload: JSON.stringify(err),
          // });
      });

    console.log('TX RESULT AWAITED:', txResult);

};

export const getUserBalance = (userId) => async (dispatch, getState) => {

    console.log('GET USER BALANCE!!!!!');

    const silverGoldService = getState().app.silverGoldServiceInstance;
    const balance = await silverGoldService.getUserBalance(userId);

    console.log('BALANCE GOT AFTER SALE:', balance);

    dispatch({
        type: USER_BALANCE_RECEIVED,
        payload: {
            balance:
              {
                  referralPoints: balance[0],
                  silverAvailable: Math.floor(balance[1]*ONE_UNIT) ,
                  goldAvailable: Math.floor(balance[2]*ONE_UNIT)
              }
        }
    })
}

export const updateSaleState = (event) => (dispatch) => {

    const rawSaleState = event.returnValues.state;
    const saleState = parseSaleEventData(rawSaleState);
    dispatch({
        type: SALE_STATE_RECEIVED,
        payload: {saleState},
    });

}

export const getSaleState = () => async (dispatch, getState) => {
    const silverGoldService = getState().app.silverGoldServiceInstance;
    const rawSaleState = await silverGoldService.getSaleState();
    console.log('RAW SALE STATE:', rawSaleState);
    const saleState = parseSaleEventData(rawSaleState);
    dispatch({
        type: SALE_STATE_RECEIVED,
        payload: {saleState},
    });
}

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
    }

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
}