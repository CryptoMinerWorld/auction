import {
  AUCTION_DETAILS_RECEIVED,
  OWNERSHIP_TRANSFERRED,
  NEW_AUCTION_CREATED
} from "./itemConstants";
import {
  FETCH_DATA_BEGUN,
  FETCH_DATA_SUCCEEDED,
  FETCH_DATA_FAILED
} from "../../app/reduxConstants";
import { db } from "../../app/utils/firebase";
import {createAuctionHelper} from './helpers'

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
        .catch(err => console.log("err", err));
    });
};


export const createAuction = payload => (dispatch, getState) => {
  //  eslint-disable-next-line
  const currentAccount = getState().auth.currentUserId;
  //  eslint-disable-next-line
  const gemsContractInstance = getState().app.gemsContractInstance;

  try {
    const { gemId, duration, startPrice, endPrice } = payload;

    createAuctionHelper(
      gemId,
      duration,
      startPrice,
      endPrice,
      gemsContractInstance,
      currentAccount
    ).then(({ deadline, minPrice, maxPrice }) => {
      db.collection(`stones`)
        .where(`id`, `==`, Number(payload.gemId))
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
        .catch(err => console.log("err", err));

      dispatch({
        type: NEW_AUCTION_CREATED,
        payload
      });
    });
  } catch (error) {
    console.log("error", error);
  }
};

// @notice removes a gem from an auction
export const removeFromAuction = tokenId => async (dispatch, getState) => {
  getState()
    .app.dutchContractInstance.methods.remove(tokenId)
    .send();

  db.collection(`stones`)
    .where(`id`, `==`, Number(tokenId))
    .get()
    .then(coll => {
      coll.docs.map(doc => {
        dispatch({
          type: "GEM_REMOVED_FROM_AUCTION"
        });
        return db.doc(`stones/${doc.id}`).update({
          auctionIsLive: false
        });
      });
    });
};