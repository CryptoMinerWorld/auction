import {MINING, NO_GEM} from "../plots/plotConstants";

export const plotSaleEventListeners = ({plotService, plotIssuedCallback}) => {

    plotService.plotSaleContract.events.PlotIssued({
        fromBlock: 'latest'
    })
      .on('data', function (event) {
          plotIssuedCallback();
      })
      .on('changed', function (event) {
          console.log('CHANGED EVENT:', event);
      })
      .on('error', console.error);

}