import {
  NEW_AUCTIONS_RECEIVED,
  AUCTION_PRICE_UPDATES_BEGIN,
  MARKETPLACE_WAS_FILTERED,
  FETCH_NEW_AUCTIONS_FAILED,
  FETCH_NEW_AUCTIONS_BEGUN,
  FETCH_NEW_AUCTIONS_SUCCEEDED,
  MARKETPLACE_FILTER_BEGUN,
  MARKETPLACE_FILTER_FAILED
} from "./marketConstants";

import {REDIRECTED_HOME} from '../auth/authConstants'
import { db } from "../../app/utils/firebase";
// import { getPrice } from "../auction/helpers";
import { updateDBwithNewPrice } from "./helpers";

export const getAuctions = () => dispatch => {
  dispatch({ type: FETCH_NEW_AUCTIONS_BEGUN });
  try {
    db.collection("stones")
      .where("auctionIsLive", "==", true)
      .onSnapshot(collection => {
        const auctions = collection.docs.map(doc => doc.data());
        // console.log('auctions', auctions)
          dispatch({ type: FETCH_NEW_AUCTIONS_SUCCEEDED })
          dispatch({ type: NEW_AUCTIONS_RECEIVED, payload: auctions })

       
      });
  } catch (err) {
    console.log('retrieving live auctions error',  err)
    dispatch({ type: FETCH_NEW_AUCTIONS_FAILED, payload: err });
  }
};

export const redirectedHome = () => dispatch => dispatch({type: REDIRECTED_HOME})

export const getSoonestAuctions = () => dispatch =>
  db
    .collection("stones")
    .where("auctionIsLive", "==", true)
    .orderBy("deadline")
    .onSnapshot(collection => {
      const auctions = collection.docs.map(doc => doc.data());
      dispatch({ type: NEW_AUCTIONS_RECEIVED, payload: auctions });
    });

export const getHighestAuctions = () => dispatch =>
  db
    .collection("stones")
    .where("auctionIsLive", "==", true)
    .orderBy("currentPrice", "desc")
    .onSnapshot(collection => {
      const auctions = collection.docs.map(doc => doc.data());
      dispatch({ type: NEW_AUCTIONS_RECEIVED, payload: auctions });
    });

export const getLowestAuctions = () => dispatch =>
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

  // // get list of all active auctions
  // const activeAuctionIds = await db
  //   .collection("stones")
  //   .where("auctionIsLive", "==", true)
  //   .get()
  //   .then(collection => {
  //     const activeAuctions = collection.docs.map(doc => doc.data().id);
  //     return activeAuctions;
  //   });

  // get list of Ids for all auctions in view
  const activeAuctions = getState().market;

  // get price for each auction, then update db with new price

  activeAuctions.forEach(auction => {
      dutchContract
        .getCurrentPrice(auction.id, { from: getState().auth.currentUserId }, (error, currentPrice) => { if(!error){
updateDBwithNewPrice(auction.id).then(docid =>
            db.doc(`stones/${docid}`).update({
              currentPrice: Number(currentPrice)
            })
          )
        } 
        console.log("get active auction price error", error);
      })
        
    });
  
};

export const filterMarketplaceResults = state => dispatch => {
  dispatch({ type: MARKETPLACE_FILTER_BEGUN });
  const price = db
    .collection("stones")
    .where("auctionIsLive", "==", true)
    .where("currentPrice", ">=", state.currentPrice.min)
    .where("currentPrice", "<=", state.currentPrice.max)
    .get()
    .then(collection => {
      const activeAuctions = collection.docs.map(doc => doc.data());
      return activeAuctions;
    });

  const level = db
    .collection("stones")
    .where("auctionIsLive", "==", true)
    .where("level", ">=", state.level.min)
    .where("level", "<=", state.level.max)
    .get()
    .then(collection => {
      const activeAuctions = collection.docs.map(doc => doc.data());
      return activeAuctions;
    });

  const grade = db
    .collection("stones")
    .where("auctionIsLive", "==", true)
    .where("gradeType", ">=", state.gradeType.min)
    .where("gradeType", "<=", state.gradeType.max)

    .get()
    .then(collection => {
      const activeAuctions = collection.docs.map(doc => doc.data());
      return activeAuctions;
    });

  const rate = db
    .collection("stones")
    .where("auctionIsLive", "==", true)
    .where("rate", ">=", state.rate.min)
    .where("rate", "<=", state.rate.max)
    .get()
    .then(collection => {
      const activeAuctions = collection.docs.map(doc => doc.data());
      return activeAuctions;
    });

  Promise.all([rate, grade, level, price])
    .then(payload => {
      // flatten all arrays in one array
      const flatArray = payload.flat();

      // create a tally of how many times each item appears
      const tally = flatArray.reduce((results, gem) => {
        // eslint-disable-next-line
        results[gem.id] = (results[gem.id] || 0) + 1;
        return results;
      }, {});

      // only list ids that appear 4 times in the array
      const filteredIds = Object.keys(tally).filter(key => tally[key] === 4);

      // return the objects in the initial flatArray that have the filetered Ids
      const finalPayload = [];
      filteredIds.forEach(id => {
        const selection = flatArray.find(obj => obj.id === Number(id));
        finalPayload.push(selection);
      });

      dispatch({
        type: MARKETPLACE_WAS_FILTERED,
        payload: finalPayload
      });
    })
    .catch(err => dispatch({ type: MARKETPLACE_FILTER_FAILED, payload: err }));
};
