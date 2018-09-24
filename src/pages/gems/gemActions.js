import { AUCTION_DETAILS_RECEIVED, NEW_AUCTION_CREATED } from "./gemConstants";
import { db } from "../../utils/firebase";
// import store from '../../store'
import { createAuctionHelper } from "./helpers";

// export const getGemDetails = tokenId => dispatch => db
//  .doc(`auctions/${tokenId}`)
//  .get()
//  .then(doc => dispatch({
//      type:AUCTION_DETAILS_RECEIVED,
//      payload: doc.data()
//     }))
//  .catch(error => console.error('error', error))

export const getGemDetails = tokenId => dispatch =>
  db
    .collection(`stones`)
    .where(`id`, `==`, tokenId)
    .onSnapshot(coll => {
      const gemDetails = coll.docs.map(doc => doc.data());
      dispatch({
        type: AUCTION_DETAILS_RECEIVED,
        payload: gemDetails[0]
      });
    });

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
    ).then( () => {
      db.collection(`stones`)
        .where(`id`, `==`, payload.gemId)
        .get()
        .then(coll =>
          coll.docs.map(doc =>  db.doc(`stones/${doc.id}`).update({ auctionIsLive: true })
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
    .send().on('receipt', (receipt) => console.log('receipt',receipt ))
    // .then(() =>
    //   db
    //     .collection(`stones`)
    //     .where(`id`, `==`, tokenId)
    //     .get()
    //     .then(coll => {
    //       coll.docs.map(doc => {
    //         console.log("doc.id2", doc.id);
    //         dispatch({
    //           type: "GEM_REMOVED_FROM_AUCTION"
    //         });
    //         return db.doc(`stones/${doc.id}`).update({
    //           auctionIsLive: false
    //         });
    //       });
    //     })
    // );
};
