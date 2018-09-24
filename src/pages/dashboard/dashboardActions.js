import {
  USER_GEMS_RETRIEVED,
  ALL_USER_GEMS_RETRIEVED,
  ALL_USER_GEMS_UPLOADED,
  USER_HAS_NO_GEMS_IN_WORKSHOP
} from "./dashboardConstants";
import { db } from "../../utils/firebase";
import store from "../../store";
import { getGemQualities } from "../Auction/helpers";
import { getGemImage, getGemStory } from "../gems/helpers";

// this gets all the gems from the database
export const getUserGems = userId => () => {
  db.collection("stones")
    .where("owner", "==", userId)
    .get()
    .then(collection => {
      const gems = collection.docs.map(doc => doc.data());
      store.dispatch({ type: USER_GEMS_RETRIEVED, payload: gems });
    });
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
      return payload;
    });

// this is called in authActions when you create a new User
export const getDetailsForAllGemsAUserCurrentlyOwns = userId => {
  const gemContract = store.getState().app.gemsContractInstance;

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
          auctionIsLive: false,
          owner: userId,
          gemImage: images[index],
          story: stories[index],
        }));

        if (completeGemDetails.length === 0) {
          store.dispatch({
            type: USER_HAS_NO_GEMS_IN_WORKSHOP
          });
        } else {
          completeGemDetails.forEach(gem => db.collection("stones").add(gem));

          store.dispatch({
            type: ALL_USER_GEMS_UPLOADED,
            payload: completeGemDetails
          });
        }
      }).catch(error => console.log('error', error))
    })
  );
};

// check if gems exist in db
// // if they don't add them/ remove
