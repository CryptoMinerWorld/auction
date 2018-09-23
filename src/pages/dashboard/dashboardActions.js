import { USER_GEMS_RETRIEVED, ALL_USER_GEMS_RETRIEVED } from "./dashboardConstants";
import { db } from "../../utils/firebase";
import store from "../../store";

// const getAllUserGems = (userId, gemsContract) => {
const getAllUserGems = () => {
  const userId = store.getState().auth.currentUserId;
  const gemContract = store.getState().app.gemsContractInstance;

  gemContract.methods
    .getCollection(userId)
    .call()
    .then(payload =>
      store.dispatch({
        type: ALL_USER_GEMS_RETRIEVED,
        payload
      })
    );
};

export const getUserGems = userId => () =>
  db
    .collection("auctions")
    .where("owner", "==", userId)
    .get()
    .then(collection => {
      const gems = collection.docs.map(doc => doc.data());
      store.dispatch({ type: USER_GEMS_RETRIEVED, payload: gems });
      getAllUserGems();
    });

export const TEMP = () => console.log("frog");
