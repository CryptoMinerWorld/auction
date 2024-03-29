import {
    EVENT_HISTORY_RECEIVED,
    NEW_PENDING_TRANSACTION,
    TRANSACTION_RESOLVED,
    TX_CANCEL,
    TX_CANCEL_CONFIRMED,
    TX_CANCELED,
    TX_COMPLETED,
    TX_CONFIRMED,
    TX_ERROR,
    TX_FAILED,
    TX_PENDING, TX_REMOVED,
    TX_SPED_UP,
    TX_SPEED_UP,
    TX_SPEED_UP_CONFIRMED,
    TX_STARTED
} from './txConstants';

import {setError} from '../../app/appActions';
import {db} from "../../app/utils/firebase";
import React from "react";

export const startTx = tx => ({type: TX_STARTED, payload: tx});
export const completedTx = tx => ({type: TX_COMPLETED, payload: tx});
export const ErrorTx = tx => ({type: TX_ERROR, payload: {error: tx.error, ...tx}});

export const resolveTransactionEvent = (txEventObject) => async (dispatch, getState) => {
    //todo: handle all tx types and events;
    /*
       txEventObject:
       {
            categoryCode: String, // event category - List detailed below
                            txRequest: Function, // Transaction request has been initiated and is awaiting user approval
                            txSent: Function, // Transaction has been sent to the network
                            txPending: Function, // Transaction is pending and has been detected in the mempool
                            txSendFail: Function, // Transaction failed to be sent to the network
                            txStall: Function, // Transaction was sent but not confirmed in the blockchain after 30 secs
                            txFailed: Function, // Transaction failed
                            nsfFail: Function, // User doesn't have enough funds to complete transaction
                            txRepeat: Function, // Warning to user that they might be repeating a transaction
                            txAwaitingApproval: Function, // Warning to the user that they have a previous transaction awaiting approval
                            txConfirmReminder: Function, // A warning to the user that their current transaction is still awaiting approval
                            txConfirmed: Function, // Transaction is confirmed
                            txSpeedUp: Function // The user has re-submitted a transaction with a higher gas price
            eventCode: String, // event type - List detailed below
            contract: { // if not a contract method transaction, then this is undefined
                methodName: String, // name of the method that was called
                parameters: Array, // the parameters the method was called with
            },
            inlineCustomMsgs: Object | Boolean, // the inline custom messages passed to the transaction
            reason: String, // reason for error type notifications
            transaction: {
                id: String, // internal unique id for the transaction (remains constant even if transaction hash changes due to speedup or cancel)
                from: String, // the address the transaction was sent from
                gas: String, // the gas limit of the transaction
                gasPrice: String, // the gas price of the transaction
                to: String, // the address the transaction was sent to
                value: String // the value of the transaction
                hash: String // the transaction hash (updated to a new hash if transaction is sped up or cancelled)
                originalHash: String // if transaction was sped up or cancelled, the original transaction hash
            },
            wallet: {
                  address: String, // the account address of the wallet in use
                  balance: String, // the balance in wei of the wallet in use
                  minimum: Boolean, // whether the wallet has the minimum balance required (specified in config)
                  provider: String // the name of the wallet provider
            }
        }
    */
    if (!txEventObject) return;
    console.log("TX EVENT OBJECT:", txEventObject);

    const customData = txEventObject.inlineCustomMsgs;
    let tx;
    switch (txEventObject.eventCode) {
        case 'txConfirmed':
            let storedTxData;
            try {
                const storedTx = await db
                  .doc(`transactions/${txEventObject.transaction.hash}`)
                  .get();
                if (storedTx) storedTxData = storedTx.data();
            }
            catch (e) {
                console.error("Error getting stored transaction from firebase", e);
            }
            if (storedTxData) {
                console.log("STORED TX::", storedTxData.toString());
                //const storedTx = storedTx.data();
                switch (storedTxData.status) {
                    case TX_SPEED_UP:
                        if (txEventObject.transaction.originalHash) {
                            saveSpedUpOrCanceled(txEventObject.transaction.originalHash, storedTxData, TX_SPED_UP)(dispatch, getState);
                        }
                    {
                        updateTransaction(txEventObject.transaction.hash, {
                            status: TX_SPEED_UP_CONFIRMED
                        })
                    }
                        break;
                    case TX_CANCEL:
                        if (txEventObject.transaction.originalHash) {
                            saveSpedUpOrCanceled(txEventObject.transaction.originalHash, storedTxData, TX_CANCELED)(dispatch, getState);
                        }
                    {
                        updateTransaction(txEventObject.transaction.hash, {
                            status: TX_CANCEL_CONFIRMED
                        })
                    }
                        break;
                    default:
                        //tx of another type resolved on events handled
                        break;
                }
            }
            break;
        case 'txSpeedUp':
            tx = {
                hash: txEventObject.transaction.hash,
                userId: txEventObject.transaction.from,
                type: customData && customData.txType ? customData.txType : "",
                status: TX_SPEED_UP,
                description: customData && customData.description ? customData.description : "",
                body: {
                    originalHash: txEventObject.transaction.originalHash
                },
            };
            console.log("SAVE SPEED UP!");
            saveTransaction(tx)(dispatch, getState);
            break;
        case 'txCancel':
            tx = {
                hash: txEventObject.transaction.hash,
                userId: txEventObject.transaction.from,
                type: customData && customData.txType ? customData.txType : "",
                status: TX_CANCEL,
                description: customData && customData.description ? customData.description : "",
                body: {
                    originalHash: txEventObject.transaction.originalHash
                },
            };
            saveTransaction(tx)(dispatch, getState);
            break;
        case 'txFailed':
            break;
    }
    //const txType = txEventObject.inlineCustomMsgs && txEventObject.inlineCustomMsgs.txType;
    // addPendingTransaction({
    //     hash: txEventObject.transaction.hash,
    //     userId: txEventObject.transaction.from,
    //     type: txType,
    //     description: `Releasing gem ${plot.gemMinesId} from plot ${plot.id}`,
    //     body: {
    //         plot: plot.id,
    //         gemId: plot.gemMinesId,
    //     }
    // })(dispatch, getState);

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
    const web3 = getState().app.web3;
    const minerContracts = getState().app.plotService.minerContracts;
    const auctionContract = getState().app.auctionContract;
    const gemContract = getState().app.gemContract;
    const plotSaleContract = getState().app.plotService.plotSaleContract;
    const saleContract = getState().app.silverGoldService.saleContract;

    const currentUserId = getState().auth.currentUserId;
    let currentTransactionCount = 0;
    try {
        const currentUserId = getState().auth.currentUserId;
        currentTransactionCount = Number(await web3.eth.getTransactionCount(currentUserId));
    }
    catch (e) {
        console.error("Error when get transaction count", e);
    }

    console.log("NONCE:", await web3.eth.getTransactionCount(currentUserId));

    let storedPendingTransactionDocs, storedSpeedUpTransactionDocs, storedCancelTransactionDocs;
    try {
        [storedPendingTransactionDocs, storedSpeedUpTransactionDocs, storedCancelTransactionDocs] = await Promise.all([
            await db.collection('transactions')
              .where('userId', '==', currentUserId.toLowerCase())
              .where('status', '==', TX_PENDING)
              .get(),
            await db.collection('transactions')
              .where('userId', '==', currentUserId.toLowerCase())
              .where('status', '==', TX_SPEED_UP)
              .get(),
            await db.collection('transactions')
              .where('userId', '==', currentUserId.toLowerCase())
              .where('status', '==', TX_CANCEL)
              .get()
        ]);
    }
    catch(e) {
        [storedPendingTransactionDocs, storedSpeedUpTransactionDocs, storedCancelTransactionDocs] = [[], [], []];
        console.log("Error while getting transactions from firebase", e);
    }

    let lastBlockNumber;
    const resolvedStoredTransactionHashes = [];
    const pendingTransactions = [];
    const resolvedFailedTransactions = [];
    const inferredResolvedStoredTransactions = [];
    const resolvedStoredTransactions = await Promise.all(
      [...storedPendingTransactionDocs.docs,
          ...storedSpeedUpTransactionDocs.docs,
          ...storedCancelTransactionDocs.docs].map(async (pendingTxDoc) => {
          const storedTx = pendingTxDoc.data();

          const tx = await web3.eth.getTransaction(storedTx.hash);
          console.log("txTx", tx);
          const receipt = await web3.eth.getTransactionReceipt(storedTx.hash);

          if (receipt) {
              if (!receipt.status) {
                  resolvedFailedTransactions.push({...storedTx, status: TX_FAILED});
                  saveSpedUpOrCanceled(storedTx.hash, storedTx, TX_FAILED)(dispatch, getState);
                  return {...storedTx, status: TX_FAILED}
              }
              else {
                  if (storedTx.status === TX_SPEED_UP) {
                      if (receipt.status) {
                          const originalHash = storedTx.body && storedTx.body.originalHash;
                          saveSpedUpOrCanceled(originalHash, storedTx, TX_SPED_UP)(dispatch, getState);
                          inferredResolvedStoredTransactions.push({
                              transactionHash: originalHash,
                              status: TX_SPED_UP
                          });
                          resolvedStoredTransactionHashes.push(originalHash);
                      }
                      updateTransaction(storedTx.hash, {
                          status: receipt.status ? TX_SPEED_UP_CONFIRMED : TX_FAILED
                      });
                      resolvedStoredTransactionHashes.push(storedTx.hash);
                      return {
                          transactionHash: receipt.transactionHash,
                          description: storedTx.description,
                          status: receipt.status ? TX_SPEED_UP_CONFIRMED : TX_FAILED,
                          type: storedTx.type,
                          body: storedTx.body,
                      };
                  }
                  if (storedTx.status === TX_CANCEL) {
                      if (receipt.status) {
                          const originalHash = storedTx.body && storedTx.body.originalHash;
                          saveSpedUpOrCanceled(originalHash, storedTx, TX_CANCELED)(dispatch, getState);
                          inferredResolvedStoredTransactions.push({
                              transactionHash: originalHash,
                              status: TX_CANCELED
                          });
                          resolvedStoredTransactionHashes.push(originalHash)
                      }
                      updateTransaction(storedTx.hash, {
                          status: receipt.status ? TX_CANCEL_CONFIRMED : TX_FAILED
                      });
                      resolvedStoredTransactionHashes.push(storedTx.hash);
                      return {
                          transactionHash: receipt.transactionHash,
                          description: storedTx.description,
                          status: receipt.status ? TX_CANCEL_CONFIRMED : TX_FAILED,
                          type: storedTx.type,
                          body: storedTx.body,
                      };
                  }
              }
              if (storedTx.status === TX_PENDING) {
                  updateTransaction(storedTx.hash, {
                      status: receipt.status ? TX_CONFIRMED : TX_FAILED
                  });
                  return {
                      transactionHash: receipt.transactionHash,
                      description: storedTx.description,
                      status: receipt.status ? TX_CONFIRMED : TX_FAILED,
                      type: storedTx.type,
                      body: storedTx.body,
                  };
              }
          }
          else {
              pendingTransactions.push(storedTx);
              return storedTx;
          }
      }));

    const finalPendingTransactions = [];
    pendingTransactions.forEach(pending => {
        const inInferred = inferredResolvedStoredTransactions
          .find(txPart => txPart.transactionHash.toLowerCase() === pending.hash);
        if (inInferred) {
            resolvedStoredTransactions.push({...pending, ...inInferred});
        } else {
            if (pending && pending.transactionCount && pending.transactionCount < currentTransactionCount) {
                updateTransaction(pending.hash, {status: TX_REMOVED});
            } else {
                if (!resolvedStoredTransactionHashes.includes(pending.hash)) {
                    finalPendingTransactions.push(pending)
                }
            }
        }
    });
    const latestBlock = await web3.eth.getBlockNumber();
    let allEventLogsArray;
    try {
        //todo: change empirical amount of blocks for fromBlock parameter
        allEventLogsArray = [
            //todo: replace minerContracts[0] with iterating over all miner contracts
            (await Promise.all(minerEventWhitelist.map(async event => {
                return minerContracts[0].getPastEvents(event,
                  {
                      filter: {'_by': currentUserId},
                      fromBlock: latestBlock - 15000,
                      toBlock: 'latest',
                  })
            }))).flat(),
            (await Promise.all(minerEventWhitelist.map(async event => {
                return minerContracts[1].getPastEvents(event,
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
    }
    catch (e) {
        allEventLogsArray = [];
        console.error("Error while getting event logs:", e);
    }

    let transactionHistory = groupEventLogsByTransaction(allEventLogsArray, currentUserId);

    console.log("txTx History", transactionHistory);

    resolvedStoredTransactions.forEach(storedTx => {
        if (storedTx && [TX_CONFIRMED, TX_CANCEL_CONFIRMED, TX_CANCELED, TX_SPEED_UP_CONFIRMED, TX_SPED_UP].includes(storedTx.status)) {
            const resolvedTx = transactionHistory.find(tx => tx.transactionHash === storedTx.transactionHash);
            if (resolvedTx) {
                resolvedTx.unseen = true;
            }
        }
    });

    dispatch({
        type: EVENT_HISTORY_RECEIVED,
        payload: {transactionHistory, pendingTransactions: finalPendingTransactions, resolvedFailedTransactions},
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

    if (tx.events.find(e => e.event === "Updated")) {
        let lootArray = [0, 0, 0, 0, 0, 0, 0, 0, 0]; //9 types of loot
        let lootBlocksProcessed = 0;
        let lootPlotsProcessed = 0;
        tx.events.forEach((e) => {
            if (e.event !== "Updated") return;
            const newLootFound = e.returnValues;
            const newLootArray = newLootFound['loot'];
            if (newLootArray) {
                for (let i = 0; i < lootArray.length; i++) {
                    lootArray[i] = Number(lootArray[i]) + Number(newLootArray[i]);
                }
            }
            lootBlocksProcessed += (Number(newLootFound['offsetTo']) - Number(newLootFound['offsetFrom']));
            lootPlotsProcessed++;
        });
        let txDescription = "";

        if (lootArray.find(el => Number(el) > 0)) {
            txDescription += `${lootBlocksProcessed} block(s) of ${lootPlotsProcessed} plot(s) processed. Loot found:\n`;
            txDescription += Number(lootArray[0]) > 0 ? `${lootArray[0]} Level 1 Gem${Number(lootArray[0]) > 1 ? "s" : ""}; ` : "";
            txDescription += Number(lootArray[1]) > 0 ? `${lootArray[1]} Level 2 Gem${Number(lootArray[1]) > 1 ? "s" : ""}; ` : "";
            txDescription += Number(lootArray[2]) > 0 ? `${lootArray[2]} Level 3 Gem${Number(lootArray[2]) > 1 ? "s" : ""}; ` : "";
            txDescription += Number(lootArray[3]) > 0 ? `${lootArray[3]} Level 4 Gem${Number(lootArray[3]) > 1 ? "s" : ""}; ` : "";
            txDescription += Number(lootArray[4]) > 0 ? `${lootArray[4]} Level 5 Gem${Number(lootArray[4]) > 1 ? "s" : ""}; ` : "";
            txDescription += Number(lootArray[5]) > 0 ? `${lootArray[5]} Piece${Number(lootArray[5]) > 1 ? "s" : ""} of Silver; ` : "";
            txDescription += Number(lootArray[6]) > 0 ? `${lootArray[6]} Piece${Number(lootArray[6]) > 1 ? "s" : ""} of Gold; ` : "";
            txDescription += Number(lootArray[7]) > 0 ? `${lootArray[7]} Artifacts; ` : "";
            txDescription += Number(lootArray[8]) > 0 ? `${lootArray[8]} Key${Number(lootArray[8]) > 1 ? "s" : ""}; ` : "";
        }

        tx.description = txDescription;
    }

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
    const txUpdatedStored = await updateTransaction(event.transactionHash, {status: TX_CONFIRMED});
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

const updateTransaction = (transactionHash, txUpdate) => {
    try {
        db.doc(`transactions/${transactionHash}`)
          .update(txUpdate);
    }
    catch (err) {
        console.error("Error when update transaction:", err);
    }
};

export const saveTransaction = (transaction) => async (dispatch, getState) => {
    if (!(transaction && transaction.hash && transaction.userId)) {
        return;
    }
    let transactionCount = 0;
    try {
        const currentUserId = getState().auth.currentUserId;
        transactionCount = Number(await getState().app.web3.eth.getTransactionCount(currentUserId));
    }
    catch (e) {
        console.error("Error when get transaction count", e);
    }
    const newTx = {
        hash: transaction.hash,
        userId: transaction.userId.toLowerCase(),
        type: transaction.type || "",
        status: transaction.status || "",
        description: transaction.description || "",
        body: transaction.body || "",
        transactionCount,
        timestamp: Date.now(),
        dateTimeUTC: new Date().toUTCString()
    };

    console.log("saving transaction:", newTx);
    try {
        const txStored = await db
          .doc(`transactions/${newTx.hash}`)
          .set(newTx);
        console.log("STORED:::", txStored);
        dispatch({
            type: NEW_PENDING_TRANSACTION,
            payload: newTx
        });
        return txStored;
    }
    catch (e) {
        console.error(e);
    }
};

export const saveSpedUpOrCanceled = (txHash, storedTx, status) => async (dispatch, getState) => {
    const txUpdatedOriginal = await db
      .doc(`transactions/${txHash}`)
      .update({
          status: status
      });
    console.log("_TX_ SPED_UP or CANCELED UPDATED", txHash, status, storedTx);
    dispatch({
        type: TRANSACTION_RESOLVED,
        payload: {
            transactionHash: txHash,
            status: status,
            events: [],
            unseen: true,
            type: storedTx ? storedTx.type : status,
            description: storedTx ? storedTx.description : "",
        }
    });
    const originalTx = await db
      .doc(`transactions/${txHash}`)
      .get();
    if (originalTx) {
        const originalTxData = originalTx.data();
        if (originalTxData && originalTxData.body && originalTxData.body.originalHash) {
            saveSpedUpOrCanceled(originalTxData.body.originalHash, originalTxData, status)(dispatch, getState);
        }
    }
};

export const addPendingTransaction = (transaction) => async (dispatch, getState) => {
    transaction.status = TX_PENDING;
    saveTransaction(transaction)(dispatch, getState);
};

export const resolveTxManually = (txHash) => async (dispatch, getState) => {
    const txUpdatedOriginal = await db
      .doc(`transactions/${txHash}`)
      .update({
          status: 'EDITED'
      });
    dispatch({
        type: TRANSACTION_RESOLVED,
        payload: {
            transactionHash: txHash,
            status: 'DELETED',
            events: [],
            unseen: true,
            type: 'DELETED',
        }
    });
};

export const setTransactionsSeen = (unseenCount) => async (dispatch, getState) => {

    const firstSeen = getState().tx.transactions.findIndex((tx) => (tx.unseen));
    getState().tx.transactions.slice(firstSeen - unseenCount, firstSeen);

};
