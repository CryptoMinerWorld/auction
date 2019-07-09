import {utils} from "web3";
import {BigNumber} from "bignumber.js";
import {getCurrentUser} from "../../features/auth/authActions";
import {UNBINDING_GEM} from "../../features/plots/plotConstants";

export default class PlotService {

    constructor(plotContractInstance, plotSaleContractInstance, minerContractInstance) {
        this.plotSaleContract = plotSaleContractInstance;
        this.plotContract = plotContractInstance;
        this.minerContract = minerContractInstance;
    }

    withdrawCountriesEth = (ownerId) => {
        return this.plotSaleContract.methods
          .withdraw(ownerId)
          .send();
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
        console.log("BUYING PLOTS IN COUNTRY ID:", countryId);
        return this.plotSaleContract.methods
          .buy(countryId, plotsNumber)
          .send({
              value: priceInWei,
          });
    };

    getEffectiveRestingEnergyOf = async (gemId) => {
        return await this.minerContract.methods.restingEnergyOf(gemId).call();
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
        let currentEvaluatedPercentage = 0;
        if (plotState) {
            try {
                currentEvaluatedPercentage = await this.minerContract.methods.evaluate(plotId).call();
            }
            catch (e) {
                console.error("Could not evaluate current percentage", e);
            }
        }
        plotTiers.processedBlocks = plotTiers.currentPercentage;
        plotTiers.currentPercentage = Math.max(currentEvaluatedPercentage, plotTiers.currentPercentage);
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
            if (gemMinesId) gemMiningIds.push(gemMinesId);
            unpackedPlot.owner = ownerId;
            unpackedPlot.gemMinesId = gemMinesId;
            return unpackedPlot
        }));
        console.log("OWNER PLOTS: ", userPlots);
        return {userPlots, gemMiningIds};
    };


    getPlotBoundToGem = async (gemId) => {
        const plotId = (await this.minerContract.methods.getGemBinding(gemId).call())[0];
        if (plotId) {
            const packedPlot = (await this.plotContract.methods.getPacked(plotId).call());
            const unpackedPlot = await this.unpackPlot([new BigNumber(packedPlot[0]), new BigNumber(packedPlot[1])]);
            unpackedPlot.id = plotId;
            unpackedPlot.gemMinesId = gemId;
            unpackedPlot.countryId = new BigNumber(plotId).dividedToIntegerBy(new BigNumber(2).pow(16)).modulo(new BigNumber(2).pow(8)).toNumber();
            let currentEvaluatedPercentage = 0;
            if (unpackedPlot.plotState) {
                try {
                    currentEvaluatedPercentage = await this.minerContract.methods.evaluate(plotId).call();
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
        return (await this.minerContract.methods.getPlotBinding(plotId).call())[0];
    };

    bindGem = (plotId, gemId, currentUser) => {
        console.log("BIND GEM:",currentUser);
        return this.minerContract.methods.bind(plotId, gemId).send({
            from: currentUser,
        });
    };

    releaseGem = (plotId) => {
        console.log("Release gem. Miner contract:", this.minerContract);
        // return this.minerContract.release(plotId).send();
        return this.minerContract.methods.release(plotId).send({}, {messages: {txType: UNBINDING_GEM}});
    };

    processBlocks = (plotId, currentUser) => {
        console.log('UPDATING PLOT:', plotId);
        return this.minerContract.methods.update(plotId).send({
            from: currentUser
        });
    };

    processPlots = (plotIds) => {
        return this.minerContract.methods.bulkUpdate(plotIds).send();
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
        const minutes = 100*blocksToEnergy(tier, Math.min(Math.max(plot.layerEndPercentages[tier] - plot.currentPercentage, 0), plot.layerPercentages[tier]))/(100 + rate);
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
const calculateTimeLeftInHours = t => Math.floor((t % (60 * 24))/ 60);
const calculateTimeLeftInMinutes = t => Math.floor(t % 60);
