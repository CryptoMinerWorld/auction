import {
    EVENT_HISTORY_RECEIVED,
    TX_COMPLETED,
    TX_CONFIRMED,
    TX_ERROR,
    TX_FAILED,
    TX_PENDING,
    TX_STARTED
} from './txConstants';

import {setError} from '../../app/appActions';
import {db} from "../../app/utils/firebase";

export const startTx = tx => ({type: TX_STARTED, payload: tx});
export const completedTx = tx => ({type: TX_COMPLETED, payload: tx});
export const ErrorTx = tx => ({type: TX_ERROR, payload: {error: tx.error, ...tx}});

export const resolveTXStatus = async (pendingTransactions, dbWrite, dbDelete, queryBlockchain) => {
    // eslint-disable-next-line
    for (const gemId of pendingTransactions) {
        try {
            // pendingTransactions.forEach(async (gemId) => {
            // eslint-disable-next-line
            const payload = await queryBlockchain(gemId);
            dbWrite(gemId, payload)
              .then(() => dbDelete(gemId))
              .catch(err => setError(err));
        } catch (err) {
            setError(err);
        }
    }
};

export const getUpdatedTransactionHistory = () => async (dispatch, getState) => {
    const web3 = getState().app.web3;
    const minerContract = getState().app.plotServiceInstance.minerContract;
    const currentUserId = getState().auth.currentUserId;
    const storedPendingTransactionDocs = await db.collection('transactions')
      .where('userId', '==', currentUserId)
      .where('status', '==', TX_PENDING)
      .get();

    console.log("STORED TRANSACTIONS DOCS:", storedPendingTransactionDocs);

    let lastBlockNumber;

    // const resolvedStoredTransactions = [];
    const resolvedStoredTransactionHashes = [];
    const pendingTransactions = [];
    const resolvedStoredTransactions = await Promise.all(storedPendingTransactionDocs.docs.map(async (pendingTxDoc) => {
        const storedTx = pendingTxDoc.data();
        console.log("STORED TRANSACTION:", storedTx);
        const receipt = await web3.eth.getTransactionReceipt(storedTx.hash);
        console.log("TRANSACTION RECEIPT:", receipt);
        if (receipt) {
            resolvedStoredTransactionHashes.push(receipt.transactionHash);
            const txUpdatedStored = await db
              .doc(`transactions/${storedTx.hash}`)
              .update({
                  status: receipt.status ? TX_CONFIRMED : TX_FAILED
              });
            console.log("UPDATED TRANSACTION STORED:", txUpdatedStored);
            return {
                transactionHash: receipt.transactionHash,
                description: storedTx.description,
                status: receipt.status ? TX_CONFIRMED : TX_FAILED,
                type: storedTx.type,
                body: storedTx.body,
            };
        }
        else {
            pendingTransactions.push(storedTx);
            return storedTx;
        }
    }));
    console.log("RESOLVED STORED TRANSACTIONS HASHES", resolvedStoredTransactionHashes);
    console.log("RESOLVED STORED TRANSACTIONS", resolvedStoredTransactions);
    console.log("PENDING TRANSACTIONS", pendingTransactions);

    const latestBlock = await web3.eth.getBlockNumber();
    console.log("LATEST BLOCK:", latestBlock);

    //todo: change empirical amount of blocks for fromBlock parameter
    const minerEventLogs = await minerContract.getPastEvents({
        event: "allEvents",
        filter: {'_by': currentUserId},
        fromBlock: latestBlock - 10000,
        toBlock: 'latest',
    });

    console.log("MINER EVENT LOGS:", minerEventLogs);

    let transactionHistory = [];
    if (resolvedStoredTransactionHashes.length > 0) {
        for (let i = minerEventLogs.length - 1; i >= 0; i--) {
            console.log("MINER EVENT", minerEventLogs[i]);
            const eventType = minerEventLogs[i].event;
            const unseen = resolvedStoredTransactionHashes.includes(minerEventLogs.transactionHash);
            transactionHistory.push({
                event: minerEventLogs[i].event,
                unseen: unseen,
                returnValues: minerEventLogs[i].returnValues,
                blockNumber: minerEventLogs[i].blockNumber,
                transactionHash: minerEventLogs[i].transactionHash,
            })
        }
    }
    else {
        transactionHistory = minerEventLogs.reverse();
    }

    dispatch({
        type: EVENT_HISTORY_RECEIVED,
        payload: {transactionHistory, pendingTransactions},
    })
}

export const addPendingTransaction = async (transaction) => {
    try {
        const txStored = await db
          .doc(`transactions/${transaction.hash}`)
          .set({
              hash: transaction.hash,
              userId: transaction.userId,
              type: transaction.type,
              status: TX_PENDING,
              description: transaction.description,
              body: transaction.body,
          })

        console.log("NEW TRANSACTION STORED:", txStored);
        //todo: payload: txStored?
        return txStored;
    }
    catch (e) {
        console.error(e);
    }
}

export const setTransactionsSeen = (unseenCount) => async (dispatch, getState) => {

    const firstSeen = getState().tx.transactions.findIndex((tx) => (tx.unseen));
    getState().tx.transactions.slice(firstSeen - unseenCount, firstSeen);

}
