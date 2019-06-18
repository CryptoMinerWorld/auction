import {
    EVENT_HISTORY_RECEIVED,
    NEW_PENDING_TRANSACTION,
    TRANSACTION_RESOLVED,
    TX_COMPLETED,
    TX_CONFIRMED,
    TX_ERROR,
    TX_FAILED,
    TX_PENDING,
    TX_STARTED
} from './txConstants';

import {setError} from '../../app/appActions';
import {db} from "../../app/utils/firebase";
import {plotSale} from "../plotsale/plotSaleReducer";

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
    console.log("~~~~~~ get updated TRANSACTION history ~~~~~~");
    const web3 = getState().app.web3;
    const minerContract = getState().app.plotServiceInstance.minerContract;
    const auctionContract = getState().app.dutchContractInstance;
    console.log("~~~~~~ get updated TRANSACTION history 2 ~~~~~~");
    const gemContract = getState().app.gemsContractInstance;
    console.log("~~~~~~ get updated TRANSACTION history 3 ~~~~~~");
    // const plotSaleContract = getState().plotServiceInstance.plotSaleContract;
    console.log("~~~~~~ get updated TRANSACTION history 4 ~~~~~~");

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
    const resolvedFailedTransactions = [];
    const resolvedStoredTransactions = await Promise.all(storedPendingTransactionDocs.docs.map(async (pendingTxDoc) => {
        const storedTx = pendingTxDoc.data();
        console.log("STORED TRANSACTION:", storedTx);
        const receipt = await web3.eth.getTransactionReceipt(storedTx.hash);
        console.log("TRANSACTION RECEIPT:", receipt);
        if (receipt) {
            if (!receipt.status) {
                resolvedFailedTransactions.push(storedTx);
            }
            else {
                resolvedStoredTransactionHashes.push(receipt.transactionHash);
            }
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
    console.log("RESOLVED STORED TRANSACTIONS HASHES LENGTH", resolvedStoredTransactionHashes.length);
    console.log("RESOLVED STORED TRANSACTIONS", resolvedStoredTransactions);
    console.log("PENDING TRANSACTIONS", pendingTransactions);

    const latestBlock = await web3.eth.getBlockNumber();
    console.log("LATEST BLOCK:", latestBlock);

    //todo: change empirical amount of blocks for fromBlock parameter
    const [minerEventLogs, auctionEventLogs, gemEventLogs, plotSaleEventLogs] = await Promise.all([
        minerContract.getPastEvents({
            event: "allEvents",
            filter: {'_by': currentUserId},
            fromBlock: latestBlock - 15000,
            toBlock: 'latest',
        }),
        auctionContract.getPastEvents({
            event: "allEvents",
            filter: {'_by': currentUserId, '_from': currentUserId},
            fromBlock: latestBlock - 15000,
            toBlock: 'latest',
        }),
        gemContract.getPastEvents({
            event: "allEvents",
            filter: {'_by': currentUserId, '_to': currentUserId, '_from': currentUserId},
            fromBlock: latestBlock - 15000,
            toBlock: 'latest',
        }),
        []
        // plotSaleContract.getPastEvents({
        //   event: "allEvents",
        //   filter: {'_by': currentUserId, 'owner': currentUserId},
        //   fromBlock: latestBlock - 7000,
        //   toBlock: 'latest',
        // }),
    ])

    console.log("MINER EVENT LOGS:", minerEventLogs);
    console.log("Auction EVENT LOGS:", auctionEventLogs);
    console.log("Gem EVENT LOGS:", gemEventLogs);
    console.log("Plot Sale EVENT LOGS:", plotSaleEventLogs);

    let transactionHistory = groupEventLogsByTransaction(minerEventLogs, auctionEventLogs, gemEventLogs, plotSaleEventLogs);
    resolvedStoredTransactions.forEach(storedTx => {
        if (storedTx.status === TX_CONFIRMED) {
            const resolvedTx = transactionHistory.find(tx => tx.transactionHash === storedTx.transactionHash);
            if (resolvedTx) {
                resolvedTx.unseen = true;
            }
        }
    })
    dispatch({
        type: EVENT_HISTORY_RECEIVED,
        payload: {transactionHistory, pendingTransactions, resolvedFailedTransactions},
    })
}

const groupEventLogsByTransaction = (minerEventLogs, auctionEventLogs, gemEventLogs, plotSaleEventLogs) => {
    const transactions = [];
    let currentTransaction = null;
    let previousTxHash = null;

    [minerEventLogs, auctionEventLogs, gemEventLogs, plotSaleEventLogs].forEach((eventLogs, type) => {
        for (let i = eventLogs.length - 1; i >= 0; i--) {
            if (previousTxHash !== eventLogs[i].transactionHash) {
                previousTxHash = eventLogs[i].transactionHash;
                currentTransaction && transactions.push(resolveTransactionDescription(currentTransaction, type));
                currentTransaction = {
                    events: [],
                    transactionHash: eventLogs[i].transactionHash,
                    blockNumber: eventLogs[i].blockNumber
                };
            }
            currentTransaction.events.push(eventLogs[i]);
        }
        currentTransaction && transactions.push(resolveTransactionDescription(currentTransaction, type));
        previousTxHash = null;
        currentTransaction = null;
    })
    return transactions.sort((tx1, tx2) => tx2.blockNumber - tx1.blockNumber);
}

const resolveTransactionDescription = (tx, type) => {
    return tx;
}

export const transactionResolved = (event) => async (dispatch, getState) => {
    const txUpdatedStored = await db
      .doc(`transactions/${event.transactionHash}`)
      .update({
          status: TX_CONFIRMED
      });
    dispatch({
        type: TRANSACTION_RESOLVED,
        payload: event
    })
}

export const addPendingTransaction = (transaction) => async (dispatch, getState) => {

    const newTx = {
        hash: transaction.hash,
        userId: transaction.userId,
        type: transaction.type,
        status: TX_PENDING,
        description: transaction.description,
        body: transaction.body,
    }
    try {
        const txStored = await db
          .doc(`transactions/${transaction.hash}`)
          .set(newTx);

        dispatch({
            type: NEW_PENDING_TRANSACTION,
            payload: newTx
        })

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
