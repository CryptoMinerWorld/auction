import {
    AUCTION_DETAILS_RECEIVED,
    DASHBOARD_WAS_FILTERED,
    FETCH_USER_COUNTRIES,
    FETCH_USER_GEMS_BEGUN,
    ONLY_WANT_TO_SEE_GEMS_IN_AUCTIONS,
    PAGINATE,
    RERENDER_SORT_BOX,
    SCROLL_GEMS,
    SORT_BOX_RERENDERED, USER_ARTIFACTS_RETRIEVED,
    USER_GEMS_RETRIEVED,
    WANT_TO_SEE_ALL_GEMS,
} from './dashboardConstants';
import {db} from '../../app/utils/firebase';
import {completedTx, ErrorTx, startTx} from "../transactions/txActions";
import {parseTransactionHashFromError} from "../transactions/helpers";
import {getUserBalance} from "../sale/saleActions";


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

        console.log('222222 FETCH!');

        //dispatch({type: FETCH_USER_GEMS_SUCCEEDED});
        console.warn('AUCTIONOWNERGEMS: ', auctionOwnerGems);
        console.warn('NOTAUCTIONGEMS:', notAuctionOwnerGems);


        dispatch({type: USER_GEMS_RETRIEVED, payload: auctionOwnerGems.concat(notAuctionOwnerGems)});
    }
    catch (e) {
        console.error("Get user gems failed: ", e);
    }
};

export const getUserArtifacts = userId => async (dispatch, getState) => {
    const artifactsBalance = await getState().app.artifactContractInstance.methods.balanceOf(userId).call();
    dispatch({type: USER_ARTIFACTS_RETRIEVED, payload: {userArtifacts: artifactsBalance}});
}

export const getUserCountries = userId => async (dispatch, getState) => {
    const countryService = getState().app.countryServiceInstance;
    const userCountries = await countryService.getUserCountries(userId);
    console.log(' ::::::::::::: GET USER COUNTRIES ACTION:', userCountries);
    dispatch({type: FETCH_USER_COUNTRIES, payload: {userCountries}})
}

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
    return silverGoldService.useCoupon(couponCode)
      .on('transactionHash', (hash) => {
          hidePopup();
          dispatch(
            startTx({
                hash,
                description: 'Submitting coupon code',
                txMethod: 'COUPON_USE',
                code: couponCode,
            }),
          );
      })
      .on('receipt', async (receipt) => {
          console.log('111RECEIPT: ', receipt);
          getUserBalance(currentUser)(dispatch, getState);
          dispatch(completedTx({
              receipt,
              txMethod: 'COUPON_USE',
              description: 'Coupon accepted',
              hash: receipt.transactionHash,
              code: couponCode
          }));
      })
      .on('error', (err) => {
          hidePopup();
          //setLoading(false);
          dispatch(ErrorTx({
              txMethod: 'COUPON_USE',
              description: 'Coupon submitting failed',
              error: err,
              hash: parseTransactionHashFromError(err.message)
          }));
          // dispatch({
          //   type: MODAL_GONE,
          // });
          // dispatch({
          //   type: FETCH_DATA_FAILED,
          //   payload: JSON.stringify(err),
          // });
      });
}

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

export const rerenderSortBox = () => dispatch => dispatch({type: RERENDER_SORT_BOX});
export const sortBoxReredendered = () => dispatch => dispatch({type: SORT_BOX_RERENDERED});

export function paginate(pageNumber, pagePerView) {
    return dispatch => dispatch({type: PAGINATE, payload: [pageNumber, pagePerView]});
}

export function scrollGems(pageNumber, gemsNumber) {
    return dispatch => dispatch({type: SCROLL_GEMS, payload: [pageNumber, gemsNumber]});
}

export const addGemsToDashboard = gems => {

    return {
        type: 'DASHBOARD_GEMS_READY',
        payload: gems,
    }
}
