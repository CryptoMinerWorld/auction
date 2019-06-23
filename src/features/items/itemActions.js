import {
    AUCTION_DETAILS_RECEIVED,
    AUCTION_END,
    AUCTION_START,
    BUYING_GEM,
    GEM_GIFTING,
    GEM_LEVEL_UP,
    GEM_UPGRADE
} from './itemConstants';
import {FETCH_DATA_BEGUN, FETCH_DATA_SUCCEEDED,} from '../../app/reduxConstants';
import {db} from '../../app/utils/firebase';
import {createAuctionHelper, removeAuctionHelper} from './helpers';
import {setError} from '../../app/appActions';
import {addPendingTransaction, getUpdatedTransactionHistory} from '../transactions/txActions';
import {utils} from "web3";
import {BigNumber} from "bignumber.js";
import {PROCESSING} from "../plots/plotConstants";


export const getGemData = tokenId => async (dispatch, getState) => {
    dispatch({type: FETCH_DATA_BEGUN});
    try {
        const gemService = getState().app.gemServiceInstance;
        const auctionService = getState().app.auctionServiceInstance;
        const pendingTransactions = getState().tx.pendingTransactions;
        const currentUserId = getState().auth.currentUserId;
        const gemData = gemService.getGem(tokenId);
        const auctionData = auctionService.getGemAuctionData(tokenId);
        const gem = {...(await gemData), ...(await auctionData)};
        const tx = (currentUserId.toLowerCase() === gem.owner.toLowerCase()) && pendingTransactions && findItemPendingTx(tokenId, pendingTransactions);
        gem.txType = tx && tx.type;
        dispatch({type: FETCH_DATA_SUCCEEDED});
        dispatch({
            type: AUCTION_DETAILS_RECEIVED,
            payload: {gem},
        });
    }
    catch (e) {
        setError(e);
    }
}

const findItemPendingTx = (gemId, pendingTransactions) => {
    return pendingTransactions && pendingTransactions.find((tx) => {
        if (tx.type === GEM_UPGRADE || tx.type === GEM_LEVEL_UP || tx.type === GEM_GIFTING
          || tx.type === AUCTION_START || tx.type === AUCTION_END || tx.type === BUYING_GEM || tx.type === PROCESSING) {
            if (tx.body && tx.body.gemId.toString() === gemId.toString()) {
                return true;
            }
        }
    });
}

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
}

export const createAuction = (payload, createCallback, history) => async (dispatch, getState) => {
    const {auth, app} = getState();
    const currentAccount = auth.currentUserId;
    const {gemsContractInstance} = app;

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
    return gemsContractInstance.methods
      .safeTransferFrom(currentAccount, process.env.REACT_APP_DUTCH_AUCTION, token, data)
      .send()
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
    const dutchContract = getState().app.dutchContractInstance;
    const currentUser = getState().auth.currentUserId;
    // eslint-disable-next-line
    const gemContractAddress = getState().app.gemsContractInstance.options.address;
    let txHash;
    removeAuctionHelper(dutchContract, tokenId, gemContractAddress)
      .send({
          from: currentUser,
      })
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
    const dutchAuctionContractInstance = getState().app.dutchContractInstance;
    const priceInEth = gem.currentPrice;
    // eslint-disable-next-line
    const gemContractAddress = getState().app.gemsContractInstance.options.address;
    const currentUser = getState().app.currentAccount;
    let txHash;
    return dutchAuctionContractInstance.methods
      .buy(gemContractAddress, gem.id)
      .send({
          value:  Number(utils.toWei(priceInEth.toString(), 'ether'))
      })
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

//
// export function clearGemPageOnExit() {
//     return dispatch => dispatch({type: CLEAR_GEM_PAGE});
// }

export const giftGem = (gemId, addressTo) => (dispatch, getState) => {
    const gemsContract = getState().app.gemsContractInstance;
    const from = getState().app.currentAccount;
    const to = addressTo;
    const tokenId = gemId;
    let txHash;
    gemsContract.methods
      .safeTransferFrom(from, to, tokenId)
      .send()
      .on('transactionHash', hash => {
          txHash = hash;
          addPendingTransaction({
              hash: hash,
              userId: currentUser,
              type: GEM_GIFTING,
              description: `Gifting the gem ${gemId}`,
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
}

export const upgradeGem = (gem, levelUp, gradeUp, hidePopup, cost) => (dispatch, getState) => {
    console.log(333333333333, 'upgrading...');
    const workshopContractInstance = getState().app.workshopContractInstance;
    const gemService = getState().app.gemServiceInstance;
    console.log('Contract: ', workshopContractInstance);
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
    return workshopContractInstance.methods
      .upgrade(gem.id, levelUp, gradeUp, silver, gold)
      .send()
      .on('transactionHash', (hash) => {
          txHash = hash;
          addPendingTransaction({
              hash: hash,
              userId: currentUser,
              type: gradeUp > 0 ? GEM_UPGRADE : GEM_LEVEL_UP,
              description: `Upgrading gem ${gem.id}`,
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
