import {AUCTION_DETAILS_RECEIVED, CLEAR_GEM_PAGE, NEW_AUCTION_CREATED} from './itemConstants';
import {FETCH_DATA_BEGUN, FETCH_DATA_SUCCEEDED,} from '../../app/reduxConstants';
import {db} from '../../app/utils/firebase';
import {createAuctionHelper, removeAuctionHelper} from './helpers';
import {setError} from '../../app/appActions';
import {completedTx, ErrorTx, startTx} from '../transactions/txActions';
import store from '../../app/store';


export const getGemData = tokenId => async (dispatch, getState) => {
    dispatch({type: FETCH_DATA_BEGUN});

    console.log('----11111---------GEM--------11111----');
    try {
        const gemService = getState().app.gemServiceInstance;
        const auctionService = getState().app.auctionServiceInstance;

        console.log('-----22222--------GEM--------22222-----');

        const gemData = gemService.getGem(tokenId);

        console.log('------33333--------GEM-------33333------', gemData);

        const auctionData = auctionService.getGemAuctionData(tokenId);

        console.log('------44444--------GEM-------44444------', auctionData);

        const gem = {...(await gemData), ...(await auctionData)};

        console.log('------------------GEM-----------------', gem);

        dispatch({type: FETCH_DATA_SUCCEEDED});
        dispatch({
            type: AUCTION_DETAILS_RECEIVED,
            payload: {gem},
        });

    }
    catch (e) {
        console.log('GET GEM DATA ERROR: ', e);
        setError(e);
    }
}

export const getOwnerDataByOwnerId = async ownerId => {
    console.log('OWNER_ID: ', ownerId);

    try {
        const userIdToLowerCase = ownerId
          .split('')
          .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
          .join('');

        return db
          .doc(`users/${userIdToLowerCase}`)
          .get()
          .then(doc => doc.data())
    } catch (err) {
        setError(err);
    }
}
// export const getAuctionDetails = tokenId => async (dispatch, getState) => {
//     dispatch({type: FETCH_DATA_BEGUN});
//     console.log('getAuctionDetails:::::::::::::::1');
//     try {
//         const gemDetails = (await db.collection('stones')
//             .where('id', '==', Number(tokenId))
//             .get()
//         ).docs[0].data();
//         console.log('getAuctionDetails:::::::::::::::', gemDetails);
//         const gemContract = getState().app.gemsContractInstance;
//
//         console.log('getAuctionDetails:::::::::::::::2');
//
//         const gemQualities = await getGemQualities(gemContract, tokenId);
//         gemDetails.color = gemQualities[0];
//         gemDetails.level = gemQualities[1];
//         gemDetails.gradeType = gemQualities[2];
//         gemDetails.gradeValue = gemQualities[3];
//         gemDetails.id = tokenId;
//         gemDetails.rate = calcMiningRate(gemDetails.gradeType, gemDetails.gradeValue);
//         gemDetails.auctionIsLive = false;
//         //gemDetails.userName = store.getState().auth.user.name;
//         //gemDetails.userImage = store.getState().auth.user.imageURL;
//
//         let gemImage = await getGemImage(gemDetails.color, gemDetails.gradeType, gemDetails.level, gemDetails.id);
//         let gemStory = await getGemStory(gemDetails.color, gemDetails.level, gemDetails.id);
//         //await Promise.all(gemImage, gemStory);
//         console.log("IMAGE::", gemImage);
//         console.log("STORY!!!!:", gemStory);
//         gemDetails.gemImage = gemImage;
//         gemDetails.story = gemStory;
//
//         console.log(222222222, gemDetails);
//
//         // if (!gemDetails[0].gemImage) {
//         //   return;
//         // }
//
//         dispatch({type: FETCH_DATA_SUCCEEDED});
//         dispatch({
//             type: AUCTION_DETAILS_RECEIVED,
//             payload: gemDetails,
//         });
//
//     } catch (error) {
//         setError(error)
//     }
//
// };

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

export const getRestingEnergy = timestamp => {
    const ageSeconds = (Date.now() / 1000 || 0) - timestamp;
    const ageMinutes = Math.floor(ageSeconds / 60);
    return Math.floor(
      // eslint-disable-next-line
      -7e-6 * Math.pow(ageMinutes, 2) + 0.5406 * ageMinutes,
    );
};


export function clearGemPageOnExit() {
    return dispatch => dispatch({type: CLEAR_GEM_PAGE});
}

export const upgradeGem = (gem, levelUp, gradeUp, hidePopup) => (dispatch, getState) => {
    console.log(333333333333, 'upgrading...');
    const workshopContractInstance = getState().app.workshopContractInstance;
    const gemService = getState().app.gemServiceInstance;
    console.log('Contract: ', workshopContractInstance);
    const currentUser = getState().app.currentAccount;
    console.log('TX start');
    return workshopContractInstance.methods
      .upgrade(gem.id, levelUp, gradeUp)
      .send()
      .on('transactionHash', (hash) => {
          console.log('transactionHash: ', hash);
          hidePopup();
          store.dispatch(
            startTx({
                hash,
                currentUser,
                method: 'upgrade',
                tokenId: gem.id,
            }),
          );
      })
      .on('receipt', async (receipt) => {
          console.log('TX receipt: ', receipt);
          store.dispatch(completedTx(receipt));
          console.log('COMPLETED_TX dispatched');
          const newGemData = await gemService.getGem(gem.id);

          console.log('NEW GEM DATA: ', newGemData);
          console.log('GEM DATA + NEW DATA:', {...gem, ...newGemData});

          //dispatch({type: FETCH_DATA_SUCCEEDED});
          dispatch({
              type: AUCTION_DETAILS_RECEIVED,
              payload: {gem: {...gem, ...newGemData}}
          });
          //setLoading(false);
      })
      .on('error', (err) => {
          console.log('TX error');
          store.dispatch(ErrorTx(err));
          //setLoading(false);
          // dispatch({
          //   type: MODAL_GONE,
          // });
          // dispatch({
          //   type: FETCH_DATA_FAILED,
          //   payload: JSON.stringify(err),
          // });
      });
};

