import {
    BINDING_GEM, GEM_BINDING,
    GEM_CHANGE_LOCK_STATE,
    MINED,
    MINING,
    NEW_PLOT,
    NO_GEM,
    PROCESSED,
    PROCESSING,
    STUCK,
    UNBINDING_GEM,
    USER_PLOTS_RECEIVED
} from "./plotConstants";
import {db} from '../../app/utils/firebase';

export const getUserPlots = ownerId => async (dispatch, getState) => {
    console.warn("GETTING USER PLOTS>>>");
    let userId = ownerId || getState().auth.currentUserId;
    const plotService = getState().app.plotServiceInstance;
    const {userPlots, gemMiningIds} = await plotService.getOwnerPlots(userId);
    dispatch({
        type: USER_PLOTS_RECEIVED,
        payload: {userPlots, gemMiningIds}
    });
}

export const bindGem = (plot, gem, updatePlotCallback, transactionStartCallback) => async (dispatch, getState) => {
    console.log(`BIND GEM ${gem.id} to PLOT ${plot.id}`);
    const currentUser = getState().auth.currentUserId;
    const initialMiningState = plot.miningState;
    const web3 = getState().app.web3;
    const result = getState().app.plotServiceInstance.bindGem(plot.id, gem.id, currentUser)
      .on('transactionHash', (hash) => {
          transactionStartCallback();
          dispatch({
              type: GEM_BINDING,
              payload: {gemId: gem.id, state: 1}
          })

          //web3.eth.getBlock("pending").then((block) => console.log("PENDING:", block));
      })
      .on('receipt', async (receipt) => {
          console.log("BIND RECEIPT:", receipt);
          //const offset = receipt.events.Updated ? Number(receipt.events.Updated.returnValues['offsetTo']) :
          // plot.currentPercentage;
          //const bound = !!receipt.events.Bound;
          //let newMiningState;
          dispatch({
              type: GEM_BINDING,
              payload: {gemId: gem.id, state: 1}
          })
          updatePlotCallback();

          // if (!bound) {
          //     newMiningState = NO_GEM;
          //     dispatch({
          //         type: GEM_CHANGE_LOCK_STATE,
          //         payload: {gemId: gem.id},
          //     });
          //     updatePlotCallback({
          //         ...plot,
          //         miningState: newMiningState,
          //         currentPercentage: offset,
          //         processedBlocks: offset
          //     });
          // } else {
          //     if (offset >= 100) {
          //         newMiningState = PROCESSED;
          //     } else {
          //         if (offset < plot.layerEndPercentages[gem.level - 1]) {
          //             newMiningState = MINING;
          //         }
          //         else {
          //             newMiningState = STUCK;
          //         }
          //     }
          //     updatePlotCallback({
          //         ...plot,
          //         miningState: newMiningState,
          //         currentPercentage: offset,
          //         processedBlocks: offset,
          //         gemMines: gem,
          //         gemMinesId: gem.id
          //     });
          // }
      })
      .on('error', (err) => {
          dispatch({
              type: GEM_BINDING,
              payload: {gemId: gem.id, state: 1}
          });
          updatePlotCallback();
      });
}

export const releaseGem = (plot, updatePlotCallback, transactionStartCallback) => async (dispatch, getState) => {
    console.log(`RELEASE GEM ON PLOT ${plot.id}`);
    const currentUser = getState().auth.currentUserId;
    const web3 = getState().app.web3;
    const result = getState().app.plotServiceInstance.releaseGem(plot.id)
      .on('transactionHash', (hash) => {
          transactionStartCallback();
          //updatePlotCallback({...plot, miningState: UNBINDING_GEM});
      })
      .on('receipt', async (receipt) => {
          console.log("RELEASE RECEIPT:", receipt);
          updatePlotCallback();
          // const offset = receipt.events.Updated ? Number(receipt.events.Updated.returnValues['offsetTo']) : plot.currentPercentage;
          // const released = !!receipt.events.Released;
          // let newMiningState;
          // if (!released) {
          //     dispatch({
          //         type: GEM_CHANGE_LOCK_STATE,
          //         payload: {gemId: plot.gemMines.id}
          //     });
          //     updatePlotCallback({...plot});
          // } else {
          //     if (offset >= 100) {
          //         newMiningState = PROCESSED;
          //     } else {
          //         newMiningState = NO_GEM;
          //     }
          //     updatePlotCallback({
          //         ...plot,
          //         miningState: newMiningState,
          //         currentPercentage: offset,
          //         processedBlocks: offset,
          //         gemMines: null,
          //         gemMinesId: null
          //     });
          // }
      })
      .on('error', (err) => {
          updatePlotCallback();
      });
}

export const processBlocks = (plot, updatePlotCallback) => async (dispatch, getState) => {
    const currentUser = getState().auth.currentUserId;
    const previousState = plot.miningState;
    const result = getState().app.plotServiceInstance.processBlocks(plot.id, currentUser)
      .on('transactionHash', (hash) => {
          //updatePlotCallback({...plot, miningState: PROCESSING});
      })
      .on('receipt', (receipt) => {
          updatePlotCallback();
          //updatePlotCallback({...plot, processedBlocks: plot.currentPercentage, miningState: previousState});
      })
      .on('error', (err) => {
          updatePlotCallback({...plot});
      });
}

export const calculateMiningStatus = (plot) => {
    // const timeLeftInHours = t => Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    // const timeLeftInMinutes = t => Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
    // const timeLeftInDays = t => Math.floor(t / (1000 * 60 * 60 * 24));
    if (!plot.gemMines && plot.currentPercentage < 100 && !plot.state) {
        return plot.currentPercentage > 0 ? NO_GEM : NEW_PLOT;
    }

    if (!plot.gemMines && plot.state) {
       return PROCESSED;
    }

    if (plot.currentPercentage >= 100) {
        return plot.processedBlocks >= 100 ? PROCESSED : MINED;
    }

    if (plot.gemMines && plot.currentPercentage < 100) {
        const blocksLeft = plot.layerEndPercentages[plot.gemMines.level - 1] - plot.currentPercentage;
        if (blocksLeft === 0) {
            return STUCK;
        } else {
            return MINING;
        }
    }
}

export const getCountryData = async (countryId) => {
    const country = (await db.collection('countries').where('countryId', '==',
      Number(countryId)).get()).docs[0].data();
    return country;
}

