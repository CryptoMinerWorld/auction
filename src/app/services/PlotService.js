import {utils} from "web3";
import {BigNumber} from "bignumber.js";
import {getCurrentUser} from "../../features/auth/authActions";

export default class PlotService {

    constructor(plotContractInstance, plotSaleContractInstance, minerContractInstance) {
        this.plotSaleContract = plotSaleContractInstance;
        this.plotContract = plotContractInstance;
        this.minerContract = minerContractInstance;
    }

    getPlotsMintedByCountryId = async (countryId) => {
        console.log("COUNTRY ID", countryId);
        return await this.plotContract.methods.minted(countryId).call();
    }

    buyPlots = (countryId, plotsNumber, priceInEth, referrer) => {
        const priceInWei = Number(utils.toWei(priceInEth.toFixed(2), 'ether'));
        console.log("BUYING PLOTS IN COUNTRY ID:", countryId);
        return this.plotSaleContract.methods
          .buy(countryId, plotsNumber, referrer)
          .send({
              value: priceInWei,
          });
    }

    getOwnerPlots = async (ownerId) => {
        const plotsUserOwns = await this.plotContract.methods
          .getPackedCollection(ownerId).call();
        let gemMiningIds = [];
        const userPlots = await Promise.all(plotsUserOwns.map(async plot => {

                const packed96uint = new BigNumber(plot);
                const plotId = packed96uint.dividedToIntegerBy(new BigNumber(2).pow(72)).toNumber();
                const plotCountryId = packed96uint.dividedToIntegerBy(new BigNumber(2).pow(88)).toNumber();
                const plotTiers = unpackPlotProperties(packed96uint
                  .dividedToIntegerBy(new BigNumber(2).pow(8))
                  .modulo(new BigNumber(2).pow(64)));
                const plotState = packed96uint.modulo(new BigNumber(2).pow(8)).toNumber();
                // console.log('PLOT STATE: ', plotState);
                let currentEvaluatedPercentage = 0;
                let gemMinesId = null;
                if (plotState) {
                    try {
                        currentEvaluatedPercentage = await this.minerContract.methods.evaluate(plotId).call();
                        gemMinesId = await this.getBoundGemId(plotId);
                    }
                    catch (e) {

                    }
                }
                if (gemMinesId) gemMiningIds.push(gemMinesId);
                plotTiers.processedBlocks = plotTiers.currentPercentage;
                plotTiers.currentPercentage = Math.max(currentEvaluatedPercentage, plotTiers.currentPercentage);
                return {
                    gemMinesId: gemMinesId,
                    ...plotTiers,
                    id: plotId,
                    owner: ownerId,
                    countryId: plotCountryId,
                    state: plotState,
                }

        }));
        //todo store gem ids that are currently mining plots.
        console.log("OWNER PLOTS: ", userPlots);
        return {userPlots, gemMiningIds};
    }


    getBoundGemId = async (plotId) => {
        return await this.minerContract.methods.getBoundGemId(plotId).call();
    }

    bindGem = (plotId, gemId, currentUser) => {
        console.log("BIND GEM:",currentUser);
        return this.minerContract.methods.bind(plotId, gemId, 0).send({
            from: currentUser,
        });
    }

    releaseGem = (plotId) => {
        return this.minerContract.methods.release(plotId).send();
    }

    processBlocks = (plotId, currentUser) => {
        console.log('UPDATING PLOT:', plotId);
        return this.minerContract.methods.update(plotId).send({
            from: currentUser
        });
    }

    getPlotState = async (plotId) => {
        return await this.plotContract.methods.getState(plotId).call();
    }
}

export const unpackPlotProperties = (packed64PlotProperties) => {

    const layerPercentages = {};
    const layerEndPercentages = {};

    // 64bits: 8 bits - number of tiers, 48 bits - tier structure, 8 bits - current mining block

    // const numberOfBlocks = packed64PlotProperties
    //   .dividedToIntegerBy(new BigNumber(2).pow(7*8))
    //   .modulo(0x100).toNumber();
    const currentBlock = packed64PlotProperties.modulo(0x100).toNumber();
    for (let i = 0; i < 5; i++) {
        layerEndPercentages[i] = packed64PlotProperties
          .dividedToIntegerBy(new BigNumber(2).pow(8 * (5 - i)))
          .modulo(0x100).toNumber();
        layerPercentages[i] = layerEndPercentages[i] - (layerEndPercentages[i - 1] || 0);
    }

    return {
        layerEndPercentages: layerEndPercentages,
        layerPercentages: layerPercentages,
        currentPercentage: currentBlock
    }
}

