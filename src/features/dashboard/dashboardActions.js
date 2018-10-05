import {
  USER_GEMS_RETRIEVED,
  ALL_USER_GEMS_RETRIEVED,
  ALL_USER_GEMS_UPLOADED,
  USER_HAS_NO_GEMS_IN_WORKSHOP,
  AUCTION_DETAILS_RECEIVED,
  ONLY_WANT_TO_SEE_GEMS_IN_AUCTIONS,
  WANT_TO_SEE_ALL_GEMS,
  FETCH_USER_GEMS_BEGUN,
  FETCH_USER_GEMS_SUCCEEDED,
  FETCH_USER_GEMS_FAILED,
  FETCH_USER_DETAILS_BEGUN,
  FETCH_USER_DETAILS_SUCCEEDED,
  USER_DETAILS_RETRIEVED,
  FETCH_USER_DETAILS_FAILED,
  DASHBOARD_WAS_FILTERED,
  RERENDER_SORT_BOX,
  SORT_BOX_RERENDERED,
  PAGINATE
} from './dashboardConstants';
import { db } from '../../app/utils/firebase';
import store from '../../app/store';
import { getGemQualities, calcMiningRate } from '../items/helpers';
import { getGemImage, getGemStory } from './helpers';

// this gets all the gems from the database
export const getUserGems = userId => dispatch => {
  dispatch({ type: FETCH_USER_GEMS_BEGUN });

  try {
    db.collection('stones')
      .where('owner', '==', userId)
      .onSnapshot(collection => {
        const gems = collection.docs.map(doc => doc.data());
        dispatch({ type: FETCH_USER_GEMS_SUCCEEDED });
        dispatch({ type: USER_GEMS_RETRIEVED, payload: gems });
      });
  } catch (err) {
    dispatch({ type: FETCH_USER_GEMS_FAILED, payload: err });
  }
};

export const getUserGemsOnce = userId => dispatch => {
  dispatch({ type: FETCH_USER_GEMS_BEGUN });

  try {
    db.collection('stones')
      .where('owner', '==', userId)
      .orderBy('rate', 'desc')
      .get()
      .then(collection => {
        const gems = collection.docs.map(doc => doc.data());
        dispatch({ type: FETCH_USER_GEMS_SUCCEEDED });
        dispatch({ type: DASHBOARD_WAS_FILTERED, payload: gems });
      });
  } catch (err) {
    dispatch({ type: FETCH_USER_GEMS_FAILED, payload: err });
  }
};

export const getUserDetails = userId => dispatch => {
  dispatch({ type: FETCH_USER_DETAILS_BEGUN });
  try {
    db.collection('users')
      .where('walletId', '==', userId)
      .onSnapshot(collection => {
        const userDetails = collection.docs.map(doc => doc.data());
        dispatch({ type: FETCH_USER_DETAILS_SUCCEEDED });
        dispatch({ type: USER_DETAILS_RETRIEVED, payload: userDetails[0] });
      });
  } catch (err) {
    dispatch({ type: FETCH_USER_DETAILS_FAILED, payload: err });
  }
};

// this checks the smart contract to see what gems a user owns
export const getAllUserGems = (userId, gemContract) => {
  return gemContract.methods
    .getCollection(userId)
    .call({ from: userId }, (error, result) => {
      if (!error) {
        store.dispatch({
          type: ALL_USER_GEMS_RETRIEVED,
          payload: result
        });

        return result;
      }
      return error;
    });
};

// this is called in authActions when you create a new User
export const getDetailsForAllGemsAUserCurrentlyOwns = userId => {
  store.dispatch({ type: FETCH_USER_GEMS_BEGUN });
  const gemContract = store.getState().app.gemsContractInstance;
  const userName = store.getState().auth.user.name;
  const userImage = store.getState().auth.user.imageURL;

  const listOfGemIds = [];

  getAllUserGems(userId, gemContract).then(listOfGemIdsTheUserOwns =>
    Promise.all(
      listOfGemIdsTheUserOwns.map(gemId => {
        listOfGemIds.push(gemId);
        return getGemQualities(gemContract, gemId).then(
          ([color, level, gradeType, gradeValue]) => ({
            color,
            level,
            gradeType,
            gradeValue
          })
        );
      })
    ).then(responses => {
      const gemImages = Promise.all(
        responses.map(gem => getGemImage(gem.color, gem.gradeType, gem.level))
      );

      const gemStories = Promise.all(
        responses.map(gem => getGemStory(gem.color, gem.level))
      );

      Promise.all([gemImages, gemStories])
        .then(([images, stories]) => {
          const completeGemDetails = listOfGemIds.map((gemId, index) => ({
            id: Number(gemId),
            ...responses[index],
            rate: Number(
              calcMiningRate(
                responses[index].gradeType,
                responses[index].gradeValue
              )
            ),
            auctionIsLive: false,
            owner: userId,
            gemImage: images[index],
            story: stories[index],
            userName,
            userImage
          }));

          if (completeGemDetails.length === 0) {
            store.dispatch({ type: FETCH_USER_GEMS_SUCCEEDED });
            store.dispatch({
              type: USER_HAS_NO_GEMS_IN_WORKSHOP
            });
          } else {
            completeGemDetails
              .forEach(gem => db.collection('stones').add(gem))
              .then(() => {
                store.dispatch({ type: FETCH_USER_GEMS_SUCCEEDED });
                store.dispatch({
                  type: ALL_USER_GEMS_UPLOADED,
                  payload: completeGemDetails
                });
              });
          }
        })
        .catch(error =>
          store.dispatch({ type: FETCH_USER_GEMS_FAILED, payload: error })
        );
    })
  );
};

