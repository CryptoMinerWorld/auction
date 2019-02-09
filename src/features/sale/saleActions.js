import {completedTx, ErrorTx, startTx} from "../transactions/txActions";
import {AUCTION_DETAILS_RECEIVED} from "../items/itemConstants";

export const buyGeode = (type, amount, price, hidePopup) => async (dispatch, getState) => {

    const silverGoldService = getState().app.silverGoldServiceInstance;
    const currentUser = getState().auth.currentUserId;
    console.log('SILVER gold service:', silverGoldService);

    const txResult = silverGoldService.buyGeode(type, amount, price)
      .on('transactionHash', (hash) => {
          hidePopup();
        dispatch(
          startTx({
              hash,
              description: 'silver sale (description)',
              currentUser,
              txMethod: 'SILVER_SALE',
          }),
        );
    })
      .on('receipt', (receipt) => {
          console.log('RECEIPT: ', receipt);
          dispatch(completedTx({
              receipt,
              txMethod: 'SILVER_SALE',
              description: 'silver received',
              hash: receipt.transactionHash,
          }));
          // dispatch({
          //     type: BOX_UNPACKED,
          //     payload: {gem: {...gem, ...newGemData}}
          // });
      })
      .on('error', (err) => {
          //setLoading(false);
          dispatch(ErrorTx({
              txMethod: 'SILVER_SALE',
              description: 'silver sale failed',
              error: err,
              hash: parseTransactionHash(err.message)
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

const parseTransactionHash = (err) => {
    const hashFieldIndex = err.indexOf("transactionHash");
    let hashValue;
    if (hashFieldIndex !== -1) {
        const hashValueStart = err.indexOf("0x", hashFieldIndex);
        const hashValueEnd = err.indexOf("\"", hashValueStart);
        hashValue = err.substring(hashValueStart, hashValueEnd);
    }
    console.log('ERROR TX HASH: ', hashValue);
    return hashValue;
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