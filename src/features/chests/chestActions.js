import {addPendingTransaction, getUpdatedTransactionHistory} from "../transactions/txActions";
import {GEM_GIFTING} from "../items/itemConstants";
import {BigNumber} from "bignumber.js";
import {getUserBalance} from "../sale/saleActions";

export const submitKeys = (numberOfFounderKeys, numberOfChestKeys, chestId, reloadCallBack) => (dispatch, getState) => {
    const foundersKeyContract = getState().app.foundersKeyContract;
    const chestKeyContract = getState().app.chestKeyContract;
    const from = getState().auth.currentUserId;
    const to = process.env.REACT_APP_CHEST_FACTORY;
    let txHash;
    numberOfFounderKeys > 0 && foundersKeyContract.methods.safeTransferFrom(from, to, numberOfFounderKeys, abiPack(chestId))
      .send()
      .on('transactionHash', hash => {
          txHash = hash;
          addPendingTransaction({
              hash: hash,
              userId: from,
              type: `Submitting founder's keys`,
              description: `Submitting ${numberOfFounderKeys} founder's key(s)`,
          })(dispatch, getState)
      })
      .on('receipt', async (receipt) => {
          reloadCallBack();
      })
      .on('error', (error) => {
          if (txHash) {
              getUpdatedTransactionHistory()(dispatch, getState);
          }
      });

    numberOfChestKeys > 0 && chestKeyContract.methods.safeTransferFrom(from, to, numberOfChestKeys, abiPack(chestId))
      .send()
      .on('transactionHash', hash => {
          txHash = hash;
          addPendingTransaction({
              hash: hash,
              userId: from,
              type: 'Submitting chest keys',
              description: `Submitting ${numberOfChestKeys} chest key(s)`,
          })(dispatch, getState)
      })
      .on('receipt', async (receipt) => {
          reloadCallBack();
      })
      .on('error', (error) => {
          if (txHash) {
              getUpdatedTransactionHistory()(dispatch, getState);
          }
      });
};


export const withdrawKeys = (chestId, reloadCallBack) => (dispatch, getState) => {
    const chestContract = getState().app.chestFactoryContract;
    const from = getState().auth.currentUserId;
    let txHash;

    chestContract.methods.withdrawKeys(chestId, from)
      .send()
      .on('transactionHash', hash => {
          txHash = hash;
          addPendingTransaction({
              hash: hash,
              userId: from,
              type: 'Withdrawing keys',
              description: `Withdrawing key(s) back`,
          })(dispatch, getState)
      })
      .on('receipt', async (receipt) => {
          reloadCallBack();
      })
      .on('error', (error) => {
          if (txHash) {
              getUpdatedTransactionHistory()(dispatch, getState);
          }
      });
};

export const withdrawTreasure = (chestId) => (dispatch, getState) => {
    const chestContract = getState().app.chestFactoryContract;
    const from = getState().auth.currentUserId;
    let txHash;

    chestContract.methods.withdrawTreasure(chestId)
      .send()
      .on('transactionHash', hash => {
          txHash = hash;
          addPendingTransaction({
              hash: hash,
              userId: from,
              type: 'Withdrawing the Treasure',
              description: `Withdrawing the Treasure!`,
          })(dispatch, getState)
      })
      .on('error', (error) => {
          if (txHash) {
              getUpdatedTransactionHistory()(dispatch, getState);
          }
      });
};

function abiPack(chestId) {
    // pack and return
    return toBytes(new BigNumber(chestId));
}

const toBytes = (uint256) => {
    let s = uint256.toString(16);
    const len = s.length;
    // 256 bits must occupy exactly 64 hex digits
    if (len > 64) {
        s = s.substr(0, 64);
    }
    for (let i = 0; i < 64 - len; i += 1) {
        s = `0${s}`;
    }
    return `0x${s}`;
};
