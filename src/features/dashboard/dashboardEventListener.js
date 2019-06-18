import {MINING, NO_GEM} from "../plots/plotConstants";

export const setDashboardEventListeners = ({
                                               plotService,
                                               gemService,
                                               updatedEventCallback,
                                               releasedEventCallback,
                                               boundEventCallback,
                                               issuedEventCallback,
                                               reloadGemsCallback,
                                               changeGemCallback,
                                               currentUserId
                                           }) => {
    console.warn("!!!!!!!!!!!! SETTING UP EVENT LISTENERS !!!!!!!!!!!");
    plotService.minerContract.events.Updated({
        filter: {'_by': currentUserId},
        fromBlock: 'latest'
    })
      .on('data', async function (event) {
          console.warn("> >> >>> updated event");
          const eventParams = event.returnValues;
          updatedEventCallback({
              id: Number(eventParams['plotId']),
              processedBlocks: eventParams['offsetTo'],
//              gemMinesId: await plotService.getBoundGemId(eventParams['plotId']),
//              gemMines: null,
          });
      })
      .on('changed', function (event) {
          console.log('CHANGED EVENT:', event);
      })
      .on('error', console.error);

    plotService.minerContract.events.Released({
        filter: {'_by': currentUserId},
        fromBlock: 'latest'
    })
      .on('data', function (event) {
          const eventParams = event.returnValues;
          releasedEventCallback({
              id: Number(eventParams['plotId']),
              miningState: NO_GEM,
              gemMines: null,
              gemMinesId: null,
              state: 0
          });
          //reloadGemsCallback(currentUserId);
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
          console.warn(">>> >> > bound event");
          const eventParams = event.returnValues;
          boundEventCallback({
              id: Number(eventParams['plotId']),
              miningState: MINING,
              gemMinesId: eventParams['gemId'],
              state: 1
          });
          //reloadGemsCallback(currentUserId);
      })
      .on('changed', function (event) {
          console.log('CHANGED EVENT:', event);
      })
      .on('error', console.error);

    plotService.plotSaleContract.events.PlotIssued({
        filter: {'_by': currentUserId},
        fromBlock: 'latest'
    })
      .on('data', function (event) {
          issuedEventCallback();
      })
      .on('changed', function (event) {
          console.log('CHANGED EVENT:', event);
      })
      .on('error', console.error);

    gemService.auctionContract.events.ItemRemoved({
        filter: {'_by': currentUserId},
        fromBlock: 'latest'
    })
      .on('data', function (event) {
          //reloadGemsCallback(currentUserId);
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
          reloadGemsCallback(currentUserId);
      })
      .on('changed', function (event) {
          console.log('CHANGED EVENT:', event);
      })
      .on('error', console.error);


    gemService.contract.events.LevelUp({
        filter: {'_by': currentUserId},
        fromBlock: 'latest'
    })
      .on('data', function (event) {
          const params = event.returnValues;
          changeGemCallback({id: params['_tokenId'], level: params['_to']});
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
          const params = event.returnValues;
          changeGemCallback({id: params['_tokenId'], grade: params['_to']});
      })
      .on('changed', function (event) {
          console.log('CHANGED EVENT:', event);
      })
      .on('error', console.error);


}
