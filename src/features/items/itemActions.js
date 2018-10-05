import {
  AUCTION_DETAILS_RECEIVED,
  OWNERSHIP_TRANSFERRED,
  NEW_AUCTION_CREATED
} from './itemConstants';
import {
  FETCH_DATA_BEGUN,
  FETCH_DATA_SUCCEEDED,
  FETCH_DATA_FAILED,
  MODAL_VISIBLE,
  RELEASE_CONFETTI
} from '../../app/reduxConstants';
import { db } from '../../app/utils/firebase';
import { createAuctionHelper, removeAuctionHelper } from './helpers';

export const getAuctionDetails = tokenId => dispatch => {
  dispatch({ type: FETCH_DATA_BEGUN });
  try {
    db.collection(`stones`)
      .where(`id`, `==`, Number(tokenId))
      .onSnapshot(coll => {
        const gemDetails = coll.docs.map(doc => doc.data());
        dispatch({ type: FETCH_DATA_SUCCEEDED });
        dispatch({
          type: AUCTION_DETAILS_RECEIVED,
          payload: gemDetails[0]
        });
      });
  } catch (err) {
    dispatch({ type: FETCH_DATA_FAILED, payload: err });
  }
};

export const updateGemOwnership = (gemId, newOwner) => async dispatch => {
  // get name and image
  const newGemOwner = await db
    .doc(`users/${newOwner}`)
    .get()
    .then(doc => doc.data());
  const { name, imageURL } = newGemOwner;

  // update gem with new owner, name and image
  db.collection(`stones`)
    .where(`id`, `==`, gemId)
    .get()
    .then(coll => {
      const gem = coll.docs.map(doc => doc.id);
      db.doc(`stones/${gem[0]}`)
        .update({
          userName: name,
          userImage: imageURL,
          owner: newOwner,
          auctionIsLive: false
        })
        .then(() => {
          dispatch({ type: OWNERSHIP_TRANSFERRED });
          window.location.href = `${
            process.env.REACT_APP_BASE_URL
          }/profile/${newOwner}`;
        })
        .catch(err => console.log('err', err));
    });
};

export const createAuction = (payload, turnLoaderOff) => (
  dispatch,
  getState
) => {
  //  eslint-disable-next-line
  const currentAccount = getState().auth.currentUserId;
  //  eslint-disable-next-line
  const gemsContractInstance = getState().app.gemsContractInstance;

  try {
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
        .then(coll =>
          coll.docs.map(doc =>
            db.doc(`stones/${doc.id}`).update({
              auctionIsLive: true,
              deadline,
              minPrice,
              maxPrice
            })
          )
        )
        .then(() => turnLoaderOff())
        .catch(err => console.log('err', err));

      dispatch({
        type: NEW_AUCTION_CREATED,
        payload
      });
    });
  } catch (error) {
    console.log('error', error);
  }
};

// @notice removes a gem from an auction
export const removeFromAuction = tokenId => async (dispatch, getState) => {
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
          coll.docs.map(doc => {
            dispatch({
              type: 'GEM_REMOVED_FROM_AUCTION'
            });
            return db.doc(`stones/${doc.id}`).update({
              auctionIsLive: false
            });
          });
        })
    )
    .catch(error => console.log('remove auction error ', error));
};

// @notice lets users buy a gem in an active auction
export const handleBuyNow = (_tokenId, _from) => (dispatch, getState) => {
  const dutchAuctionContractInstance = getState().app.dutchContractInstance;
  const priceInWei = getState().auction.currentPrice;
  const gemContractAddress = getState().app.gemsContractInstance._address;

  dispatch({ type: MODAL_VISIBLE });

  dutchAuctionContractInstance.methods
    .buy(gemContractAddress, _tokenId)
    .send({
      value: priceInWei
    })
    .on('transactionHash', () => {
      dispatch({ type: RELEASE_CONFETTI });
    })
    .on('receipt', () => {
      updateGemOwnership(_tokenId, _from);
    })
    .on('error', err =>
      dispatch({
        type: FETCH_DATA_FAILED,
        payload: JSON.stringify(err)
      })
    );
};

export const getRestingEnergy = tokenId => (dispatch, getState) => {

  const gemContract = getState().app.gemsContractInstance
  return gemContract && gemContract.methods.getCreationTime(tokenId).call()
  .then(result => {
   
    const ageSeconds = (Date.now() / 1000 || 0) - result 
    const ageMinutes = Math.floor(ageSeconds / 60)
    const restingEnergyMinutes = Math.floor(-7E-06 * Math.pow(ageMinutes, 2) + 0.5406 * ageMinutes)

return restingEnergyMinutes
  }).catch(err => console.log('resting energy action err', err))
};
