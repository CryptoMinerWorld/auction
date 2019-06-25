export const setItemEventListeners = ({gemService, gemChangedCallback, tokenId}) => {
    console.log("SETTING UP EVENT LISTENERS");
    const subscriptions = [];

    subscriptions.push(
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
        .on('error', console.error)
    );

    subscriptions.push(
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
        .on('error', console.error)
    );

    subscriptions.push(
      gemService.contract.events.EnergeticAgeModified({
          filter: {'_tokenId': tokenId},
          fromBlock: 'latest'
      })
        .on('data', function (event) {
            console.log("event", event);
            gemChangedCallback(tokenId);
        })
        .on('changed', function (event) {
            console.log('CHANGED EVENT:', event);
        })
        .on('error', console.error)
    );

    subscriptions.push(
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
        .on('error', console.error)
    );

    return subscriptions;
    console.log("GEM EVENT LISTENERS SET UP");
}