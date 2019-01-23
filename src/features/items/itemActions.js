import {AUCTION_DETAILS_RECEIVED, CLEAR_GEM_PAGE, NEW_AUCTION_CREATED} from './itemConstants';
import {FETCH_DATA_BEGUN, FETCH_DATA_SUCCEEDED, MODAL_GONE,} from '../../app/reduxConstants';
import {db} from '../../app/utils/firebase';
import {createAuctionHelper, getGemImage, getGemStory, removeAuctionHelper} from './helpers';
import {setError} from '../../app/appActions';
import {completedTx, ErrorTx, startTx} from '../transactions/txActions';
import store from '../../app/store';

export const getAuctionDetails = tokenId => async (dispatch) => {
  dispatch({type: FETCH_DATA_BEGUN});

  try {
    const gemDetails = (await db.collection('stones')
        .where('id', '==', Number(tokenId))
        .get()
    ).docs.map(doc => doc.data());

    const imagesAndStoriesUploaded = gemDetails.map(async (gemDetail) => {
        let gemImage = await getGemImage(gemDetail.color, gemDetail.gradeType, gemDetail.level, gemDetail.id);
        let gemStory = await getGemStory(gemDetail.color, gemDetail.level, gemDetail.id);
        //await Promise.all(gemImage, gemStory);
        console.log("IMAGE::", gemImage);
        console.log("STORY!!!!:", gemStory);
        gemDetail.gemImage = gemImage;
        gemDetail.story = gemStory;
        return true;
    });

    await Promise.all(imagesAndStoriesUploaded);

    console.log(222222222, gemDetails);

    // if (!gemDetails[0].gemImage) {
    //   return;
    // }

    dispatch({type: FETCH_DATA_SUCCEEDED});
    dispatch({
      type: AUCTION_DETAILS_RECEIVED,
      payload: gemDetails[0],
    });

  } catch (error) {
    setError(error)
  }

};

export const updateGemOwnership = (gemId, newOwner, history, priceInWei) => async (dispatch) => {
  const userIdToLowerCase = newOwner
    .split('')
    .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
    .join('');

  const newGemOwner = await db
    .doc(`users/${userIdToLowerCase}`)
    .get()
    .then(doc => doc.data())
    .catch(err => setError(err));

  const {name, imageURL} = newGemOwner;

  // update gem with new owner, name and image
  return db
    .collection('stones')
    .where('id', '==', gemId)
    .get()
    .then(coll => coll.docs.map(doc => db
      .doc(`stones/${doc.id}`)
      .update({
        userName: name,
        userImage: imageURL,
        owner: userIdToLowerCase,
        auctionIsLive: false,
        lastSoldFor: priceInWei,
      })
      .then(() => {
        history.push(`/profile/${userIdToLowerCase}`);
        dispatch({type: MODAL_GONE});
      })
      .catch(err => setError(err))));
};

export const createAuction = (payload, turnLoaderOff, history) => (dispatch, getState) => {
  const {auth, app} = getState();
  const currentAccount = auth.currentUserId;
  const {gemsContractInstance} = app;

  const {
    tokenId, duration, startPrice, endPrice,
  } = payload;

  // console.log('payload', payload);

  createAuctionHelper(tokenId, duration, startPrice, endPrice, gemsContractInstance, currentAccount)
    .then(({deadline, minPrice, maxPrice}) => {
      // console.log('deadline, minPrice, maxPrice ', deadline, minPrice, maxPrice);
      db.collection('stones')
        .where('id', '==', tokenId)
        .get()
        .then(async (coll) => {
          const document = await coll.docs.map(doc => doc)[0];
          await db.doc(`stones/${document.id}`).update({
            auctionIsLive: true,
            deadline,
            minPrice,
            maxPrice,
            currentPrice: maxPrice,
          });

          const completeGemInfo = {
            ...document.data(),
            auctionIsLive: true,
            deadline,
            minPrice,
            maxPrice,
            currentPrice: maxPrice,
          };

          return dispatch({
            type: NEW_AUCTION_CREATED,
            payload: completeGemInfo,
          });
        })
        .then(() => {
          // getUserGemsOnce(currentAccount)
          turnLoaderOff();
          history.push(`/profile/${currentAccount}`);
        })
        .catch((err) => {
          console.log('err putting gem in auction', err);
          setError(err);
        });
    })
    .catch((err) => {
      turnLoaderOff();
      setError(err);
    });
};

