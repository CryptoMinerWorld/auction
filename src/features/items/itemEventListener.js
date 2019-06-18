import {MINING, NO_GEM} from "../plots/plotConstants";

export const setItemEventListeners = ({gemService, gemChangedCallback, tokenId, transactionResolved}) => {
    console.log("SETTING UP EVENT LISTENERS");
    gemService.contract.events.LevelUp({
        filter: {'_tokenId': tokenId},
        fromBlock: 'latest'
    })
      .on('data', async function (event) {
          console.log("level up event ");
          gemChangedCallback(tokenId);
      })
      .on('changed', function (event) {
          console.log('CHANGED EVENT:', event);
      })
      .on('error', console.error);

    gemService.contract.events.Upgraded({
        filter: {'_tokenId': tokenId},
        fromBlock: 'latest'
    })
      .on('data', function (event) {
          gemChangedCallback(tokenId);
      })
      .on('changed', function (event) {
          console.log('CHANGED EVENT:', event);
      })
      .on('error', console.error);

    gemService.contract.events.EnergeticAgeModified({
        filter: {'_tokenId': tokenId},
        fromBlock: 'latest'
    })
      .on('data', function (event) {
          gemChangedCallback(tokenId);
      })
      .on('changed', function (event) {
          console.log('CHANGED EVENT:', event);
      })
      .on('error', console.error);

    gemService.contract.events.Transfer({
        filter: {'_tokenId': tokenId},
        fromBlock: 'latest'
    })
      .on('data', function (event) {
          gemChangedCallback(tokenId);
      })
      .on('changed', function (event) {
          console.log('CHANGED EVENT:', event);
      })
      .on('error', console.error);


    console.log("GEM EVENT LISTENERS SET UP");
}