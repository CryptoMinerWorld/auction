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

const auctionEventWhitelist = [
    'ItemAdded',
    'ItemRemoved',
    'ItemBought',
];

const minerEventWhitelist = [
    'Bound',
    'Updated',
    'Released',
    'RestingEnergyConsumed',
];

const gemEventWhitelist = [
    'LevelUp',
    'Upgraded',
];

const plotSaleEventWhitelist = [
    'PlotIssued',
    //todo: CouponConsumed event
];

export const getUpdatedTransactionHistory = () => async (dispatch, getState) => {
    console.log("~~~~~~ get updated TRANSACTION history ~~~~~~");
    const web3 = getState().app.web3;
    const minerContract = getState().app.plotServiceInstance.minerContract;
    const auctionContract = getState().app.dutchContractInstance;
    console.log("~~~~~~ get updated TRANSACTION history 2 ~~~~~~");
    const gemContract = getState().app.gemsContractInstance;
    console.log("~~~~~~ get updated TRANSACTION history 3 ~~~~~~");
    const plotSaleContract = getState().app.plotServiceInstance.plotSaleContract;
    console.log("~~~~~~ get updated TRANSACTION history 4 ~~~~~~");
    const saleContract = getState().app.silverGoldServiceInstance.saleContract;

    const currentUserId = getState().auth.currentUserId;
    const [storedPendingTransactionDocs, storedPendingTransactionDocsLowerCase] = await Promise.all([
      await db.collection('transactions')
      .where('userId', '==', currentUserId.toLowerCase())
      .where('status', '==', TX_PENDING)
      .get(),
        await db.collection('transactions')
      .where('userId', '==', currentUserId)
      .where('status', '==', TX_PENDING)
      .get()]);

    let lastBlockNumber;

    // const resolvedStoredTransactions = [];
    const resolvedStoredTransactionHashes = [];
    const pendingTransactions = [];
    const resolvedFailedTransactions = [];
    const resolvedStoredTransactions = await Promise.all([...storedPendingTransactionDocs.docs, ...storedPendingTransactionDocsLowerCase.docs].map(async (pendingTxDoc) => {
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

    console.log("CURRENT USER ID", currentUserId);

    //todo: change empirical amount of blocks for fromBlock parameter
    const allEventLogsArray = [
        (await Promise.all(minerEventWhitelist.map(async event => {
            return minerContract.getPastEvents(event,
              {
                  filter: {'_by': currentUserId},
                  fromBlock: latestBlock - 15000,
                  toBlock: 'latest',
              })
        }))).flat(),
        await auctionContract.getPastEvents('ItemAdded',
          {
              filter: {'_from': currentUserId},
              fromBlock: latestBlock - 15000,
              toBlock: 'latest',
          }),
        await auctionContract.getPastEvents('ItemRemoved',
          {
              filter: {'_to': currentUserId},
              fromBlock: latestBlock - 15000,
              toBlock: 'latest',
          }),
        await auctionContract.getPastEvents('ItemBought',
          {
              filter: {'_to': currentUserId},
              fromBlock: latestBlock - 15000,
              toBlock: 'latest',
          }),
        await gemContract.getPastEvents('Upgraded',
          {
              filter: {'_owner': currentUserId},
              fromBlock: latestBlock - 15000,
              toBlock: 'latest',
          }),
        await gemContract.getPastEvents('LevelUp',
          {
              filter: {'_owner': currentUserId},
              fromBlock: latestBlock - 15000,
              toBlock: 'latest',
          }),
        (await Promise.all(plotSaleEventWhitelist.map(async event => {
            return plotSaleContract.getPastEvents(event,
              {
                  filter: {'_by': currentUserId},
                  fromBlock: latestBlock - 15000,
                  toBlock: 'latest',
              })
        }))).flat(),
        await plotSaleContract.getPastEvents('CountryBalanceUpdated',
          {
              filter: {'owner': currentUserId},
              fromBlock: latestBlock - 15000,
              toBlock: 'latest',
          }),
        await gemContract.getPastEvents('Transfer',
          {
              filter: {'_to': currentUserId},
              fromBlock: latestBlock - 15000,
              toBlock: 'latest',
          }),
        await gemContract.getPastEvents('Transfer',
          {
              filter: {'_from': currentUserId},
              fromBlock: latestBlock - 15000,
              toBlock: 'latest',
          }),
        await auctionContract.getPastEvents('ItemBought',
          {
              filter: {'_from': currentUserId},
              fromBlock: latestBlock - 15000,
              toBlock: 'latest',
          }),
        await saleContract.getPastEvents('Unboxed',
          {
              filter: {'_by': currentUserId},
              fromBlock: latestBlock - 15000,
              toBlock: 'latest'
          }),
        // plotSaleContract.getPastEvents({
        //   event: "allEvents",
        //   filter: {'_by': currentUserId, 'owner': currentUserId},
        //   fromBlock: latestBlock - 7000,
        //   toBlock: 'latest',
        // }),
    ].flat();
    allEventLogsArray.sort((e1, e2) => e2.blockNumber !== e1.blockNumber ? e2.blockNumber - e1.blockNumber : e2.transactionIndex - e1.transactionIndex);

    console.log("ALL EVENTS LOGS ARRAY", allEventLogsArray);

    // console.log("MINER EVENT LOGS:", minerEventLogs);
    // console.log("Auction EVENT LOGS:", auctionEventLogs);
    // console.log("Gem EVENT LOGS:", gemEventLogs);
    // console.log("Plot Sale EVENT LOGS:", plotSaleEventLogs);

    let transactionHistory = groupEventLogsByTransaction(allEventLogsArray, currentUserId);
    resolvedStoredTransactions.forEach(storedTx => {
        if (storedTx.status === TX_CONFIRMED) {
            const resolvedTx = transactionHistory.find(tx => tx.transactionHash === storedTx.transactionHash);
            if (resolvedTx) {
                resolvedTx.unseen = true;
            }
        }
    });
    dispatch({
        type: EVENT_HISTORY_RECEIVED,
        payload: {transactionHistory, pendingTransactions, resolvedFailedTransactions},
    })
};

const groupEventLogsByTransaction = (sortedEventLogs, currentUserId) => {
    const transactions = [];
    let currentTransaction = null;
    let previousTxHash = null;

    for (let i = 0; i < sortedEventLogs.length; i++) {
        if (previousTxHash !== sortedEventLogs[i].transactionHash) {
            previousTxHash = sortedEventLogs[i].transactionHash;
            currentTransaction && transactions.push(resolveTransactionDescription(currentTransaction, currentUserId));
            currentTransaction = {
                events: [],
                transactionHash: sortedEventLogs[i].transactionHash,
                blockNumber: sortedEventLogs[i].blockNumber
            };
        }
        currentTransaction.events.push(sortedEventLogs[i]);
    }
    currentTransaction && transactions.push(resolveTransactionDescription(currentTransaction, currentUserId));
    return transactions;
};

const resolveTransactionDescription = (tx, currentUserId) => {

    if (!tx.events)
        return tx;

    if (tx.events.find(e => e.event === "Bound")) {
        tx.type = 'Gem bound';
        return tx;
    }
    if (tx.events.find(e => e.event === "Released")) {
        tx.type = 'Gem released';
        return tx;
    }
    if (tx.events.find(e => e.event === "RestingEnergyConsumed") && !tx.events.find(e => e.event === "Bound")) {
        tx.type = 'Gem used its energy';
        return tx;
    }
    if (tx.events.find(e => e.event === "Updated")) {
        if (tx.events.length > 1) {
            tx.type = 'Plots are processed';
        }
        else {
            tx.type = 'Plot is processed';
        }
        return tx;
    }
    if (tx.events.find(e => e.event === "ItemAdded")) {
        tx.type = 'Auction started';
        return tx;
    }
    if (tx.events.find(e => e.event === "ItemRemoved")) {
        tx.type = 'Auction removed';
        return tx;
    }
    if (tx.events.find(e => e.event === "ItemBought")) {
        const event = tx.events.find(event => event.event === "ItemBought");
        console.log("TO & Current:", event.returnValues['_to'], currentUserId);
        if (event.returnValues['_to'] === currentUserId) {
            tx.type = 'Gem purchased'
        } else {
            tx.type = 'Your gem purchased'
        }
        return tx;
    }
    if (tx.events.find(e => e.event === "LevelUp")) {
        tx.type = 'Gem Leveled up';
        return tx;
    }
    if (tx.events.find(e => e.event === "Upgraded")) {
        tx.type = 'Gem upgraded';
        return tx;
    }
    if (tx.events.find(e => e.event === "Transfer")) {
        const event = tx.events.find(event => event.event === "Transfer");
        if (event.returnValues['_to'] === currentUserId) {
            tx.type = `Gem #${event.returnValues['_tokenId']} acquired`
        } else {
            if (event.returnValues['_from'] === currentUserId) {
                tx.type = `Gem #${event.returnValues['_tokenId']} transferred`
            }
        }
        return tx;
    }
    if (tx.events.find(e => e.event === "PlotIssued")) {
        tx.type = 'Plots purchased';
        return tx;
    }
    if (tx.events.find(e => e.event === "CountryBalanceUpdated")) {
        tx.type = 'Plots purchased in your country';
        return tx;
    }
    if (tx.events.find(e => e.event === "Unboxed")) {
        const event = tx.events.find(e => e.event === "Unboxed");
        tx.type = 'Silver bought';
        tx.description = `Silver received: ${event.returnValues.silver} ` +
          `${event.returnValues.gold > 0 ? "Gold received: " + event.returnValues.gold : ""}`;
        return tx;
    }

    return tx;
};

export const transactionResolved = (event) => async (dispatch, getState) => {
    const txUpdatedStored = await db
      .doc(`transactions/${event.transactionHash}`)
      .update({
          status: TX_CONFIRMED
      });
    const transactionHistory = getState().tx.transactionHistory;
    let resolvedTx = transactionHistory && transactionHistory.find(tx => tx.transactionHash === event.transactionHash);
    if (resolvedTx) {
        resolvedTx.events.push(event);
        resolvedTx.unseen = true;
    }
    else {
        resolvedTx = resolveTransactionDescription({
            events: [],
            transactionHash: event.transactionHash,
            blockNumber: event.blockNumber,
        });
        resolvedTx.events.push(event);
        resolvedTx.unseen = true;
        //todo: bug is possible: firing updated event before bound/released will set tx type as 'plot processed'
        //todo: instead of bound/released
        console.warn("resolvedTx:", resolvedTx);
        const withDescription = resolveTransactionDescription(resolvedTx);
        console.warn("With description:", withDescription);
        dispatch({
            type: TRANSACTION_RESOLVED,
            payload: withDescription
        })
    }

};

export const addPendingTransaction = (transaction) => async (dispatch, getState) => {
    const newTx = {
        hash: transaction.hash,
        userId: transaction.userId,
        type: transaction.type,
        status: TX_PENDING,
        description: transaction.description,
        body: transaction.body,
    };
    try {
        const txStored = await db
          .doc(`transactions/${transaction.hash}`)
          .set(newTx);

        dispatch({
            type: NEW_PENDING_TRANSACTION,
            payload: newTx
        });

        //todo: payload: txStored?
        return txStored;
    }
    catch (e) {
        console.error(e);
    }

};

export const setTransactionsSeen = (unseenCount) => async (dispatch, getState) => {

    const firstSeen = getState().tx.transactions.findIndex((tx) => (tx.unseen));
    getState().tx.transactions.slice(firstSeen - unseenCount, firstSeen);

};


// DELETING DOCS WITH WHERE CLAUSE
// let jobskill_query = db.collection('transactions')
//   .where('userId', '==', currentUserId)
//   .where('status', '==', TX_PENDING);
// jobskill_query.get().then(function(querySnapshot) {
//     querySnapshot.forEach(function(doc) {
//         console.log('deleting:');
//         doc.ref.delete();
//     });
// });