import {
    AUCTION_DETAILS_RECEIVED,
    AUCTION_END,
    AUCTION_START,
    BUYING_GEM, CLEAR_GEM_PAGE, GEM_AUCTION_DETAILS_RECEIVED, GEM_DETAILS_RECEIVED,
    GEM_GIFTING,
    GEM_LEVEL_UP, GEM_MINING_DETAILS_RECEIVED, GEM_TX_DETAILS_RECEIVED,
    GEM_UPGRADE, IN_AUCTION, MINING
} from './itemConstants';
import {FETCH_DATA_BEGUN, FETCH_DATA_SUCCEEDED,} from '../../app/reduxConstants';
import {db} from '../../app/utils/firebase';
import {createAuctionHelper, removeAuctionHelper} from './helpers';
import {setError} from '../../app/appActions';
import {addPendingTransaction, getUpdatedTransactionHistory} from '../transactions/txActions';
import {utils} from "web3";
import {BigNumber} from "bignumber.js";
import {BINDING_GEM, PROCESSING, UNBINDING_GEM} from "../plots/plotConstants";
import {gradeConverter} from "../market/helpers";


export const getGemData = tokenId => async (dispatch, getState) => {
    // dispatch({type: FETCH_DATA_BEGUN});
    try {
        const gemService = getState().app.gemServiceInstance;
        const gem = await gemService.getGem(tokenId);
        dispatch({
            type: GEM_DETAILS_RECEIVED,
            payload: gem,
        });
    }
    catch (e) {
        setError(e);
    }
};

export const getGemAuctionData = tokenId => async (dispatch, getState) => {
    const auctionService = getState().app.auctionServiceInstance;
    const auctionData = await auctionService.getGemAuctionData(tokenId);

    dispatch({
        type: GEM_AUCTION_DETAILS_RECEIVED,
        payload: auctionData
    });
};

export const getGemMiningData = tokenId => async (dispatch, getState) => {
    const plotService = getState().app.plotServiceInstance;
    const plotMined = await plotService.getPlotBoundToGem(tokenId);
    dispatch({
        type: GEM_MINING_DETAILS_RECEIVED,
        payload: {plotMined},
    });
};

export const getGemTransactionData = gem => async (dispatch, getState) => {
    const pendingTransactions = getState().tx.pendingTransactions;
    const currentUserId = getState().auth.currentUserId;
    const tx = (currentUserId.toLowerCase() === gem.owner.toLowerCase()) && pendingTransactions && findItemPendingTx(gem.id, pendingTransactions);

    dispatch({
        type: GEM_TX_DETAILS_RECEIVED,
        payload: {txType: tx && tx.type},
    });
};


const findItemPendingTx = (gemId, pendingTransactions) => {
    return pendingTransactions && pendingTransactions.find((tx) => {
        if (tx.type === GEM_UPGRADE || tx.type === GEM_LEVEL_UP || tx.type === GEM_GIFTING
          || tx.type === AUCTION_START || tx.type === AUCTION_END || tx.type === BUYING_GEM || tx.type === PROCESSING || tx.type === BINDING_GEM || tx.type === UNBINDING_GEM) {
            if (tx.body && tx.body.gemId && tx.body.gemId.toString() === gemId.toString()) {
                return true;
            }
        }
    });
};

export const getOwnerDataByOwnerId = async ownerId => {
    try {
        const userIdToLowerCase = ownerId
          .split('')
          .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
          .join('');

        return db
          .doc(`users/${userIdToLowerCase}`)
          .get()
          .then(doc => doc.data())
    } catch (err) {
        setError(err);
    }
};

export const createAuction = (payload, createCallback, history) => async (dispatch, getState) => {
    const {auth, app} = getState();
    const currentAccount = auth.currentUserId;
    const {gemContract} = app;

    const {
        tokenId, duration, startPrice, endPrice,
    } = payload;

    // construct auction parameters
    const token = new BigNumber(tokenId);
    const t0 = Math.round(new Date().getTime() / 1000) || 0;
    const t1 = t0 + duration;
    const p0 = startPrice;
    const p1 = endPrice;
    const two = new BigNumber(2);

    // converts BigNumber representing Solidity uint256 into String representing Solidity bytes
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

    // convert auction parameters to bytecode for smart contract
    const data = toBytes(
      two
        .pow(224)
        .times(t0)
        .plus(two.pow(192).times(t1))
        .plus(two.pow(96).times(p0))
        .plus(p1),
    );
    let txHash;
    return gemContract.methods
      .safeTransferFrom(currentAccount, process.env.REACT_APP_DUTCH_AUCTION, token, data)
      .send({}, {messages: {txType: AUCTION_START, description: `Adding gem ${token} to auction`}})
      .on('transactionHash', hash => {
          txHash = hash;
          addPendingTransaction({
              hash: hash,
              userId: currentAccount,
              type: AUCTION_START,
              description: `Adding gem ${token} to auction`,
              body: {
                  gemId: tokenId,
              }
          })(dispatch, getState);
      })
      .on('receipt', receipt => {
      })
      .on('error', err => {
          if (txHash) {
              getUpdatedTransactionHistory()(dispatch, getState);
          }
      });
};