// @notice removes a gem from an auction
export const removeFromAuction = (tokenId, history, turnLoaderOff) => async (
  dispatch,
  getState,
) => {
  const dutchContract = getState().app.dutchContractInstance;
  const currentUser = getState().auth.currentUserId;
  // eslint-disable-next-line
  const gemContractAddress = getState().app.gemsContractInstance._address;

  removeAuctionHelper(dutchContract, tokenId, gemContractAddress)
    .send({
      from: currentUser,
    })
    .on('transactionHash', (hash) => {
      store.dispatch(
        startTx({
          hash,
          currentUser,
          method: 'gem',
          tokenId,
        }),
      );
    })
    .on('receipt', (receipt) => {
      store.dispatch(completedTx(receipt));
      db.collection('stones')
        .where('id', '==', Number(tokenId))
        .get()
        .then(async (coll) => {
          // eslint-disable-next-line
          for (const doc of coll.docs) {
            // coll.docs.map(async (doc) => {
            // eslint-disable-next-line
            await db.doc(`stones/${doc.id}`).update({
              auctionIsLive: false,
            });
            dispatch({
              type: 'GEM_REMOVED_FROM_AUCTION',
              payload: doc.data().id,
            });
            // getUserGemsOnce(currentUser)
            history.push(`/profile/${currentUser}`);
          }
        });
    })
    .on('error', (error) => {
      store.dispatch(ErrorTx(error));
      console.error(error, 'error removing gem from auction');
      setError(error, 'Error removing gem from auction');
      turnLoaderOff();
    });
};

// @notice lets users buy a gem in an active auction
export const handleBuyNow = (_tokenId, _from, history, setLoading) => (dispatch, getState) => {
  const dutchAuctionContractInstance = getState().app.dutchContractInstance;
  const priceInWei = getState().auction.currentPrice;
  // eslint-disable-next-line
  const gemContractAddress = getState().app.gemsContractInstance._address;
  const currentUser = getState().app.currentAccount;

  return dutchAuctionContractInstance.methods
    .buy(gemContractAddress, _tokenId)
    .send({
      value: priceInWei,
    })
    .on('transactionHash', (hash) => {
      store.dispatch(
        startTx({
          hash,
          currentUser,
          method: 'gem',
          tokenId: _tokenId,
        }),
      );
    })
    .on('receipt', (receipt) => {
      store.dispatch(completedTx(receipt));
      dispatch(updateGemOwnership(_tokenId, _from, history, priceInWei));
      setLoading(false);
    })
    .on('error', (err) => {
      setLoading(false);
      store.dispatch(ErrorTx(err));
      // dispatch({
      //   type: MODAL_GONE,
      // });
      // dispatch({
      //   type: FETCH_DATA_FAILED,
      //   payload: JSON.stringify(err),
      // });
    });
};

export const getRestingEnergy = tokenId => (dispatch, getState) => {
  const gemContract = getState().app.gemsContractInstance;
  return (
    gemContract
    && gemContract.methods
      .getCreationTime(tokenId)
      .call()
      .then((result) => {
        const ageSeconds = (Date.now() / 1000 || 0) - result;
        const ageMinutes = Math.floor(ageSeconds / 60);
        const restingEnergyMinutes = Math.floor(
          // eslint-disable-next-line
          -7e-6 * Math.pow(ageMinutes, 2) + 0.5406 * ageMinutes,
        );

        return restingEnergyMinutes;
      })
      .catch(err => setError(err))
  );
};

export const useMetalsToUpgrade = (dispatch, getState) => {

}

export function clearGemPageOnExit() {
  return dispatch => dispatch({type: CLEAR_GEM_PAGE});
}