export const getGemDetails = tokenId => dispatch =>
  db
    .collection(`stones`)
    .where(`id`, `==`, Number(tokenId))
    .onSnapshot(coll => {
      const gemDetails = coll.docs.map(doc => doc.data());
      dispatch({
        type: AUCTION_DETAILS_RECEIVED,
        payload: gemDetails[0]
      });
    });

export const onlyGemsInAuction = () => ({
  type: ONLY_WANT_TO_SEE_GEMS_IN_AUCTIONS
});

export const allMyGems = () => ({
  type: WANT_TO_SEE_ALL_GEMS
});

export const updateGemDetails = (
  userId,
  gemContract,
  userName,
  userImage
) => async () => {
 

  try {
    const idsOfGemsUserOwns = await gemContract.methods
      .getCollection(userId)
      .call();

    return Promise.all(
      idsOfGemsUserOwns.map(gemId =>
        getGemQualities(gemContract, gemId).then(
          ([color, level, gradeType, gradeValue]) => ({
            color,
            level,
            gradeType,
            gradeValue,
            gemId
          })
        )
      )
    ).then(smartContractDetails => {
      const gemImages = Promise.all(
        smartContractDetails.map(gem =>
          getGemImage(gem.color, gem.gradeType, gem.level)
        )
      );

      const gemStories = Promise.all(
        smartContractDetails.map(gem => getGemStory(gem.color, gem.level))
      );

      return Promise.all([gemImages, gemStories]).then(([images, stories]) => {
        const arrayofCompleteGemDetails = idsOfGemsUserOwns.map(
          (gemId, index) => ({
            id: Number(gemId),
            ...smartContractDetails[index],
            rate: Number(
              calcMiningRate(
                smartContractDetails[index].gradeType,
                smartContractDetails[index].gradeValue
              )
            ),
            auctionIsLive: false,
            owner: userId,
            gemImage: images[index],
            story: stories[index] || 'No story for this gem yet.',
            userName,
            userImage
          })
        );

        if (arrayofCompleteGemDetails.length === 0) {
          return Promise.reject('No Gems Available');
        }

        const updateOrCreate = arrayofCompleteGemDetails.map(gem =>
          db
            .collection('stones')
            .where('id', '==', gem.id)
            .get()
            .then(coll => {
              const doc = coll.docs.map(doc => doc.id)[0];

              if (doc) {
                // update it
                return db
                  .collection('stones')
                  .doc(doc)
                  .update(gem);
              }
              // or else create it
              return db.collection('stones').add(gem);
            })
        );
        // check if document exists, update it if it does and create one if it doesn't
        return Promise.all(updateOrCreate).then(() => 'Gems Updated.');
      });
    });
  } catch (err) {
    return err;
  }
};

export const filterUserGemsOnPageLoad = (key, direction) => (
  dispatch,
  getState
) => {
  const allUserGemItems = getState().dashboard.userGems;

  const newMarket = [...allUserGemItems].sort((a, b) => a.rate - b.rate);
  dispatch({ type: DASHBOARD_WAS_FILTERED, payload: newMarket });
};

export const orderDashboardBy = (key, direction) => (dispatch, getState) => {
  const currentDashboardItems = getState().dashboard.filter;
  const newMarket = [...currentDashboardItems].sort(
    (a, b) => (direction === 'desc' ? a[key] - b[key] : b[key] - a[key])
  );
  dispatch({ type: DASHBOARD_WAS_FILTERED, payload: newMarket });
  dispatch({ type: PAGINATE, payload: [1, 8]});
};

export const getGemsForDashboardFilter = selection => (dispatch, getState) => {

  const allGems = getState().dashboard.userGems;
  let newGemSelection;
  if (selection === 'all') {
    newGemSelection = [...allGems];
  }

  if (selection === 'inAuction') {
    newGemSelection = allGems.filter(gem => gem.auctionIsLive === true);
  }

  if (selection === 'notInAuction') {
    newGemSelection = allGems.filter(gem => gem.auctionIsLive === false);
  }

  dispatch({ type: DASHBOARD_WAS_FILTERED, payload: newGemSelection });
  dispatch({ type: PAGINATE, payload: [1, 8]});
};

export const rerenderSortBox = () => dispatch => dispatch({ type: RERENDER_SORT_BOX});
export const sortBoxReredendered = () => dispatch => dispatch({ type: SORT_BOX_RERENDERED});

export const paginate = (pageNumber, pagePerView) => dispatch =>
 dispatch({ type: PAGINATE, payload: [pageNumber, pagePerView]})