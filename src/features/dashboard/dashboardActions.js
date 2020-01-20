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
import { SET_GEM_MARKET_FILTERS } from '../market/marketConstants';

export const withdrawCountryEth = () => async (dispatch, getState) => {
    const plotService = getState().app.plotService;
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
    dispatch({type: FETCH_USER_GEMS_BEGUN});

    const gemService = getState().app.gemService;
    const auctionService = getState().app.auctionService;

    const userIdToLowerCase = ownerId
      .split('')
      .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
      .join('');

    try {
        const [notAuctionOwnerGems, auctionOwnerGems] = await Promise.all([
            gemService.getOwnerGems(userIdToLowerCase),
            auctionService.getAuctionOwnerGems(userIdToLowerCase)
        ]);
        dispatch({type: USER_GEMS_RETRIEVED, payload: auctionOwnerGems.concat(notAuctionOwnerGems)});
    }
    catch (e) {
        console.error("Get user gems failed: ", e);
    }
};

export const getUserArtifacts = userId => async (dispatch, getState) => {
    const artifactsBalance = await getState().app.artifactContract.methods.balanceOf(userId).call();
    dispatch({type: USER_ARTIFACTS_RETRIEVED, payload: {userArtifacts: artifactsBalance}});
};

export const getUserCountries = userId => async (dispatch, getState) => {
    const countryService = getState().app.countryService;
    const plotService = getState().app.plotService;
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
        console.error(err);
    }
};


export const useCoupon = (couponCode, hidePopup) => async (dispatch, getState) => {
    //console.log('COUPON')
    const silverGoldService = getState().app.silverGoldService;
    //const plotService = getState().app.plotService;
    const currentUser = getState().auth.currentUserId;
    //console.log('Service:::', silverGoldService);
    if (!silverGoldService) return;
    // TODO: detect which type of coupon is used
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
      })
      .on('error', (err) => {
          if (txHash) {
              getUpdatedTransactionHistory()(dispatch, getState);
          }
      });
    // return silverGoldService.useCoupon(couponCode)
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

export const approveGemBurn = ({onTransactionSent, onApproveCallback, hidePopup}) => async (dispatch, getState) => {
    const gemService = getState().app.gemService;
    const currentUserId = getState().auth.currentUserId;
    const gemBurnerAddress = process.env.REACT_APP_GEM_BURNER;

    try {
        const isApproved = await gemService.contract.methods.isApprovedForAll(currentUserId, gemBurnerAddress).call();
        
        if (!isApproved) {
            gemService.contract.methods.setApprovalForAll(gemBurnerAddress, true).send()
            .on('transactionHash', (hash) => {
                onTransactionSent()
            })
            .on('receipt', async receipt => {
                onApproveCallback()
            })
            .on('error', err => {
                console.error("Error while approving:", err)
                hidePopup()
                return
            })
        }
    } catch(err) {
        console.error("Error while approving:", err)
        hidePopup()
    }
}

export const proceedCombine = (userGems, combineAsset, hidePopup, onNotApprovedCallback) => async (dispatch, getState) => {
    const gemService = getState().app.gemService;
    const currentUserId = getState().auth.currentUserId;
    const gemBurnerAddress = process.env.REACT_APP_GEM_BURNER;
    const isApproved = await gemService.contract.methods.isApprovedForAll(currentUserId, gemBurnerAddress).call();
    
    if (!isApproved) {
        onNotApprovedCallback && onNotApprovedCallback()
        return
    }

    try {
        let txHash;
        gemService.burnGems(userGems.map(gem => gem.id).sort(), combineAsset)
        .on('transactionHash', (hash) => {
            hidePopup();
            txHash = hash;
            addPendingTransaction({
                hash: hash,
                userId: currentUserId,
                type: COUPON_USE,
                description: `Combining gems`,
                body: {
                    combineAsset: combineAsset
                }
            })(dispatch, getState);
        })
        .on('receipt', async (receipt) => {})
        .on('error', (err) => {
            if (txHash) {
                getUpdatedTransactionHistory()(dispatch, getState);
            }
        });
    } catch(err) {
        hidePopup()
    }
    
    return;
}

export const applyGemFiltersInMarket = (unselectedFilters) => (dispatch, getState) => {
    dispatch({
        type: SET_GEM_MARKET_FILTERS,
        payload: {
            unselectedFilters: unselectedFilters
        }
    })
}