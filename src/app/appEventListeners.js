export const setAppEventListeners = ({plotService, gemService, auctionService, silverGoldService, currentUserId, transactionResolved, updatedEventCallback}) => {

    console.log("set app event listeners start");

    // --------------------------------------------------------
    // --- Plot workshop transaction event listeners starts ---
    // --------------------------------------------------------

    plotService.minerContract.events.Updated({
        filter: {'_by': currentUserId},
        fromBlock: 'latest'
    })
      .on('data', function (event) {
          if (event.returnValues['_by'] !== currentUserId) {
              console.error("_by address is different from current user address.", event.returnValues['_by'], currentUserId);
          }
          else {
              transactionResolved(event);
              if (event.returnValues['loot'])
                  updatedEventCallback(event);
          }
      })
      .on('changed', function (event) {
      })
      .on('error', console.error);

    plotService.minerContract.events.Released({
        filter: {'_by': currentUserId},
        fromBlock: 'latest'
    })
      .on('data', function (event) {
          transactionResolved(event);
      })
      .on('changed', function (event) {
          console.log('CHANGED EVENT:', event);
      })
      .on('error', console.error);

    plotService.minerContract.events.Bound({
        filter: {'_by': currentUserId},
        fromBlock: 'latest'
    })
      .on('data', function (event) {
          transactionResolved(event);
      })
      .on('changed', function (event) {
          console.log('CHANGED EVENT:', event);
      })
      .on('error', console.error);

    plotService.minerContract.events.RestingEnergyConsumed({
        filter: {'_by': currentUserId},
        fromBlock: 'latest'
    })
      .on('data', function (event) {
          transactionResolved(event);
      })
      .on('changed', function (event) {
          console.log('CHANGED EVENT:', event);
      })
      .on('error', console.error);

    // --------------------------------------------------------
    // --- Plot sale transaction event listeners starts ---
    // --------------------------------------------------------

    plotService.plotSaleContract.events.PlotIssued({
        filter: {'_by': currentUserId},
        fromBlock: 'latest'
    })
      .on('data', function (event) {
          transactionResolved(event)
      })
      .on('changed', function (event) {
          console.log('CHANGED EVENT:', event);
      })
      .on('error', console.error);

    plotService.plotSaleContract.events.CouponConsumed({
        filter: {'_by': currentUserId},
        fromBlock: 'latest'
    })
      .on('data', function (event) {
          transactionResolved(event)
      })
      .on('changed', function (event) {
          console.log('CHANGED EVENT:', event);
      })
      .on('error', console.error);

    // --------------------------------------------------------
    // --- Gem market transaction event listeners starts ---
    // --------------------------------------------------------

    gemService.auctionContract.events.ItemRemoved({
        filter: {'_by': currentUserId},
        fromBlock: 'latest'
    })
      .on('data', function (event) {
          transactionResolved(event)
      })
      .on('changed', function (event) {
          console.log('CHANGED EVENT:', event);
      })
      .on('error', console.error);


    gemService.auctionContract.events.ItemAdded({
        filter: {'_by': currentUserId},
        fromBlock: 'latest'
    })
      .on('data', function (event) {
          transactionResolved(event)
      })
      .on('changed', function (event) {
          console.log('CHANGED EVENT:', event);
      })
      .on('error', console.error);

    gemService.auctionContract.events.ItemBought({
        filter: {'_by': currentUserId},
        fromBlock: 'latest'
    })
      .on('data', function (event) {
          transactionResolved(event)
      })
      .on('changed', function (event) {
          console.log('CHANGED EVENT:', event);
      })
      .on('error', console.error);


    // --------------------------------------------------------
    // --- Gem page transaction event listeners starts ---
    // --------------------------------------------------------

    gemService.contract.events.LevelUp({
        filter: {'_by': currentUserId},
        fromBlock: 'latest'
    })
      .on('data', function (event) {
          transactionResolved(event)
      })
      .on('changed', function (event) {
          console.log('CHANGED EVENT:', event);
      })
      .on('error', console.error);

    gemService.contract.events.Upgraded({
        filter: {'_by': currentUserId},
        fromBlock: 'latest'
    })
      .on('data', function (event) {
          transactionResolved(event)
      })
      .on('changed', function (event) {
          console.log('CHANGED EVENT:', event);
      })
      .on('error', console.error);

    // --------------------------------------------------------
    // -- Token transfer transaction event listeners starts ---
    // --------------------------------------------------------

    gemService.contract.events.Transfer({
        filter: {'_from': currentUserId},
        fromBlock: 'latest'
    })
      .on('data', function (event) {
          transactionResolved(event);
      })
      .on('changed', function (event) {
          console.log('CHANGED EVENT:', event);
      })
      .on('error', console.error);

    // ------------------------------------------------------------
    // -- Notify user about some other users transaction events ---
    // ------------------------------------------------------------

    plotService.plotSaleContract.events.CountryBalanceUpdated({
        filter: {'owner': currentUserId},
        fromBlock: 'latest'
    })
      .on('data', function (event) {
          transactionResolved(event)
      })
      .on('changed', function (event) {
          console.log('CHANGED EVENT:', event);
      })
      .on('error', console.error);

    gemService.auctionContract.events.ItemBought({
        filter: {'_from': currentUserId},
        fromBlock: 'latest'
    })
      .on('data', function (event) {
          transactionResolved(event)
      })
      .on('changed', function (event) {
          console.log('CHANGED EVENT:', event);
      })
      .on('error', console.error);

    gemService.contract.events.Transfer({
        filter: {'_to': currentUserId},
        fromBlock: 'latest'
    })
      .on('data', function (event) {
          transactionResolved(event);
      })
      .on('changed', function (event) {
          console.log('CHANGED EVENT:', event);
      })
      .on('error', console.error);

    // --------------------------------------------------------
    // --- Silver sale transaction event listeners starts ---
    // --------------------------------------------------------
    // todo: uncomment when sale contract wired;
    // silverGoldService.contract.events.Upgraded({
    //     filter: {'_owner': currentUserId},
    //     fromBlock: 'latest'
    // })
    //   .on('data', function (event) {
    //       const params = event.returnValues;
    //       changeGemCallback({id: params['_tokenId'], grade: params['_to']});
    //   })
    //   .on('changed', function (event) {
    //       console.log('CHANGED EVENT:', event);
    //   })
    //   .on('error', console.error);

    console.log('App Event Listeners set');

}
