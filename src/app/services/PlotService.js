import {utils} from "web3";
import {BigNumber} from "bignumber.js";
import {BINDING_GEM, BULK_PROCESSING, PLOT_SALE, PROCESSING, UNBINDING_GEM} from "../../features/plots/plotConstants";
import {COUNTRY_WITHDRAW} from "../../features/dashboard/dashboardConstants";

export default class PlotService {

    constructor(plotContract, plotSaleContract, minerContracts) {
        this.plotSaleContract = plotSaleContract;
        this.plotContract = plotContract;
        this.minerContracts = minerContracts;
    }

    resolveMinerByGemId = (gemId) => {
        return this.minerContracts[this.resolveMinerIndexByGemId(gemId)];
    };

    resolveMinerIndexByGemId = gemId => {
        if (gemId > 0xF100 && gemId < 0xF200) {
            if (this.minerContracts.length < 2) {
                console.error("No miner contract for gemId between 0xF100 and 0xF200 provided");
                throw "No miner contract for gemId between 0xF100 and 0xF200 provided";
            }
            return 1;
        }
        return 0;
    };

    groupPlotIdsByMiners = (plots) => {
        const groups = Array.from({length: this.minerContracts.length}, () => []);
        plots.forEach(plot => groups[this.resolveMinerIndexByGemId(plot.gemMinesId)].push(plot.id));
        return plots;
    };

    withdrawCountriesEth = (ownerId) => {
        return this.plotSaleContract.methods
          .withdraw(ownerId)
          .send({}, {messages: {txType: COUNTRY_WITHDRAW, description: `Withdrawing countries income`}});
    };

    getTotalNotWithdrawn = async (owner) => {
        return await this.plotSaleContract.methods.balanceOf(owner).call();
    };

    getPlotsMintedByCountryId = async (countryId) => {
        console.log("COUNTRY ID", countryId);
        return await this.plotContract.methods.minted(countryId).call();
    };

    buyPlots = (countryId, plotsNumber, priceInEth, referrer) => {
        const priceInWei = Number(utils.toWei(priceInEth.toFixed(2), 'ether'));
        return this.plotSaleContract.methods
          .buy(countryId, plotsNumber)
          .send({
              value: priceInWei,
          }, {messages: {txType: PLOT_SALE, description: `Buying ${plotsNumber} plots`}});
    };

    getEffectiveRestingEnergyOf = async (gemId) => {
        return await this.resolveMinerByGemId(gemId).methods.restingEnergyOf(gemId).call();
    };

    unpackPlot = ([high256, low256]) => {
        const plotTiers = unpackPlotProperties(high256
          .dividedToIntegerBy(new BigNumber(2).pow(192))
          .modulo(new BigNumber(2).pow(64)));
        const plotState = high256.dividedToIntegerBy(new BigNumber(2).pow(32)).modulo(new BigNumber(2).pow(8)).toNumber();
        return {
            ...plotTiers,
            plotState
        }
    };

    unpackPlotFromCollection = async (packedPlot) => {
        const packed96uint = new BigNumber(packedPlot);
        const plotId = packed96uint.modulo(new BigNumber(2).pow(24)).toNumber();
        const plotCountryId = packed96uint.dividedToIntegerBy(new BigNumber(2).pow(16)).modulo(new BigNumber(2).pow(8)).toNumber();
        const plotTiers = unpackPlotProperties(packed96uint
          .dividedToIntegerBy(new BigNumber(2).pow(32))
          .modulo(new BigNumber(2).pow(64)));
        const plotState = packed96uint.dividedToIntegerBy(new BigNumber(2).pow(24)).modulo(new BigNumber(2).pow(8)).toNumber();
        // console.log('PLOT STATE: ', plotState);
        plotTiers.processedBlocks = plotTiers.currentPercentage;
        return {
            ...plotTiers,
            id: plotId,
            countryId: plotCountryId,
            state: plotState,
        }
    };

    getOwnerPlots = async (ownerId) => {
        const plotsUserOwns = await this.plotContract.methods
          .getPackedCollection(ownerId).call();
        let gemMiningIds = [];
        const userPlots = await Promise.all(plotsUserOwns.map(async plot => {
            let gemMinesId = null;
            const unpackedPlot = await this.unpackPlotFromCollection(plot);
            if (unpackedPlot.state) {
                try {
                    gemMinesId = await this.getBoundGemId(unpackedPlot.id);
                }
                catch (e) {
                    console.error("Could not get gem mines", e);
                }
            }
            if (gemMinesId) {
                gemMiningIds.push(gemMinesId);
                let currentEvaluatedPercentage = 0;
                    try {
                        currentEvaluatedPercentage = await this.resolveMinerByGemId(gemMinesId).methods.evaluate(unpackedPlot.id).call();
                    }
                    catch (e) {
                        console.error("Could not evaluate current percentage", e);
                    }
                unpackedPlot.currentPercentage = Math.max(currentEvaluatedPercentage, unpackedPlot.currentPercentage);
            }
            unpackedPlot.owner = ownerId;
            unpackedPlot.gemMinesId = gemMinesId;
            return unpackedPlot
        }));
        console.log("OWNER PLOTS: ", userPlots);
        return {userPlots, gemMiningIds};
    };

