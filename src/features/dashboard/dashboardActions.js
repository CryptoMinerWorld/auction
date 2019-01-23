import {
    ALL_USER_GEMS_UPLOADED,
    AUCTION_DETAILS_RECEIVED,
    DASHBOARD_WAS_FILTERED,
    FETCH_USER_DETAILS_BEGUN,
    FETCH_USER_DETAILS_FAILED,
    FETCH_USER_DETAILS_SUCCEEDED,
    FETCH_USER_GEMS_BEGUN,
    FETCH_USER_GEMS_SUCCEEDED,
    ONLY_WANT_TO_SEE_GEMS_IN_AUCTIONS,
    PAGINATE,
    RERENDER_SORT_BOX,
    SORT_BOX_RERENDERED,
    USER_DETAILS_RETRIEVED,
    USER_GEMS_RETRIEVED,
    USER_HAS_NO_GEMS_IN_WORKSHOP,
    WANT_TO_SEE_ALL_GEMS,
} from './dashboardConstants';
import {db} from '../../app/utils/firebase';
import store from '../../app/store';
import {calcMiningRate, getGemQualities} from '../items/helpers';
import {getGemImage, getGemStory} from './helpers';
import {setError} from '../../app/appActions';

// this gets all the gems from the database
export const getUserGems = userId => (dispatch) => {
    dispatch({type: FETCH_USER_GEMS_BEGUN});

    const userIdToLowerCase = userId
      .split('')
      .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
      .join('');

    return db
      .collection('stones')
      .where('owner', '==', userIdToLowerCase)
      .orderBy('gradeType', 'desc')
      .get()
      .then((collection) => {
          const gems = collection.docs.map(doc => doc.data());
          dispatch({type: FETCH_USER_GEMS_SUCCEEDED});
          dispatch({type: USER_GEMS_RETRIEVED, payload: gems});
      })
      .catch(error => setError(error));
};

export const getUserGemsOnce = userId => async (dispatch) => {
    dispatch({type: 'FETCH_USER_GEMS_ONCE_BEGUN'});
    const userIdToLowerCase = userId
      .split('')
      .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
      .join('');

    try {
        const gemDetails = (await db.collection('stones')
            .where('owner', '==', userIdToLowerCase)
            .orderBy('gradeType', 'desc')
            .get()
        ).docs.map(doc => doc.data());

        const imagesUploaded = gemDetails.map(async (gemDetail) => {
            gemDetail.gemImage = await getGemImage(gemDetail.color, gemDetail.gradeType, gemDetail.level, gemDetail.id);
            return true;
        });

        await Promise.all(imagesUploaded);

        // if (!gemDetails[0].gemImage) {
        //   return;
        // }

        dispatch({type: FETCH_USER_GEMS_SUCCEEDED});
        dispatch({type: USER_GEMS_RETRIEVED, payload: gemDetails});

    } catch (error) {
        setError(error)
    }

};

export const getUserDetails = userId => (dispatch) => {
    dispatch({type: FETCH_USER_DETAILS_BEGUN});
    try {

        db.collection('users')
          .where('walletId', '==', userId)
          .onSnapshot((collection) => {
              const userDetails = collection.docs.map(doc => doc.data());
              dispatch({type: FETCH_USER_DETAILS_SUCCEEDED});
              dispatch({type: USER_DETAILS_RETRIEVED, payload: userDetails[0]});
          });
    } catch (err) {
        dispatch({type: FETCH_USER_DETAILS_FAILED, payload: err});
    }
};

// this checks the smart contract to see what gems a user owns
// eslint-disable-next-line
export const getAllUserGems = (userId, gemContract) => gemContract.methods.getCollection(userId).call({from: userId}, (error, result) => {

    if (!error) {
        return result;
    }
    return error;
});

