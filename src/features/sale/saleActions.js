import {completedTx, ErrorTx, startTx} from "../transactions/txActions";
import {AUCTION_DETAILS_RECEIVED} from "../items/itemConstants";
import {parseTransactionHashFromError} from "../transactions/helpers";

export const buyGeode = (type, amount, price, referralPointsUsed, hidePopup) => async (dispatch, getState) => {

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
              referralPointsUsed,
              cost: price,
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

export const getBoxesAvailableData = () => async (dispatch, getState) => {

    const silverGoldService = getState().app.silverGoldServiceInstance;
    const boxesAvailable = await silverGoldService.getBoxesAvailable();
    console.log('BOXES AVAILABLE: ', boxesAvailable);
    const boxesPrices = await silverGoldService.getBoxesPricesArray();
    console.log('BOXES PRICES: ', boxesPrices);
    return {boxesAvailable, boxesPrices}
    //const total = await silverGoldService.getBoxesToSell();
};