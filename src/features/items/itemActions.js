import {
  AUCTION_DETAILS_RECEIVED,
  // OWNERSHIP_TRANSFERRED,
  NEW_AUCTION_CREATED,
  CLEAR_GEM_PAGE
} from './itemConstants';
import {
  FETCH_DATA_BEGUN,
  FETCH_DATA_SUCCEEDED,
  FETCH_DATA_FAILED,
  MODAL_VISIBLE,
  MODAL_GONE,
  RELEASE_CONFETTI
} from '../../app/reduxConstants';
import { db } from '../../app/utils/firebase';
import { createAuctionHelper, removeAuctionHelper } from './helpers';
// import { browserHistory } from 'react-router';

// import {getUserGemsOnce} from '../dashboard/dashboardActions'
export const getAuctionDetails = tokenId => dispatch => {
  dispatch({ type: FETCH_DATA_BEGUN });
  return db
    .collection(`stones`)
    .where(`id`, `==`, Number(tokenId))
    .get()
    .then(coll => {
      const gemDetails = coll.docs.map(doc => doc.data());
      dispatch({ type: FETCH_DATA_SUCCEEDED });
      dispatch({
        type: AUCTION_DETAILS_RECEIVED,
        payload: gemDetails[0]
      });
    })
    .catch(error => console.log('error getting Auction Details', error));
};

export const updateGemOwnership = (
  gemId,
  newOwner,
  history,
  priceInWei
) => async dispatch => {
  // get name and image
  const userIdToLowerCase = newOwner
    .split('')
    .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
    .join('');

  const newGemOwner = await db
    .doc(`users/${userIdToLowerCase}`)
    .get()
    .then(doc => doc.data())
    .catch(err => console.log('error fetching new gem owner details', err));

  const { name, imageURL } = newGemOwner;

  // update gem with new owner, name and image
  return db
    .collection(`stones`)
    .where(`id`, `==`, gemId)
    .get()
    .then(coll =>
      // doc.id);
      coll.docs.map(doc =>
        db
          .doc(`stones/${doc.id}`)
          .update({
            userName: name,
            userImage: imageURL,
            owner: userIdToLowerCase,
            auctionIsLive: false,
            lastSoldFor: priceInWei
          })
          .then(() => {
            // const payload = {...doc.data(), userName: name,
            //   userImage: imageURL,
            //   owner: userIdToLowerCase,
            //   auctionIsLive: false}
            //   console.log('payload ownership', payload)
            // dispatch({ type: OWNERSHIP_TRANSFERRED, payload });
            history.push(`/profile/${userIdToLowerCase}`);
            dispatch({ type: MODAL_GONE });
          })
          .catch(err => console.log('err', err))
      )
    );
};

export const createAuction = (payload, turnLoaderOff, history) => (
  dispatch,
  getState
) => {
  const currentAccount = getState().auth.currentUserId;
  const gemsContractInstance = getState().app.gemsContractInstance;

    const { tokenId, duration, startPrice, endPrice } = payload;

    createAuctionHelper(
      tokenId,
      duration,
      startPrice,
      endPrice,
      gemsContractInstance,
      currentAccount
    ).then(({ deadline, minPrice, maxPrice }) => {
      db.collection(`stones`)
        .where(`id`, `==`, tokenId)
        .get()
        .then(async coll => {
          const document = await coll.docs.map(doc => doc)[0];

          await db.doc(`stones/${document.id}`).update({
            auctionIsLive: true,
            deadline,
            minPrice,
            maxPrice,
            currentPrice: maxPrice
          });

          const completeGemInfo = {
            ...document.data(),
            auctionIsLive: true,
            deadline,
            minPrice,
            maxPrice,
            currentPrice: maxPrice
          };

          return dispatch({
            type: NEW_AUCTION_CREATED,
            payload: completeGemInfo
          });
        })
        .then(() => {
          // getUserGemsOnce(currentAccount)
          turnLoaderOff();
          history.push(`/profile/${currentAccount}`);
        })
        .catch(err => console.warn('err 1', err));
    }).catch(err => {
      turnLoaderOff();
      console.warn('user cancel auction creation error', err)});
  
};

// @notice removes a gem from an auction
export const removeFromAuction = (tokenId, history, turnLoaderOff) => async (
  dispatch,
  getState
) => {
  const dutchContract = getState().app.dutchContractInstance;
  const currentUser = getState().auth.currentUserId;
  const gemContractAddress = getState().app.gemsContractInstance._address;

  removeAuctionHelper(dutchContract, tokenId, gemContractAddress)
    .send({
      from: currentUser
    })
    .then(() =>
      db
        .collection(`stones`)
        .where(`id`, `==`, Number(tokenId))
        .get()
        .then(coll => {
          coll.docs.map(async doc => {
            await db.doc(`stones/${doc.id}`).update({
              auctionIsLive: false
            });
            dispatch({
              type: 'GEM_REMOVED_FROM_AUCTION',
              payload: doc.data().id
            });
            // getUserGemsOnce(currentUser)
            history.push(`/profile/${currentUser}`);
          });
        })
    )
    .catch(error => {
      console.log('error removing auction', error);
      turnLoaderOff();
    });
};

// @notice lets users buy a gem in an active auction
export const handleBuyNow = (_tokenId, _from, history) => (
  dispatch,
  getState
) => {
  const dutchAuctionContractInstance = getState().app.dutchContractInstance;
  const priceInWei = getState().auction.currentPrice;
  const gemContractAddress = getState().app.gemsContractInstance._address;

  dispatch({ type: MODAL_VISIBLE });

  console.log('_tokenId, _from', _tokenId, _from);

  return dutchAuctionContractInstance.methods
    .buy(gemContractAddress, _tokenId)
    .send({
      value: priceInWei
    })
    .on('transactionHash', () => {
      dispatch({ type: RELEASE_CONFETTI });
    })
    .on('receipt', () => dispatch(updateGemOwnership(_tokenId, _from, history, priceInWei)))
    .on('error', err => {
      dispatch({
        type: MODAL_GONE
      });
      dispatch({
        type: FETCH_DATA_FAILED,
        payload: JSON.stringify(err)
      });
    });
};

export const getRestingEnergy = tokenId => (dispatch, getState) => {
  const gemContract = getState().app.gemsContractInstance;
  return (
    gemContract &&
    gemContract.methods
      .getCreationTime(tokenId)
      .call()
      .then(result => {
        const ageSeconds = (Date.now() / 1000 || 0) - result;
        const ageMinutes = Math.floor(ageSeconds / 60);
        const restingEnergyMinutes = Math.floor(
          -7e-6 * Math.pow(ageMinutes, 2) + 0.5406 * ageMinutes
        );

        return restingEnergyMinutes;
      })
      .catch(err => console.log('resting energy action err', err))
  );
};

export const clearGemPageOnExit = gemId => dispatch =>
  dispatch({ type: CLEAR_GEM_PAGE });