// @notice removes a gem from an auction
export const removeFromAuction = (tokenId, history, turnLoaderOff) => async (
  dispatch,
  getState,
) => {
    const dutchContract = getState().app.auctionContract;
    const currentUser = getState().auth.currentUserId;
    // eslint-disable-next-line
    const gemContractAddress = getState().app.gemContract.options.address;
    let txHash;
    removeAuctionHelper(dutchContract, tokenId, gemContractAddress)
      .send({
          from: currentUser,
      }, {messages: {txType: AUCTION_END, description: `Removing gem ${tokenId} from auction`}})
      .on('transactionHash', (hash) => {
          txHash = hash;
          addPendingTransaction({
              hash: hash,
              userId: currentUser,
              type: AUCTION_END,
              description: `Removing gem ${tokenId} from auction`,
              body: {
                  gemId: tokenId,
              }
          })(dispatch, getState);
      })
      .on('receipt', (receipt) => {

      })
      .on('error', (err) => {
          if (txHash) {
              getUpdatedTransactionHistory()(dispatch, getState);
          }
      });
};

// @notice lets users buy a gem in an active auction
export const handleBuyNow = (gem, _from, history, setLoading) => (dispatch, getState) => {
    const dutchAuctionContractInstance = getState().app.auctionContract;
    const priceInEth = gem.currentPrice;
    // eslint-disable-next-line
    const gemContractAddress = getState().app.gemContract.options.address;
    const currentUser = getState().app.currentAccount;
    let txHash;
    return dutchAuctionContractInstance.methods
      .buy(gemContractAddress, gem.id)
      .send({
          value:  Number(utils.toWei(priceInEth.toString(), 'ether'))
      }, {messages: {txType: BUYING_GEM, description: `Buying gem ${gem.id} for ${priceInEth} ETH`}})
      .on('transactionHash', (hash) => {
          txHash = hash;
          addPendingTransaction({
              hash: hash,
              userId: currentUser,
              type: BUYING_GEM,
              description: `Buying gem ${gem.id} for ${priceInEth} ETH`,
              body: {
                  gemId: gem.id,
              }
          })(dispatch, getState);
      })
      .on('receipt', (receipt) => {
          setLoading(false);
      })
      .on('error', (err) => {
          setLoading(false);
          if (txHash) {
              getUpdatedTransactionHistory()(dispatch, getState);
          }
      });
};


export const clearGemPage = () => {
    return dispatch => dispatch({type: CLEAR_GEM_PAGE});
};

export const giftGem = (gemId, addressTo) => (dispatch, getState) => {
    const gemsContract = getState().app.gemContract;
    const from = getState().app.currentAccount;
    const to = addressTo;
    const tokenId = gemId;
    let txHash;
    gemsContract.methods
      .safeTransferFrom(from, to, tokenId)
      .send({}, {messages: {txType: GEM_GIFTING, description: `Gifting gem ${gemId} to ${addressTo}`}})
      .on('transactionHash', hash => {
          txHash = hash;
          addPendingTransaction({
              hash: hash,
              userId: currentUser,
              type: GEM_GIFTING,
              description: `Gifting gem ${gemId} to ${addressTo}`,
              body: {
                  gemId: gemId,
                  to: addressTo
              }
          })(dispatch, getState)
      })
      .on('error', (error) => {
          if (txHash) {
              getUpdatedTransactionHistory()(dispatch, getState);
          }
      });
};

export const upgradeGem = (gem, levelUp, gradeUp, hidePopup, cost) => (dispatch, getState) => {
    console.log(333333333333, 'upgrading...');
    const workshopContract = getState().app.workshopContract;
    const gemService = getState().app.gemServiceInstance;
    console.log('Contract: ', workshopContract);
    const currentUser = getState().app.currentAccount;
    console.log('TX start');
    let silver = 0, gold = 0 , key;
    if (levelUp > 0) {
        silver = cost;
        key = 'upgradingLevel';
        gem[key] = true;
        //dispatch({type: 'GEM UPGRADING'})
    } else {
        gold = cost;
        key = 'upgradingGrade';
        gem[key] = true;
    }
    let txHash;
    return workshopContract.methods
      .upgrade(gem.id, levelUp, gradeUp, silver, gold)
      .send({}, {messages: {txType: gradeUp > 0 ? GEM_UPGRADE : GEM_LEVEL_UP, description: `Upgrading gem ${gem.id}`}})
      .on('transactionHash', (hash) => {
          txHash = hash;
          addPendingTransaction({
              hash: hash,
              userId: currentUser,
              type: gradeUp > 0 ? GEM_UPGRADE : GEM_LEVEL_UP,
              description: `Upgrading gem ${gem.id}: from ${gem.level} ${gradeConverter(gem.gradeType)} to ${+gem.level + levelUp} ${gradeConverter(+gem.gradeType + gradeUp)}`,
              body: {
                  gemId: gem.id,
                  levelFrom: gem.level,
                  gradeFrom: gem.gradeType,
                  levelUp,
                  gradeUp,
              }
          })(dispatch, getState);
          hidePopup();
      })
      .on('receipt', async (receipt) => {
          console.warn("RECEIPT UPGRADE:", receipt);
      })
      .on('error', (err) => {
          gem[key] = false;
          hidePopup();
          if (txHash) {
              getUpdatedTransactionHistory()(dispatch, getState);
          }
      });
};
