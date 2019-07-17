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
    CHANGE_FILTER_VALUES,
    PAGINATE_MARKET,
    FETCH_AUCTIONS_PAGE_IMAGES,
    SET_DEFAULT_GEM_MARKET_FILTERS,
    DESELECT_ALL_GEM_MARKET_FILTERS,
    APPLY_GEM_MARKET_FILTER_OPTION, APPLY_GEM_MARKET_SORTING,
} from './marketConstants';
import { AUCTION_DETAILS_RECEIVED } from '../items/itemConstants';
import { db } from '../../app/utils/firebase';
import { updateDBwithNewPrice } from './helpers';
import { setError } from '../../app/appActions';
import {getGemImage} from "../market/helpers";
import {
    APPLY_GEM_WORKSHOP_FILTER_OPTION, APPLY_GEM_WORKSHOP_SORTING,
    DESELECT_ALL_GEM_WORKSHOP_FILTERS,
    FETCH_GEMS_PAGE_IMAGES,
    FETCH_USER_GEMS_BEGUN,
    FETCH_USER_GEMS_SUCCEEDED, SET_DEFAULT_GEM_WORKSHOP_FILTERS,
    USER_GEMS_RETRIEVED
} from "../dashboard/dashboardConstants";
import BigNumber from "bignumber.js";

export const getAuctions = () => async (dispatch, getState) => {

    dispatch({ type: FETCH_NEW_AUCTIONS_BEGUN });
    console.log('::::::::::::::::::getAuctions:::::::::::::::::::::');

    //const gemService = getState().app.gemService;
    const auctionService = getState().app.auctionService;
    if (!auctionService)
        return;

    try {
        const zeroAddress = "0x0000000000000000000000000000000000000000";
        const auctionGems = await auctionService.getAuctionOwnerGems(zeroAddress);
        console.warn('*********** AUCTION_GEMS ************: ', auctionGems);
        dispatch({ type: NEW_AUCTIONS_RECEIVED, payload: auctionGems });
    }
    catch (e) {
        console.error("Get user gems failed: ", e);
        dispatch({type: FETCH_NEW_AUCTIONS_FAILED, payload: e});
    }
};


export const getImagesForGems = gems => async (dispatch, getState) => {
    const gemService = getState().app.gemService;
    console.log(':::::::::::::GEM SERVICE::', gemService);
    if (!gemService) return;
    const gemsWithImages = await gemService.getImagesForGems(gems);
    dispatch({type: FETCH_AUCTIONS_PAGE_IMAGES, payload: gemsWithImages});
};


export const filterMarketplaceResults = () => (dispatch, getState) => {
    const state = getState().marketActions;
    console.log('::::::::::::::::::filterMarketplaceResults:::::::::::::::::::::', state);
    dispatch({ type: MARKETPLACE_FILTER_BEGUN });

    const newMarket = [...getState().market.auctions].filter(
      (auction) => ((auction.currentPrice <= state.currentPrice.max) &&
        (auction.currentPrice >= state.currentPrice.min)
    )).filter(
        (auction) => ((auction.level <= state.level.max) && (auction.level >= state.level.min))
      ).filter(
        (auction) => ((auction.gradeType <= state.gradeType.max) && (auction.gradeType >= state.gradeType.min))
      ).filter(
      (gem) => (
        (state.gems.amethyst && gem.color === 2)
        || (state.gems.garnet && gem.color === 1)
        || (state.gems.sapphire && gem.color === 9)
        || (state.gems.opal && gem.color === 10)
        || (state.gems.ruby && gem.color === 7)
      )
    );
    console.log('NEW MARKET::', newMarket);
    dispatch({ type: MARKETPLACE_WAS_FILTERED, payload: newMarket });
      //.catch(err => dispatch({ type: MARKETPLACE_FILTER_FAILED, payload: err }));
};