    getPlotBoundToGem = async (gemId) => {
        const plotId = (await this.resolveMinerByGemId(gemId).methods.getGemBinding(gemId).call())[0];
        if (plotId) {
            const packedPlot = (await this.plotContract.methods.getPacked(plotId).call());
            const unpackedPlot = await this.unpackPlot([new BigNumber(packedPlot[0]), new BigNumber(packedPlot[1])]);
            unpackedPlot.id = plotId;
            unpackedPlot.gemMinesId = gemId;
            unpackedPlot.countryId = new BigNumber(plotId).dividedToIntegerBy(new BigNumber(2).pow(16)).modulo(new BigNumber(2).pow(8)).toNumber();
            let currentEvaluatedPercentage = 0;
            if (unpackedPlot.plotState) {
                try {
                    currentEvaluatedPercentage = await this.resolveMinerByGemId(gemId).methods.evaluate(plotId).call();
                }
                catch (e) {
                    console.error("Could not evaluate current percentage", e);
                }
            }
            unpackedPlot.processedBlocks = unpackedPlot.currentPercentage;
            unpackedPlot.currentPercentage = Math.max(currentEvaluatedPercentage, unpackedPlot.currentPercentage);
            return unpackedPlot;
        }
    };

    getBoundGemId = async (plotId) => {
        const minerBoundGemIds = await Promise.all(this.minerContracts.map(async miner => (await miner.methods.getPlotBinding(plotId).call())[0]));
        const boundGemId = minerBoundGemIds.find(id => id && Number(id) > 0);
        if (!boundGemId) {
            console.error("No gem bound is found on any miner");
            throw "No gem bound is found on any miner";
        }
        return boundGemId;
    };


    estimateBindGas = async (plotId, gemId) => {
        return await this.resolveMinerByGemId(gemId).methods.bind(plotId, gemId).estimateGas({gas: 1400000});
    };

    estimateReleaseGas = async (plotId, gemId) => {
        return await this.resolveMinerByGemId(gemId).methods.release(plotId).estimateGas({gas: 1400000});
    };

    estimateProcessBlocksGas = async (plotId, gemId) => {
        return await this.resolveMinerByGemId(gemId).methods.update(plotId).estimateGas({gas: 1400000});
    };

    estimateProcessPlotsGas = async (plotIds, miner) => {
        return await miner.methods.bulkUpdate(plotIds).estimateGas({gas: 1400000});
    };

    bindGem = (plotId, gemId, currentUser, gasEstimation) => {
        return this.resolveMinerByGemId(gemId).methods.bind(plotId, gemId).send({
            from: currentUser,
            gas: Number(gasEstimation) + 500000
        }, {messages: {txType: BINDING_GEM, description: `Binding gem ${gemId} to plot ${plotId}`}});
    };

    releaseGem = (plotId, gemId, gasEstimation) => {
        return this.resolveMinerByGemId(gemId).methods.release(plotId).send({gas: Number(gasEstimation) + 500000},
          {messages: {txType: UNBINDING_GEM, description: `Releasing gem ${gemId} from plot ${plotId}`}});
    };

    processBlocks = (plotId, gemId, currentUser, gasEstimation) => {
        console.log('UPDATING PLOT:', plotId);
        return this.resolveMinerByGemId(gemId).methods.update(plotId).send({
            from: currentUser,
            gas: gasEstimation + 500000
        }, {messages: {txType: PROCESSING, description: `Processing plot ${plotId}`}});
    };

    processPlots = (plotIds, miner, gasEstimation) => {
        return miner.methods.bulkUpdate(plotIds).send({gas: gasEstimation + 500000},
          {messages: {txType: BULK_PROCESSING, description: `Bulk processing`}});
    };

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
};

export const useCoupon = (couponCode) => {
    return this.plotSaleContract.methods.useCoupon(couponCode)
      .send();
};

const MINUTES_TO_MINE = [90, 720, 2160, 4320, 8640];

const blocksToEnergy = (tier, n) => {
    // calculate based on the tier number and return
    // array bounds keep tier index to be valid
    return MINUTES_TO_MINE[tier] * n;
};

export const blocksToMinutes = (plot) => {
    let blocksMinutes = [];
    // const rate = miningRate(plot.gemMines.gradeType, plot.gemMines.gradeValue);
    const rate = Number(plot.gemMines.rate);

    for (let tier = 0; tier < 5; tier++) {
        const minutes = 100 * blocksToEnergy(tier, Math.min(Math.max(plot.layerEndPercentages[tier] - plot.currentPercentage, 0), plot.layerPercentages[tier])) / (100 + rate);
        console.log("Minutes:", minutes);
        console.log("n:", Math.min(Math.max(plot.layerEndPercentages[tier] - plot.currentPercentage, 0), plot.layerPercentages[tier]));
        blocksMinutes.push(convertMinutesToTimeString(minutes));
    }
    return blocksMinutes;
};

export const getTimeLeftMinutes = (plot, gem) => {
    let energyLeft = 0;
    for (let tier = 0; tier < 5; tier++) {
        if (gem.level - 1 < tier) break;
        energyLeft += blocksToEnergy(tier, Math.min(Math.max(plot.layerEndPercentages[tier] - plot.currentPercentage, 0), plot.layerPercentages[tier]));
    }
    return 100 * energyLeft / (100 + Number(gem.rate));
};

export const convertMinutesToTimeString = (minutes) => {
    const minutesLeft = calculateTimeLeftInMinutes(minutes);
    const hoursLeft = calculateTimeLeftInHours(minutes);
    const daysLeft = calculateTimeLeftInDays(minutes);
    return daysLeft > 0 ? (daysLeft + "d " + hoursLeft + "h") : (hoursLeft > 0 ? hoursLeft + "h " + minutesLeft + "m" : (minutesLeft + "m"));
};

const calculateTimeLeftInDays = t => Math.floor(t / (60 * 24));
const calculateTimeLeftInHours = t => Math.floor((t % (60 * 24)) / 60);
const calculateTimeLeftInMinutes = t => Math.floor(t % 60);
