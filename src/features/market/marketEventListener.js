import {MINING, NO_GEM} from "../plots/plotConstants";

export const setMarketEventListeners = ({auctionService, marketChangedCallback, transactionResolved}) => {

    auctionService.gemContract.events.Transfer({
        filter: {'_from': process.env.REACT_APP_DUTCH_AUCTION},
        fromBlock: 'latest'
    })
      .on('data', function (event) {
          marketChangedCallback();
      })
      .on('changed', function (event) {
          console.log('CHANGED EVENT:', event);
      })
      .on('error', console.error);


    auctionService.gemContract.events.Transfer({
        filter: {'_to': process.env.REACT_APP_DUTCH_AUCTION},
        fromBlock: 'latest'
    })
      .on('data', function (event) {
          marketChangedCallback();
      })
      .on('changed', function (event) {
          console.log('CHANGED EVENT:', event);
      })
      .on('error', console.error);

}