import {
    BINDING_GEM,
    BULK_PROCESSING,
    GEM_BINDING,
    MINED,
    MINING,
    NEW_PLOT,
    NO_GEM,
    PROCESSED,
    PROCESSING,
    REFRESH_USER_PLOT,
    REFRESH_USER_PLOTS,
    STUCK,
    UNBINDING_GEM,
    USER_PLOTS_RECEIVED
} from "./plotConstants";
import {db} from '../../app/utils/firebase';
import {addPendingTransaction, getUpdatedTransactionHistory} from "../transactions/txActions";

export const getUserPlots = ownerId => async (dispatch, getState) => {
    console.warn("GETTING USER PLOTS>>>");
    const currentUserId = getState().auth.currentUserId;
    let userId = ownerId || currentUserId;
    const plotService = getState().app.plotService;
    const pendingTransactions = getState().tx.pendingTransactions;
    const {userPlots, gemMiningIds} = await plotService.getOwnerPlots(userId);
    console.log("CHECK:" + ownerId + " " + currentUserId + " " + pendingTransactions.length);
    ownerId === currentUserId && pendingTransactions && pendingTransactions.forEach((tx) => {
        console.log("PLOT PENDING TX:", tx);
        if (tx.type === BINDING_GEM || tx.type === UNBINDING_GEM || tx.type === PROCESSING) {
            if (tx.body && tx.body.plot) {
                console.warn("TX BODY PLOT", tx.body.plot);
                const pendingPlotIndex = userPlots.findIndex(plot => Number(plot.id) === Number(tx.body.plot));
                if (pendingPlotIndex > 0) userPlots[pendingPlotIndex].miningState = tx.type;
                if (tx.body.gemId) {
                    gemMiningIds.push(tx.body.gemId.toString());
                }
            }
        }
        if (tx.type === BULK_PROCESSING) {
            if (tx.body && tx.body.plotIds) {
                tx.body.plotIds.forEach(id => {
                    const pendingPlotIndex = userPlots.findIndex(plot => Number(plot.id) === Number(id));
                    if (pendingPlotIndex > 0) userPlots[pendingPlotIndex].miningState = PROCESSING;
                })
            }
        }
    });

    dispatch({
        type: USER_PLOTS_RECEIVED,
        payload: {userPlots, gemMiningIds}
    });
};

export const refreshUserPlot = plot => async (dispatch, getState) => {
    dispatch({
        type: REFRESH_USER_PLOT,
        payload: plot
    })
};

export const bindGem = (plot, gem, updatePlotCallback, transactionStartCallback) => async (dispatch, getState) => {
    console.log(`BIND GEM ${gem.id} to PLOT ${plot.id}`);
    const currentUser = getState().auth.currentUserId;
    const initialMiningState = plot.miningState;
    const web3 = getState().app.web3;
    let txHash;
    const estimatedGas = await getState().app.plotService.estimateBindGas(plot.id, gem.id);
    console.debug("ESTIMATED GAS:", estimatedGas);
    const result = getState().app.plotService.bindGem(plot.id, gem.id, currentUser, estimatedGas)
      .on('transactionHash', (hash) => {
          txHash = hash;
          addPendingTransaction({
              hash: hash,
              userId: currentUser,
              type: BINDING_GEM,
              description: `Binding gem ${gem.id} to plot ${plot.id}`,
              body: {
                  plot: plot.id,
                  gemId: gem.id,
              }
          })(dispatch, getState);
          dispatch({
              type: REFRESH_USER_PLOT,
              payload: {id: plot.id, miningState: BINDING_GEM}
          });
          transactionStartCallback();
          dispatch({
              type: GEM_BINDING,
              payload: {gemId: gem.id, state: 1}
          })
      })
      .on('receipt', async (receipt) => {
          console.log("BIND RECEIPT:", receipt);

          dispatch({
              type: GEM_BINDING,
              payload: {gemId: gem.id, state: 1}
          })
      })
      .on('error', (err) => {
          if (txHash) {
              // dispatch({
              //     type: REFRESH_USER_PLOT,
              //     payload: {id: plot.id, miningState: initialMiningState}
              // })
              getUpdatedTransactionHistory()(dispatch, getState);
          }
          dispatch({
              type: GEM_BINDING,
              payload: {gemId: gem.id, state: 0}
          });
          //updatePlotCallback();
      });
};