// this is called in authActions when you create a new User
export const getDetailsForAllGemsAUserCurrentlyOwns = (userId) => {
    store.dispatch({type: FETCH_USER_GEMS_BEGUN});
    const gemContract = store.getState().app.gemsContractInstance;
    const userName = store.getState().auth.user.name;
    const userImage = store.getState().auth.user.imageURL;

    const listOfGemIds = [];

    getAllUserGems(userId, gemContract).then(listOfGemIdsTheUserOwns => Promise.all(
      listOfGemIdsTheUserOwns.map((gemId) => {
          listOfGemIds.push(gemId);
          return getGemQualities(gemContract, gemId).then(
            ([color, level, gradeType, gradeValue]) => ({
                color,
                level,
                gradeType,
                gradeValue,
            }),
          );
      }),
    ).then((responses) => {
        const gemImages = Promise.all(
          responses.map(gem => getGemImage(gem.color, gem.gradeType, gem.level)),
        );

        const gemStories = Promise.all(responses.map(gem => getGemStory(gem.color, gem.level)));

        Promise.all([gemImages, gemStories])
          .then(async ([images, stories]) => {
              const userIdToLowerCase = userId
                .split('')
                .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
                .join('');

              const completeGemDetails = listOfGemIds.map((gemId, index) => ({
                  id: Number(gemId),
                  ...responses[index],
                  rate: Number(calcMiningRate(responses[index].gradeType, responses[index].gradeValue)),
                  auctionIsLive: false,
                  owner: userIdToLowerCase,
                  gemImage: images[index],
                  story: stories[index],
                  userName,
                  userImage,
              }));

              if (completeGemDetails.length === 0) {
                  store.dispatch({type: FETCH_USER_GEMS_SUCCEEDED});
                  store.dispatch({
                      type: USER_HAS_NO_GEMS_IN_WORKSHOP,
                  });
              } else {
                  await completeGemDetails.forEach(gem => db
                    .collection('stones')
                    .doc(`${gem.id}`)
                    .set(gem));

                  store.dispatch({
                      type: ALL_USER_GEMS_UPLOADED,
                      payload: completeGemDetails,
                  });
                  /* eslint-disable no-console */

                  /* eslint-enable no-console */
                  store.dispatch({type: FETCH_USER_GEMS_SUCCEEDED});
              }
          })
          .catch(error => setError(error));
    }));
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

// this is not an action its just a regular function, no dispatch
export const updateGemDetails = (userId, gemContract, userName, userImage) => async () => {
    const userIdToLowerCase = userId
      .split('')
      .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
      .join('');
    try {
        /* eslint-enable no-console */

        /* eslint-disable no-console */
        const idsOfGemsUserOwns = await gemContract.methods.getCollection(userIdToLowerCase).call();
        //  const idsOfGems = getSpecialGemsList();

        return Promise.all(
          // eslint-disable-next-line
          idsOfGemsUserOwns.map(gemId => getGemQualities(gemContract, gemId).then(([color, level, gradeType, gradeValue]) => ({
              color,
              level,
              gradeType,
              gradeValue,
              gemId,
          }))),
        ).then((smartContractDetails) => {
            const gemImages = Promise.all(
              smartContractDetails.map(gem => getGemImage(gem.color, gem.gradeType, gem.level)),
            );

            const gemStories = Promise.all(
              smartContractDetails.map(gem => getGemStory(gem.color, gem.level)),
            );

            return Promise.all([gemImages, gemStories]).then(([images, stories]) => {
                const arrayofCompleteGemDetails = idsOfGemsUserOwns.map((gemId, index) => ({
                    id: Number(gemId),
                    ...smartContractDetails[index],
                    rate: Number(
                      calcMiningRate(
                        smartContractDetails[index].gradeType,
                        smartContractDetails[index].gradeValue,
                      ),
                    ),
                    auctionIsLive: false,
                    owner: userIdToLowerCase,
                    gemImage: images[index],
                    story: stories[index] || 'No story for this gem yet.',
                    userName,
                    userImage,
                }));

                if (arrayofCompleteGemDetails.length === 0) {
                    // eslint-disable-next-line
                    return Promise.reject('No Gems Available');
                }

                const updateOrCreate = arrayofCompleteGemDetails.map(gem => db
                  .collection('stones')
                  .doc(`${gem.id}`)
                  .set(gem, {merge: true}));
                // check if document exists, update it if it does and create one if it doesn't
                return Promise.all(updateOrCreate).then(() => {
                    store.dispatch({
                        type: ALL_USER_GEMS_UPLOADED,
                        payload: arrayofCompleteGemDetails,
                    });

                    return 'Gems Updated.';
                });
            });
        });
    } catch (err) {

        return err;
    }
};

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
