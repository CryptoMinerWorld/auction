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

const MINUTES_TO_MINE = [30, 240, 720, 1440, 2880];

const blocksToEnergy = (tier, n) => {
    // calculate based on the tier number and return
    // array bounds keep tier index to be valid
    return MINUTES_TO_MINE[tier] * n;
}

export const blocksToMinutes = (plot) => {
    let blocksMinutes = [];
    const rate = miningRate(plot.gemMines.gradeType, plot.gemMines.gradeValue);
    for (let tier = 0; tier < 5; tier++) {
        const minutes = 10e8 * blocksToEnergy(tier, Math.min(Math.max(plot.layerEndPercentages[tier] - plot.currentPercentage, 0), plot.layerPercentages[tier]))/rate;
        blocksMinutes.push(convertMinutesToTimeString(minutes));
    }
    return blocksMinutes;
}

export const getTimeLeftMinutes = (plot) => {
    let energyLeft = 0;
    for (let tier = 0; tier < 5; tier++) {
        if (plot.gemMines.level - 1 < tier) break;
        console.log(`tier ${tier} blocks left:`,
          Math.min(Math.max(plot.layerEndPercentages[tier] - plot.currentPercentage, 0), plot.layerPercentages[tier]));
        energyLeft += blocksToEnergy(tier, Math.min(Math.max(plot.layerEndPercentages[tier] - plot.currentPercentage, 0), plot.layerPercentages[tier]));
    }
    const minutes = 10e8 * energyLeft / miningRate(plot.gemMines.gradeType, plot.gemMines.gradeValue);
    return convertMinutesToTimeString(minutes);
}

const convertMinutesToTimeString = (minutes) => {
    const minutesLeft = calculateTimeLeftInMinutes(minutes);
    const hoursLeft = calculateTimeLeftInHours(minutes);
    const daysLeft = calculateTimeLeftInDays(minutes);
    return daysLeft > 0 ? (daysLeft + "d " + hoursLeft + "h") : (hoursLeft > 0 ? hoursLeft + "h " + minutesLeft + "m" : (minutesLeft + "m"));
}

const calculateTimeLeftInDays = t => Math.floor(t / (60 * 24));
const calculateTimeLeftInHours = t => Math.floor((t % (60 * 24))/ 60);
const calculateTimeLeftInMinutes = t => Math.floor(t % 60);

const miningRate = (gradeType, gradeValue) => {

    // for grades D, C, B: e = [1, 2, 3]
    console.log("GRADETYPE, GRADE VALUE:", gradeType, gradeValue);

    switch (gradeType - 1) {
        case 0:
        case 1:
        case 2:
            return 100000000 + 10000000 * (gradeType - 1) + 5 * gradeValue;
        case 3:
            return 140000000 + 15 * gradeValue;
        case 4:
            return 200000000 + 20 * gradeValue;
        case 5:
            return 400000000 + 100 * gradeValue;
    }
    return 100000000;
}