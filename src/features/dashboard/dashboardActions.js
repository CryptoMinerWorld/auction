import {
    AUCTION_DETAILS_RECEIVED,
    DASHBOARD_WAS_FILTERED,
    FETCH_GEMS_PAGE_IMAGES,
    FETCH_USER_DETAILS_BEGUN,
    FETCH_USER_DETAILS_FAILED,
    FETCH_USER_DETAILS_SUCCEEDED,
    FETCH_USER_GEMS_BEGUN,
    ONLY_WANT_TO_SEE_GEMS_IN_AUCTIONS,
    PAGINATE,
    RERENDER_SORT_BOX,
    SORT_BOX_RERENDERED,
    USER_DETAILS_RETRIEVED,
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
              gemService.getOwnerGems(ownerId),
              auctionService.getAuctionOwnerGems(ownerId)
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


export const getUserDetails = async userId => {

    const userIdToLowerCase = userId
      .split('')
      .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
      .join('');
    try {
        const col = db.collection('users')
          .where('walletId', '==', userId)
          .get();
        const userDetails = (await col).docs.map(doc => doc.data());
        return userDetails[0];
    } catch (err) {
        console.log(err);
    }
};

export const getImagesForGems = gems => async (dispatch, getState) => {
    const gemService = getState().app.gemServiceInstance;
    console.log(':::::::::::::GEM SERVICE::', gemService);
    if (!gemService) return;
    const gemsWithImages = await gemService.getImagesForGems(gems);
    dispatch({type: FETCH_GEMS_PAGE_IMAGES, payload: gemsWithImages});
}

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

// // this is called in authActions when you create a new User
// export const getDetailsForAllGemsAUserCurrentlyOwns = (userId) => {
//     store.dispatch({type: FETCH_USER_GEMS_BEGUN});
//     const gemContract = store.getState().app.gemsContractInstance;
//     const userName = store.getState().auth.user.name;
//     const userImage = store.getState().auth.user.imageURL;
//
//     const listOfGemIds = [];
//
//     getAllUserGems(userId, gemContract).then(listOfGemIdsTheUserOwns => Promise.all(
//       listOfGemIdsTheUserOwns.map((gemId) => {
//           listOfGemIds.push(gemId);
//           return getGemQualities(gemContract, gemId).then(
//             ([color, level, gradeType, gradeValue]) => ({
//                 color,
//                 level,
//                 gradeType,
//                 gradeValue,
//             }),
//           );
//       }),
//     ).then((responses) => {
//         const gemImages = Promise.all(
//           responses.map(gem => getGemImage(gem.color, gem.gradeType, gem.level)),
//         );
//
//         const gemStories = Promise.all(responses.map(gem => getGemStory(gem.color, gem.level)));
//
//         Promise.all([gemImages, gemStories])
//           .then(async ([images, stories]) => {
//               const userIdToLowerCase = userId
//                 .split('')
//                 .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
//                 .join('');
//
//               const completeGemDetails = listOfGemIds.map((gemId, index) => ({
//                   id: Number(gemId),
//                   ...responses[index],
//                   rate: Number(calcMiningRate(responses[index].gradeType, responses[index].gradeValue)),
//                   auctionIsLive: false,
//                   owner: userIdToLowerCase,
//                   gemImage: images[index],
//                   story: stories[index],
//                   userName,
//                   userImage,
//               }));
//
//               if (completeGemDetails.length === 0) {
//                   store.dispatch({type: FETCH_USER_GEMS_SUCCEEDED});
//                   store.dispatch({
//                       type: USER_HAS_NO_GEMS_IN_WORKSHOP,
//                   });
//               } else {
//                   await completeGemDetails.forEach(gem => db
//                     .collection('stones')
//                     .doc(`${gem.id}`)
//                     .set(gem));
//
//                   store.dispatch({
//                       type: ALL_USER_GEMS_UPLOADED,
//                       payload: completeGemDetails,
//                   });
//                   /* eslint-disable no-console */
//
//                   /* eslint-enable no-console */
//                   store.dispatch({type: FETCH_USER_GEMS_SUCCEEDED});
//               }
//           })
//           .catch(error => setError(error));
//     }));
// };

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

export const addGemsToDashboard = gems => {

    return {
        type: 'DASHBOARD_GEMS_READY',
        payload: gems,
    }
}
