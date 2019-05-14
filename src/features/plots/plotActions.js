import {
    CANT_MINE,
    FINISHED,
    MINING,
    NOT_MINING,
    USER_PLOTS_RECEIVED,
    PROCESSED,
    BINDING_GEM,
    UNBINDING_GEM, PROCESSING, NO_GEM, NEW_PLOT, STUCK
} from "./plotConstants";
import {completedTx, ErrorTx, startTx} from "../transactions/txActions";
import {parseTransactionHashFromError} from "../transactions/helpers";
import {getUserBalance} from "../sale/saleActions";
import { db } from '../../app/utils/firebase';

export const getUserPlots = ownerId => async (dispatch, getState) => {
    console.warn("GETTING USER PLOTS>>>");
    const plotService = getState().app.plotServiceInstance;
    const {userPlots, gemMiningIds} = await plotService.getOwnerPlots(ownerId);
    dispatch({
        type: USER_PLOTS_RECEIVED,
        payload: {userPlots, gemMiningIds}
    });
}

export const bindGem = (plot, gem, updatePlotCallback, transactionStartCallback) => async (dispatch, getState) => {
    console.log(`BIND GEM ${gem.id} to PLOT ${plot.id}`);
    const currentUser = getState().auth.currentUserId;
    const result = getState().app.plotServiceInstance.bindGem(plot.id, gem.id, currentUser)
      .on('transactionHash', (hash) => {
          transactionStartCallback();
          updatePlotCallback({...plot, miningState: BINDING_GEM});
      })
      .on('receipt', async (receipt) => {
          console.log("BIND RECEIPT:", receipt);
          const offset = receipt.events.Updated ? receipt.events.Updated.returnValues['offsetTo'] : plot.currentPercentage;
          const bound = !!receipt.events.Bound;
          let newMiningState;
          if (!bound) {
              newMiningState = NO_GEM;
              updatePlotCallback({...plot, miningState: newMiningState, currentPercentage: offset, processedBlocks: offset});
          } else {
              if (offset >= 100) {
                  newMiningState = PROCESSED;
              } else {
                  if (offset < plot.layerEndPercentages[gem.level-1]) {
                      newMiningState = MINING;
                  }
                  else {
                      newMiningState = STUCK;
                  }
              }
              updatePlotCallback({...plot, miningState: newMiningState, currentPercentage: offset, processedBlocks: offset, gemMines: gem, gemMinesId: gem.id});
          }
      })
      .on('error', (err) => {
          updatePlotCallback({...plot, miningState: NO_GEM});
      });
}

export const releaseGem = (plot, updatePlotCallback) => async (dispatch, getState) => {
    console.log(`RELEASE GEM ON PLOT ${plot.id}`);
    const result = getState().app.plotServiceInstance.releaseGem(plot.id)
      .on('transactionHash', (hash) => {
        updatePlotCallback({...plot, miningState: UNBINDING_GEM});
    })
      .on('receipt', async (receipt) => {
          console.log("RELEASE RECEIPT:", receipt);
          const offset = receipt.events.Updated ? receipt.events.Updated.returnValues['offsetTo'] : plot.currentPercentage;
          let newMiningState;
          if (offset >= 100) {
              newMiningState = PROCESSED;
          } else {
              newMiningState = NO_GEM;
          }
          updatePlotCallback({...plot, miningState: newMiningState, currentPercentage: offset, processedBlocks: offset, gemMines: null, gemMinesId: null});
      })
      .on('error', (err) => {
          updatePlotCallback({...plot});
      });
}

export const processBlocks = (plot, updatePlotCallback) => async (dispatch, getState) => {
    const currentUser = getState().auth.currentUserId;
    const previousState = plot.miningState;
    const result = getState().app.plotServiceInstance.processBlocks(plot.id, currentUser)
      .on('transactionHash', (hash) => {
          updatePlotCallback({...plot, miningState: PROCESSING});
      })
      .on('receipt', async (receipt) => {
          updatePlotCallback({...plot, miningState: previousState});
      })
      .on('error', (err) => {
          updatePlotCallback({...plot});
      });
}

export const calculateMiningStatus = (plot) => {
    // const timeLeftInHours = t => Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    // const timeLeftInMinutes = t => Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
    // const timeLeftInDays = t => Math.floor(t / (1000 * 60 * 60 * 24));

    if (!plot.gemMines && plot.currentPercentage < 100) {
        return plot.currentPercentage > 0 ? NO_GEM: NEW_PLOT;
    }

    if (plot.currentPercentage >= 100) {
        return plot.processedBlocks >= 100 ? PROCESSED : FINISHED;
    }

    if (plot.gemMines && plot.currentPercentage < 100) {
        const blocksLeft = plot.layerEndPercentages[plot.gemMines.level-1] - plot.currentPercentage;
        if (blocksLeft === 0) {
            return STUCK;
        } else {
            return MINING;
        }
    }
}

export const getCountryData = async (countryId) => {
    const country = (await db.collection('countries').where('countryId', '==', Number(countryId)).get()).docs[0].data();
    return country;
}