export const filterMarketplaceResultsOld = () => (dispatch, getState) => {
  const state = getState().marketActions;
  console.log('::::::::::::::::::filterMarketplaceResults:::::::::::::::::::::');
  dispatch({ type: MARKETPLACE_FILTER_BEGUN });
  // const price = db
  //   .collection('stones')
  //   .where('auctionIsLive', '==', true)
  //   .where('currentPrice', '>=', state.currentPrice.min)
  //   .where('currentPrice', '<=', state.currentPrice.max)
  //   .get()
  //   .then((collection) => {
  //     const activeAuctions = collection.docs.map(doc => doc.data());
  //     return activeAuctions;
  //   });
  //
  // const level = db
  //   .collection('stones')
  //   .where('auctionIsLive', '==', true)
  //   .where('level', '>=', state.level.min)
  //   .where('level', '<=', state.level.max)
  //   .get()
  //   .then((collection) => {
  //     const activeAuctions = collection.docs.map(doc => doc.data());
  //     return activeAuctions;
  //   });
  //
  // const grade = db
  //   .collection('stones')
  //   .where('auctionIsLive', '==', true)
  //   .where('gradeType', '>=', state.gradeType.min)
  //   .where('gradeType', '<=', state.gradeType.max)
  //   .get()
  //   .then((collection) => {
  //     const activeAuctions = collection.docs.map(doc => doc.data());
  //     return activeAuctions;
  //   });

  return Promise.all([grade, level, price])
    .then(async (payload) => {
      // flatten all arrays in one array

      const flatArray = payload.flat();

      // filter out all the gem types you don't want
      const filteredFlatArray = flatArray.reduce((result, gem) => {
        if (
          (state.gems.amethyst && gem.color === 2)
          || (state.gems.garnet && gem.color === 1)
          || (state.gems.sapphire && gem.color === 9)
          || (state.gems.opal && gem.color === 10)
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
      filteredIds.forEach((id) => {
        const selection = filteredFlatArray.find(obj => obj.id === Number(id));
        finalPayload.push(selection);
      });

      const imagesUploaded = finalPayload.map(async (auction) => {
        auction.gemImage = await getGemImage(auction.color, auction.gradeType, auction.level, auction.id);
        return true;
      });

      await Promise.all(imagesUploaded);
      dispatch({
        type: MARKETPLACE_WAS_FILTERED,
        payload: finalPayload,
      });

      return true;
    })
    .catch(err => dispatch({ type: MARKETPLACE_FILTER_FAILED, payload: err }));
};

export const toggleGem = gemType => async (dispatch) => {
  dispatch({ type: CHANGE_FILTER_GEM_VALUES, payload: gemType });
  dispatch(filterMarketplaceResults());
};

export const filterChange = (filterName, values) => (dispatch) => {
  const payload = [filterName, values];
  dispatch({ type: CHANGE_FILTER_VALUES, payload });
  dispatch({ type: PAGINATE_MARKET, payload: [1, 15] });
};

export const orderMarketBy = (key, descending) => (dispatch, getState) => {

    console.log('FILTERED:', getState().market.auctionsFiltered);

  const newMarket = [...getState().market.auctionsFiltered].sort(
    (a, b) => (descending === 'desc' ? a[key] - b[key] : b[key] - a[key]),
  );
  dispatch({ type: MARKETPLACE_WAS_FILTERED, payload: newMarket });
  //dispatch({ type: PAGINATE_MARKET, payload: [1, 15] });
};

export function paginate(pageNumber, pagePerView) {
  return dispatch => dispatch({ type: PAGINATE_MARKET, payload: [pageNumber, pagePerView] });
}

export function preLoadAuctionPage(auction) {
    console.log('>>>>>>>>>>> PRELOAD <<<<<<<<<<<', auction);
  return dispatch => dispatch({ type: AUCTION_DETAILS_RECEIVED, payload: {gem:auction} });
}



export const setDefaultFilters = () => {
    return {
        type: SET_DEFAULT_GEM_MARKET_FILTERS,
    }
};

export const deselectAllFilters = () => {
    return {
        type: DESELECT_ALL_GEM_MARKET_FILTERS,
    }
};

export const applyFilterOption = (filterOption, optionType) => {
    return {
        type: APPLY_GEM_MARKET_FILTER_OPTION,
        payload: {filterOption, optionType}
    }
};

export const applySort = (newSortOption, newSortDirection) => (dispatch, getState) => {
    const {sortOption, sortDirection} = getState().market.selectedGemMarketSorting;
    if (newSortOption === sortOption && newSortDirection === sortDirection) return;

    dispatch({
        type: APPLY_GEM_MARKET_SORTING,
        payload: {
            sortOption: newSortOption,
            sortDirection: newSortDirection,
        }
    })
};
