import {
  AUCTION_DETAILS_RECEIVED,
  OWNERSHIP_TRANSFERRED
} from "./auctionConstants";
import { db } from "../../app/utils/firebase";
import store from "../../app/store";

export const getAuctionDetails = tokenId =>
  db
    .collection(`stones`)
    .where(`id`, `==`, Number(tokenId))
    .onSnapshot(coll => {
      const gemDetails = coll.docs.map(doc => doc.data());
      store.dispatch({
        type: AUCTION_DETAILS_RECEIVED,
        payload: gemDetails[0]
      });
    });

export const updateGemOwnership = (
  gemId,
  newOwner
) => async dispatch => {
  console.log("newOwner", newOwner);
  console.log("gemId", gemId);

  // get name and image
  const newGemOwner = await db
    .doc(`users/${newOwner}`)
    .get()
    .then(doc => doc.data());
  const { name, imageURL } = newGemOwner;
  console.log("name, imageURL", name, imageURL);

  // update gem with new owner, name and image
  db.collection(`stones`)
    .where(`id`, `==`, gemId)
    .get()
    .then(coll => {
      const gem = coll.docs.map(doc => doc.id)
      db.doc(`stones/${gem[0]}`)
        .update({
          userName: name,
          userImage: imageURL,
          owner:newOwner,
          auctionIsLive: false
        })
        .then(() => {
          dispatch({ type: OWNERSHIP_TRANSFERRED })
          window.location.href = `${
            process.env.REACT_APP_BASE_URL
          }/profile/${newOwner}`;
        })
        .catch(err => console.log("err", err));
    });
};