export const releaseGem = (plot, updatePlotCallback, transactionStartCallback) => async (dispatch, getState) => {
    console.log(`RELEASE GEM ON PLOT ${plot.id}`);
    const currentUser = getState().auth.currentUserId;
    const web3 = getState().app.web3;
    const estimatedGas = await getState().app.plotService.estimateReleaseGas(plot.id, plot.gemMinesId);
    console.debug("ESTIMATED GAS:", estimatedGas);
    let txHash;
    const result = getState().app.plotService.releaseGem(plot.id, plot.gemMinesId, estimatedGas)
      .on('transactionHash', (hash) => {
          txHash = hash;
          addPendingTransaction({
              hash: hash,
              userId: currentUser,
              type: UNBINDING_GEM,
              description: `Releasing gem ${plot.gemMinesId} from plot ${plot.id}`,
              body: {
                  plot: plot.id,
                  gemId: plot.gemMinesId,
              }
          })(dispatch, getState);
          dispatch({
              type: REFRESH_USER_PLOT,
              payload: {id: plot.id, miningState: UNBINDING_GEM}
          });
          transactionStartCallback && transactionStartCallback();
      })
      .on('receipt', async (receipt) => {
          console.log("RELEASE RECEIPT:", receipt);
          dispatch({
              type: GEM_BINDING,
              payload: {gemId: plot.gemMinesId, state: 0}
          });
      })
      .on('error', (err) => {
          if (txHash) {
              getUpdatedTransactionHistory()(dispatch, getState);
          }
          //updatePlotCallback();
      });
};

export const processPlots = (plotIds) => async (dispatch, getState) => {
    console.log("process plots ids:", plotIds);
    const currentUser = getState().auth.currentUserId;
    const estimatedGas = await getState().app.plotService.estimateProcessPlotsGas(plotIds);
    console.debug("ESTIMATED GAS:", estimatedGas);
    let txHash;
    getState().app.plotService.processPlots(plotIds, estimatedGas)
      .on('transactionHash', (hash) => {
          txHash = hash;
          addPendingTransaction({
              hash: hash,
              userId: currentUser,
              type: BULK_PROCESSING,
              description: `Bulk processing`,
              body: {
                  plotIds,
              }
          })(dispatch, getState);
          dispatch({
              type: REFRESH_USER_PLOTS,
              payload: {ids: plotIds, miningState: PROCESSING}
          })
      })
      .on('receipt', (receipt) => {
          //updatePlotCallback();
          //updatePlotCallback({...plot, processedBlocks: plot.currentPercentage, miningState: previousState});
      })
      .on('error', (err) => {
          if (txHash) {
              getUpdatedTransactionHistory()(dispatch, getState);
          }
      });
};

export const processBlocks = (plot, updatePlotCallback) => async (dispatch, getState) => {
    const currentUser = getState().auth.currentUserId;
    const previousState = plot.miningState;
    console.warn("PLOT:", plot, plot.id);
    const estimatedGas = await getState().app.plotService.estimateProcessBlocksGas(plot.id);
    console.debug("ESTIMATED GAS:", estimatedGas);
    let txHash;
    const result = getState().app.plotService.processBlocks(plot.id, currentUser, estimatedGas)
      .on('transactionHash', (hash) => {
          txHash = hash;
          addPendingTransaction({
              hash: hash,
              userId: currentUser,
              type: PROCESSING,
              description: `Processing plot ${plot.id}`,
              body: {
                  gemId: plot.gemMinesId,
                  plot: plot.id,
              }
          })(dispatch, getState);
          dispatch({
              type: REFRESH_USER_PLOT,
              payload: {id: plot.id, miningState: PROCESSING}
          })
          //updatePlotCallback({...plot, miningState: PROCESSING});
      })
      .on('receipt', (receipt) => {
          //updatePlotCallback();
          //updatePlotCallback({...plot, processedBlocks: plot.currentPercentage, miningState: previousState});
      })
      .on('error', (err) => {
          if (txHash) {
              getUpdatedTransactionHistory()(dispatch, getState);
          }
          //updatePlotCallback({...plot});
      });
};

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
};

export const countTotalUnprocessedBlocks = (plots) => {
    console.log("COUNT");
    let totalUnprocessedBlocks = [0, 0, 0, 0, 0];
    plots.forEach((plot) => {
        if (plot.currentPercentage > plot.processedBlocks) {
            totalUnprocessedBlocks[0] += Math.max(Math.min(plot.currentPercentage, plot.layerEndPercentages[0]) - Math.max(0, plot.processedBlocks), 0);
            console.log("T U S:", totalUnprocessedSum);
            for (let i = 1; i < 5; i++) {
                totalUnprocessedBlocks[i] += Math.max(Math.min(plot.currentPercentage, plot.layerEndPercentages[i])
                  - Math.max(plot.layerEndPercentages[i - 1], plot.processedBlocks), 0);
                console.log("T U S:", i, totalUnprocessedSum);
            }
        }
    });
    const totalUnprocessedSum = totalUnprocessedBlocks.reduce((a, b) => a + b);
    return {totalUnprocessedSum, totalUnprocessedBlocks};
};


export const getCountryData = async (countryId) => {
    const country = (await db.collection('countries').where('countryId', '==',
      Number(countryId)).get()).docs[0].data();
    return country;
};

