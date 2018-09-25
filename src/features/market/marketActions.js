import {
  NEW_AUCTIONS_RECEIVED,
  AUCTION_PRICE_UPDATES_BEGIN
} from "./marketConstants";
import { db } from "../../app/utils/firebase";
import { getPrice } from "../auction/helpers";
import { updateDBwithNewPrice } from "./helpers";

export const getAuctions = () => dispatch =>
  db
    .collection("stones")
    .where("auctionIsLive", "==", true)
    .onSnapshot(collection => {
      const auctions = collection.docs.map(doc => doc.data());
      dispatch({ type: NEW_AUCTIONS_RECEIVED, payload: auctions });
    });

export const getSoonestAuctions = () => dispatch =>
  db
    .collection("stones")
    .where("auctionIsLive", "==", true)
    .orderBy("deadline")
    .onSnapshot(collection => {
      const auctions = collection.docs.map(doc => doc.data());
      dispatch({ type: NEW_AUCTIONS_RECEIVED, payload: auctions });
    });

export const getLowestAuctions = () => dispatch =>
  db
    .collection("stones")
    .where("auctionIsLive", "==", true)
    .orderBy("currentPrice", "desc")
    .onSnapshot(collection => {
      const auctions = collection.docs.map(doc => doc.data());
      dispatch({ type: NEW_AUCTIONS_RECEIVED, payload: auctions });
    });

export const getHighestAuctions = () => dispatch =>
  db
    .collection("stones")
    .where("auctionIsLive", "==", true)
    .orderBy("currentPrice")
    .onSnapshot(collection => {
      const auctions = collection.docs.map(doc => doc.data());
      dispatch({ type: NEW_AUCTIONS_RECEIVED, payload: auctions });
    });

export const updatePriceOnAllLiveAuctions = () => async (
  dispatch,
  getState
) => {
  dispatch({ type: AUCTION_PRICE_UPDATES_BEGIN });
  const dutchContract = getState().app.dutchContractInstance;

  // get list of all active auctions
  const activeAuctionIds = await db
    .collection("stones")
    .where("auctionIsLive", "==", true)
    .get()
    .then(collection => {
      const activeAuctions = collection.docs.map(doc => doc.data().id);
      return activeAuctions;
    });

  // get price for each auction, then update db with new price
  try {
    activeAuctionIds.forEach(auctionId => {
      getPrice(auctionId, dutchContract).then(currentPrice =>
        updateDBwithNewPrice(auctionId).then(docid =>
          db.doc(`stones/${docid}`).update({
            currentPrice
          })
        )
      );
    });
  } catch (err) {
    console.console.log("err", err);
  }
};
