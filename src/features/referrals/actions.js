import { groupEventLogsByTransaction } from "../transactions/txActions"

export const getReferralHistory = () => async (dispatch, getState) => {
    
    const web3 = getState().app.web3;
    const plotSaleContract = getState().app.plotService.plotSaleContract;
    const refPointsContract = getState().app.silverGoldService.refPointsTrackerContract;

    let allEventLogsArray;
    try {
        //todo: change empirical amount of blocks for fromBlock parameter
        allEventLogsArray = [
            //todo: replace minerContracts[0] with iterating over all miner contracts
            await refPointsContract.getPastEvents("RefPointsIssued",
                  {
                      fromBlock: 6600000,
                      toBlock: 'latest',
                  }),
            await refPointsContract.getPastEvents("KnownAddressAdded",
                  {
                      fromBlock: 6600000,
                      toBlock: 'latest',
                  }),
        ].flat();
        //allEventLogsArray.sort((e1, e2) => e2.blockNumber !== e1.blockNumber ? e2.blockNumber - e1.blockNumber : e2.transactionIndex - e1.transactionIndex);
    }
    catch (e) {
        allEventLogsArray = [];
        console.error("Error while getting event logs:", e);
    }
    let referralTransactions = groupEventLogsByTransaction(allEventLogsArray, null);
    let transactions = await Promise.all(referralTransactions.map(async tx => 
      await web3.eth.getTransaction(tx.transactionHash)
    ))
    let purchaseTransactions = transactions.filter(tx => {
      return tx.input && tx.input.substring(2, 10) === "b749d63e" //buyRef method signature
    })
    let referrerStats = {} 
    purchaseTransactions.forEach(tx => {
      let referrer = "0x" + tx.input.substring(162, 202);
      let numberOfPlots = parseInt("0x" + tx.input.substring(74, 138));
      referrerStats[referrer] = referrerStats[referrer]? referrerStats[referrer] + numberOfPlots : numberOfPlots;
    })
    return referrerStats;
}