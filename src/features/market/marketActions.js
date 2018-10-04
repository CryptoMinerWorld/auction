import {
  NEW_AUCTIONS_RECEIVED,
  AUCTION_PRICE_UPDATES_BEGIN,
  MARKETPLACE_WAS_FILTERED,
  FETCH_NEW_AUCTIONS_FAILED,
  FETCH_NEW_AUCTIONS_BEGUN,
  FETCH_NEW_AUCTIONS_SUCCEEDED,
  MARKETPLACE_FILTER_BEGUN,
  MARKETPLACE_FILTER_FAILED,
  CHANGE_FILTER_GEM_VALUES,
  CHANGE_FILTER_VALUES
} from './marketConstants';

import { REDIRECTED_HOME } from '../auth/authConstants';
import { db } from '../../app/utils/firebase';
// import { getPrice } from "../auction/helpers";
import { updateDBwithNewPrice } from './helpers';

export const getAuctions = () => dispatch => {
  dispatch({ type: FETCH_NEW_AUCTIONS_BEGUN });

  try {
    db.collection('stones')
      .where('auctionIsLive', '==', true)
      .get()
      .then(collection => {
        const auctions = collection.docs.map(doc => doc.data());
        dispatch({ type: FETCH_NEW_AUCTIONS_SUCCEEDED });
        dispatch({ type: NEW_AUCTIONS_RECEIVED, payload: auctions });
      });
  } catch (err) {
    dispatch({ type: FETCH_NEW_AUCTIONS_FAILED, payload: err });
  }
};

export const redirectedHome = () => dispatch =>
  dispatch({ type: REDIRECTED_HOME });

export const updatePriceOnAllLiveAuctions = () => async (
  dispatch,
  getState
) => {
  dispatch({ type: AUCTION_PRICE_UPDATES_BEGIN });
  const dutchContract = getState().app.dutchContractInstance;
  const gemContractAddress = getState().app.gemsContractInstance._address 
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
  try {
    activeAuctions.forEach(auction => {
      dutchContract.methods
      .getCurrentPrice(gemContractAddress, auction.id)
        .call()
        .then(currentPrice =>
          updateDBwithNewPrice(auction.id).then(docid =>
            db.doc(`stones/${docid}`).update({
              currentPrice: Number(currentPrice)
            })
          )
        );
    });
  } catch (err) {
    console.log('error on updatePriceOnAllLiveAuctions', err);
  }
};

export const filterMarketplaceResults = () => (dispatch, getState) => {
  const state = getState().marketActions;

  dispatch({ type: MARKETPLACE_FILTER_BEGUN });
  const price = db
    .collection('stones')
    .where('auctionIsLive', '==', true)
    .where('currentPrice', '>=', state.currentPrice.min)
    .where('currentPrice', '<=', state.currentPrice.max)
    .get()
    .then(collection => {
      const activeAuctions = collection.docs.map(doc => doc.data());
      return activeAuctions;
    });

  const level = db
    .collection('stones')
    .where('auctionIsLive', '==', true)
    .where('level', '>=', state.level.min)
    .where('level', '<=', state.level.max)
    .get()
    .then(collection => {
      const activeAuctions = collection.docs.map(doc => doc.data());
      return activeAuctions;
    });

  const grade = db
    .collection('stones')
    .where('auctionIsLive', '==', true)
    .where('gradeType', '>=', state.gradeType.min)
    .where('gradeType', '<=', state.gradeType.max)

    .get()
    .then(collection => {
      const activeAuctions = collection.docs.map(doc => doc.data());
      return activeAuctions;
    });

  // const rate = db
  //   .collection("stones")
  //   .where("auctionIsLive", "==", true)
  //   .where("rate", ">=", state.rate.min)
  //   .where("rate", "<=", state.rate.max)
  //   .get()
  //   .then(collection => {
  //     const activeAuctions = collection.docs.map(doc => doc.data());
  //     return activeAuctions;
  //   });

  return Promise.all([grade, level, price])
    .then(payload => {
      // flatten all arrays in one array

      const flatArray = payload.flat();

      // filter out all the gem types you don't want
      const filteredFlatArray = flatArray.reduce((result, gem) => {
        if (
          (state.gems.amethyst && gem.color === 2) ||
          (state.gems.garnet && gem.color === 1) ||
          (state.gems.sapphire && gem.color === 9) ||
          (state.gems.opal && gem.color === 10)
        ) {
          result.push(gem);
        }
        return result;
      }, []);

      // create a tally of how many times each item appears
      const tally = filteredFlatArray.reduce((results, gem) => {
        // eslint-disable-next-line
        results[gem.id] = (results[gem.id] || 0) + 1;
        return results;
      }, {});

      // only list ids that appear 4 times in the array
      const filteredIds = Object.keys(tally).filter(key => tally[key] === 3);

      // return the objects in the initial flatArray that have the filetered Ids
      const finalPayload = [];
      filteredIds.forEach(id => {
        const selection = filteredFlatArray.find(obj => obj.id === Number(id));
        finalPayload.push(selection);
      });

      dispatch({
        type: MARKETPLACE_WAS_FILTERED,
        payload: finalPayload
      });

      return true;
    })
    .catch(err => dispatch({ type: MARKETPLACE_FILTER_FAILED, payload: err }));
};

export const toggleGem = gemType => async dispatch => {
  dispatch({ type: CHANGE_FILTER_GEM_VALUES, payload: gemType });
  dispatch(filterMarketplaceResults());
};

export const filterChange = (filterName, values) => dispatch => {
  const payload = [filterName, values];
  dispatch({ type: CHANGE_FILTER_VALUES, payload });
};

export const orderMarketBy = (key, descending) => (dispatch, getState) => {
  const newMarket = [...getState().market ].sort((a, b) =>  descending === 'desc' ?  a[key] - b[key]  : b[key] - a[key]  )
  dispatch({type: MARKETPLACE_WAS_FILTERED, payload:newMarket })
}
