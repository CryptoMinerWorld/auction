export const setSaleEventListeners = ({silverGoldService, handleUpdateSaleState, currentUserId, handleGetUserBalance}) => {

    silverGoldService.saleContract.events.SaleStateChanged({
        fromBlock: 'latest'
    })
      .on('data', function (event) {
          handleUpdateSaleState(event);
          console.log('DATA EVENT:', event); // same results as the optional callback above
      })
      .on('changed', function (event) {
          // remove event from local database
      })
      .on('error', console.error);

    silverGoldService.saleContract.events.Unboxed({
        filter: {'_by': currentUserId},
        fromBlock: 'latest'
    })
      .on('data', function (event) {
          handleGetUserBalance(currentUserId);
          console.log('DATA EVENT:', event); // same results as the optional callback above
      })
      .on('changed', function (event) {
          // remove event from local database
      })
      .on('error', console.error);
}