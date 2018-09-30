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
  FETCH_USER_DETAILS_FAILED
} from "./dashboardConstants";
import { db } from "../../app/utils/firebase";
import store from "../../app/store";
import { getGemQualities, calcMiningRate } from "../items/helpers";
import { getGemImage, getGemStory } from "./helpers";

// this gets all the gems from the database
export const getUserGems = userId => dispatch => {
  dispatch({ type: FETCH_USER_GEMS_BEGUN });
  try {
    db.collection("stones")
      .where("owner", "==", userId)
      .onSnapshot(collection => {
        const gems = collection.docs.map(doc => doc.data());
        dispatch({ type: FETCH_USER_GEMS_SUCCEEDED });
        dispatch({ type: USER_GEMS_RETRIEVED, payload: gems });
      });
  } catch (err) {
    dispatch({ type: FETCH_USER_GEMS_FAILED, payload: err });
  }
};

export const getUserDetails = userId => dispatch => {
  dispatch({ type: FETCH_USER_DETAILS_BEGUN });
  try {
    db.collection("users")
      .where("walletId", "==", userId)
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
export const getAllUserGems = (userId, gemContract) =>

  gemContract.methods
    .getCollection(userId)
    .call()
    .then(payload => {
      store.dispatch({
        type: ALL_USER_GEMS_RETRIEVED,
        payload
      });
      console.log('collection of gems user owns', payload)
      return payload;
    });

// this is called in authActions when you create a new User
export const getDetailsForAllGemsAUserCurrentlyOwns = userId => {
  store.dispatch({ type: FETCH_USER_GEMS_BEGUN });
  const gemContract = store.getState().app.gemsContractInstance;
  const userName = store.getState().auth.user.name;
  const userImage = store.getState().auth.user.imageURL;

  const listOfGemIds = [];

  // export const getAllGems
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
              .forEach(gem => db.collection("stones").add(gem))
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
