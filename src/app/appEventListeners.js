export const setAppEventListeners = ({plotService, gemService, auctionService, silverGoldService, currentUserId, transactionResolved, updatedEventCallback}) => {

    console.log("set app event listeners start");

    // --------------------------------------------------------
    // --- Plot workshop transaction event listeners starts ---
    // --------------------------------------------------------

    const caughtEventIds = [];

    plotService.minerContracts[0].events.Updated({
        filter: {'_by': currentUserId},
        fromBlock: 'latest'
    })
      .on('data', function (event) {
          console.warn("<< << << updated app event");
          if (event.returnValues['_by'] !== currentUserId) {
              console.error("_by address is different from current user address.", event.returnValues['_by'], currentUserId);
          }
          else {
              if (!caughtEventIds.includes(event['id'])) {
                  caughtEventIds.push(event['id']);
                  console.warn('event pushed');
                  transactionResolved(event);
                  if (event.returnValues['loot'])
                      updatedEventCallback(event);
              }
          }
      })
      .on('changed', function (event) {
      })
      .on('error', console.error);

    //todo: replace [0] with iterating over all miner contracts
    plotService.minerContracts[0].events.Released({
        filter: {'_by': currentUserId},
        fromBlock: 'latest'
    })
      .on('data', function (event) {
          if (!caughtEventIds.includes(event['id'])) {
              caughtEventIds.push(event['id']);
              transactionResolved(event);
          }
      })
      .on('changed', function (event) {
          console.log('CHANGED EVENT:', event);
      })
      .on('error', console.error);

    plotService.minerContracts[0].events.Bound({
        filter: {'_by': currentUserId},
        fromBlock: 'latest'
    })
      .on('data', function (event) {
          if (!caughtEventIds.includes(event['id'])) {
              caughtEventIds.push(event['id']);
              transactionResolved(event);
          }
      })
      .on('changed', function (event) {
          console.log('CHANGED EVENT:', event);
      })
      .on('error', console.error);

    plotService.minerContracts[0].events.RestingEnergyConsumed({
        filter: {'_by': currentUserId},
        fromBlock: 'latest'
    })
      .on('data', function (event) {
          if (!caughtEventIds.includes(event['id'])) {
              caughtEventIds.push(event['id']);
              transactionResolved(event);
          }
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
          if (!caughtEventIds.includes(event['id'])) {
              caughtEventIds.push(event['id']);
              transactionResolved(event)
          }
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
          if (!caughtEventIds.includes(event['id'])) {
              caughtEventIds.push(event['id']);
              transactionResolved(event)
          }
      })
      .on('changed', function (event) {
          console.log('CHANGED EVENT:', event);
      })
      .on('error', console.error);

    // --------------------------------------------------------
    // --- Gem market transaction event listeners starts ---
    // --------------------------------------------------------

    gemService.auctionContract.events.ItemRemoved({
        filter: {'_to': currentUserId},
        fromBlock: 'latest'
    })
      .on('data', function (event) {
          if (!caughtEventIds.includes(event['id'])) {
              caughtEventIds.push(event['id']);
              transactionResolved(event)
          }
      })
      .on('changed', function (event) {
          console.log('CHANGED EVENT:', event);
      })
      .on('error', console.error);


    gemService.auctionContract.events.ItemAdded({
        filter: {'_from': currentUserId},
        fromBlock: 'latest'
    })
      .on('data', function (event) {
          if (!caughtEventIds.includes(event['id'])) {
              caughtEventIds.push(event['id']);
              transactionResolved(event)
          }
      })
      .on('changed', function (event) {
          console.log('CHANGED EVENT:', event);
      })
      .on('error', console.error);

    gemService.auctionContract.events.ItemBought({
        filter: {'_to': currentUserId},
        fromBlock: 'latest'
    })
      .on('data', function (event) {
          if (!caughtEventIds.includes(event['id'])) {
              caughtEventIds.push(event['id']);
              transactionResolved(event)
          }
      })
      .on('changed', function (event) {
          console.log('CHANGED EVENT:', event);
      })
      .on('error', console.error);

    // --------------------------------------------------------
    // --- Gem page transaction event listeners starts ---
    // --------------------------------------------------------

    gemService.contract.events.LevelUp({
        filter: {'_owner': currentUserId},
        fromBlock: 'latest'
    })
      .on('data', function (event) {
          if (!caughtEventIds.includes(event['id'])) {
              caughtEventIds.push(event['id']);
              transactionResolved(event)
          }
      })
      .on('changed', function (event) {
          console.log('CHANGED EVENT:', event);
      })
      .on('error', console.error);

    gemService.contract.events.Upgraded({
        filter: {'_owner': currentUserId},
        fromBlock: 'latest'
    })
      .on('data', function (event) {
          if (!caughtEventIds.includes(event['id'])) {
              caughtEventIds.push(event['id']);
              transactionResolved(event)
          }
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
          if (!caughtEventIds.includes(event['id'])) {
              caughtEventIds.push(event['id']);
              transactionResolved(event, currentUserId);
          }
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
          if (!caughtEventIds.includes(event['id'])) {
              caughtEventIds.push(event['id']);
              transactionResolved(event)
          }
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
          if (!caughtEventIds.includes(event['id'])) {
              caughtEventIds.push(event['id']);
              transactionResolved(event, currentUserId)
          }
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
          if (!caughtEventIds.includes(event['id'])) {
              caughtEventIds.push(event['id']);
              transactionResolved(event, currentUserId);
          }
      })
      .on('changed', function (event) {
          console.log('CHANGED EVENT:', event);
      })
      .on('error', console.error);

    gemService.gemBurnerContract.events.TradedForGold({
        filter: {'_by': currentUserId},
        fromBlock: 'latest'
    })
      .on('data', function (event) {
          if (!caughtEventIds.includes(event['id'])) {
              caughtEventIds.push(event['id']);
              transactionResolved(event, currentUserId);
          }
      })
      .on('changed', function (event) {
          console.log('CHANGED EVENT:', event);
      })
      .on('error', console.error);

    gemService.gemBurnerContract.events.TradedForSilver({
        filter: {'_by': currentUserId},
        fromBlock: 'latest'
    })
      .on('data', function (event) {
          if (!caughtEventIds.includes(event['id'])) {
              caughtEventIds.push(event['id']);
              transactionResolved(event, currentUserId);
          }
      })
      .on('changed', function (event) {
          console.log('CHANGED EVENT:', event);
      })
      .on('error', console.error);

    // --------------------------------------------------------
    // --- Silver sale transaction event listeners starts ---
    // --------------------------------------------------------

    silverGoldService.saleContract.events.Unboxed({
        filter: {'_by': currentUserId},
        fromBlock: 'latest'
    })
      .on('data', function (event) {
          if (!caughtEventIds.includes(event['id'])) {
              caughtEventIds.push(event['id']);
              transactionResolved(event)
          }
      })
      .on('changed', function (event) {
          console.log('CHANGED EVENT:', event);
      })
      .on('error', console.error);

    console.log('App Event Listeners set');

};
