import {
    APPLY_GEM_WORKSHOP_FILTER_OPTION,
    APPLY_GEM_WORKSHOP_SORTING,
    AUCTION_DETAILS_RECEIVED, COUNTRY_WITHDRAW,
    COUPON_USE,
    DASHBOARD_WAS_FILTERED,
    DESELECT_ALL_GEM_WORKSHOP_FILTERS,
    FETCH_USER_COUNTRIES,
    FETCH_USER_GEMS_BEGUN,
    ONLY_WANT_TO_SEE_GEMS_IN_AUCTIONS,
    SCROLL_GEMS,
    SET_DEFAULT_GEM_WORKSHOP_FILTERS,
    USER_ARTIFACTS_RETRIEVED,
    USER_GEMS_RETRIEVED,
    WANT_TO_SEE_ALL_GEMS,
} from './dashboardConstants';
import {db} from '../../app/utils/firebase';
import {addPendingTransaction, getUpdatedTransactionHistory} from "../transactions/txActions";
import {getUserBalance} from "../sale/saleActions";
import {weiToEth} from "../sale/helpers";

export const withdrawCountryEth = () => async (dispatch, getState) => {
    const plotService = getState().app.plotServiceInstance;
    const currentUserId = getState().auth.currentUserId;
    let txHash;
    plotService.withdrawCountriesEth(currentUserId)
      .on('transactionHash', (hash) => {
          txHash = hash;
          addPendingTransaction({
              hash: hash,
              userId: currentUserId,
              type: COUNTRY_WITHDRAW,
              description: `Withdrawing countries income`
          })(dispatch, getState);
      })
      .on('receipt', async (receipt) => {
      })
      .on('error', (err) => {
          if (txHash) {
              getUpdatedTransactionHistory()(dispatch, getState);
          }
      });
};

export const getUserGems = ownerId => async (dispatch, getState) => {
    console.log('11111 FETCH!');
    dispatch({type: FETCH_USER_GEMS_BEGUN});

    const gemService = getState().app.gemServiceInstance;
    const auctionService = getState().app.auctionServiceInstance;

    const userIdToLowerCase = ownerId
      .split('')
      .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
      .join('');

    try {
        console.log('11111 FETCH!');
        const [notAuctionOwnerGems, auctionOwnerGems] = await Promise.all([
            gemService.getOwnerGems(userIdToLowerCase),
            auctionService.getAuctionOwnerGems(userIdToLowerCase)
        ]);
        console.warn('AUCTIONOWNERGEMS: ', auctionOwnerGems);
        console.warn('NOTAUCTIONGEMS:', notAuctionOwnerGems);
        dispatch({type: USER_GEMS_RETRIEVED, payload: auctionOwnerGems.concat(notAuctionOwnerGems)});
    }
    catch (e) {
        console.error("Get user gems failed (dashboardActions): ", e);
    }
};

export const getUserArtifacts = userId => async (dispatch, getState) => {
    const artifactsBalance = await getState().app.artifactContractInstance.methods.balanceOf(userId).call();
    dispatch({type: USER_ARTIFACTS_RETRIEVED, payload: {userArtifacts: artifactsBalance}});
};

export const getUserCountries = userId => async (dispatch, getState) => {
    const countryService = getState().app.countryServiceInstance;
    const plotService = getState().app.plotServiceInstance;
    const currentUserId = getState().auth.currentUserId;

    const [userCountries, totalNotWithdrawn] = await Promise.all([
        await countryService.getUserCountries(userId),
        (userId.toLowerCase() === currentUserId.toLowerCase()) ? weiToEth(await plotService.getTotalNotWithdrawn(userId)) : null
    ]);
    dispatch({type: FETCH_USER_COUNTRIES, payload: {userCountries, totalNotWithdrawn}})
};

export const getUserDetails = async userId => {

    const userIdToLowerCase = userId


      .split('')
      .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
      .join('');
    try {
        const col = db.collection('users')
          .doc(userIdToLowerCase)
          //.where('walletId', '==', userId)
          .get();
        //const userDetails = (await col).docs.map(doc => doc.data());
        const userDetails = (await col).data();
        return userDetails || {name: "", imageURL: ""};
    } catch (err) {
        console.log(33333333333, err);
    }
};


export const useCoupon = (couponCode, hidePopup) => async (dispatch, getState) => {
    //console.log('COUPON')
    const silverGoldService = getState().app.silverGoldServiceInstance;
    const currentUser = getState().auth.currentUserId;
    //console.log('Service:::', silverGoldService);
    if (!silverGoldService) return;
    let txHash;
    return silverGoldService.useCoupon(couponCode)
      .on('transactionHash', (hash) => {
          hidePopup();
          txHash = hash;
          addPendingTransaction({
              hash: hash,
              userId: currentUser,
              type: COUPON_USE,
              description: `Submitting coupon code`,
              body: {
                  code: couponCode
              }
          })(dispatch, getState);
      })
      .on('receipt', async (receipt) => {
          console.log('111RECEIPT: ', receipt);
          getUserBalance(currentUser)(dispatch, getState);
      })
      .on('error', (err) => {
          if (txHash) {
              getUpdatedTransactionHistory()(dispatch, getState);
          }
      });
};

export const getGemDetails = tokenId => dispatch => db
  .collection('stones')
  .where('id', '==', Number(tokenId))
  .onSnapshot((coll) => {

      const gemDetails = coll.docs.map(doc => doc.data());
      dispatch({
          type: AUCTION_DETAILS_RECEIVED,
          payload: gemDetails[0],
      });
  });

export const onlyGemsInAuction = () => ({
    type: ONLY_WANT_TO_SEE_GEMS_IN_AUCTIONS,
});

export const allMyGems = () => ({
    type: WANT_TO_SEE_ALL_GEMS,
});

export const filterUserGemsOnPageLoad = () => (dispatch, getState) => {
    const allUserGemItems = getState().dashboard.userGems;

    const newMarket = [...allUserGemItems].sort((a, b) => a.rate - b.rate);
    dispatch({type: DASHBOARD_WAS_FILTERED, payload: newMarket});
};

export const orderDashboardBy = (key, direction) => ({
    type: 'REORDER_DASHBOARD',
    payload: [key, direction],
});

export const getGemsForDashboardFilter = selection => ({
    type: 'FILTER_DASHBOARD',
    payload: selection,
});

export function scrollGems(pageNumber, gemsNumber) {
    return dispatch => dispatch({type: SCROLL_GEMS, payload: [pageNumber, gemsNumber]});
}

export const addGemsToDashboard = gems => {
    return {
        type: 'DASHBOARD_GEMS_READY',
        payload: gems,
    }
};


export const setDefaultFilters = () => {
    return {
        type: SET_DEFAULT_GEM_WORKSHOP_FILTERS,
    }
};

export const deselectAllFilters = () => {
    return {
        type: DESELECT_ALL_GEM_WORKSHOP_FILTERS,
    }
};

export const applyFilterOption = (filterOption, optionType) => {
    return {
        type: APPLY_GEM_WORKSHOP_FILTER_OPTION,
        payload: {filterOption, optionType}
    }
};

export const applySort = (newSortOption, newSortDirection) => (dispatch, getState) => {
    const {sortOption, sortDirection} = getState().dashboard.selectedGemWorkshopSorting;
    if (newSortOption === sortOption && newSortDirection === sortDirection) return;

    dispatch({
        type: APPLY_GEM_WORKSHOP_SORTING,
        payload: {
            sortOption: newSortOption,
            sortDirection: newSortDirection,
        }
    })
};
