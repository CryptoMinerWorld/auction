import {BigNumber} from 'bignumber.js';
import {db, storage} from '../../app/utils/firebase';
import {GETTING_READY, GOING_HOME, IDLE, IN_AUCTION, MINING} from "../../features/items/itemConstants";
import {BINDING_GEM, MINED, STUCK, UNBINDING_GEM} from "../../features/plots/plotConstants";
import {COUNTRY_LIST} from "../../features/market/country_list";

export default class GemService {

    constructor(gemContract, web3Instance, auctionContract, gemBurnerContract) {
        this.contract = gemContract;
        this.web3 = web3Instance;
        this.auctionContract = auctionContract;
        this.gemBurnerContract = gemBurnerContract;
    }

    getGemProperties = async (tokenId) => {
        try {
            const properties = new BigNumber(await (this.contract.methods
              .getProperties(tokenId)
              .call()));

            return unpackGemProperties(properties);
        }
        catch (err) {
            console.log('ERROR in getGemProperties', err)
        }
    };

    getGem = async (tokenId) => {
        try {
            const gem = await this.getPackedGem(tokenId);
            console.log('GEM UNPACKED: ', gem);

            const baseRate = calculateMiningRate(gem.gradeType, gem.gradeValue);
            const rate = baseRate * gemRateMultiplier({id: tokenId, color: gem.color});

            const finalGem = {
                ...gem,
                id: tokenId,
                //owner: gemOwner,
                story: await getGemStory(gem, tokenId),
                image: await getGemImage(gem, tokenId),
                name: calculateGemName(gem.color, tokenId),
                rate: Math.floor(rate),
                baseRate: Math.floor(baseRate),
                restingEnergy: gem.gradeType >= 4 ? calculateGemRestingEnergy(gem.age, gem.modifiedTime) : 0
            };

            console.log('FINAL GEM:', finalGem);
            return finalGem;
        }
        catch (e) {
            console.error('GET GEM ERROR:', e);
        }
    };

    getPackedGem = async (tokenId) => {
        try {
            const packed256_256 = await (this.contract.methods
              .getPacked(tokenId)
              .call());
            console.log('PACKED GEM!!!!!!!!!!!!!!', packed256_256);
            return await this.unpackGem([new BigNumber(packed256_256[0]), new BigNumber(packed256_256[1])]);
        }
        catch (err) {
            console.log('ERROR in getPacked', err)
        }
    };

    unpackGem = async ([high256, low256]) => {

        console.warn("High, low::", high256, low256);

        //const plotId = high256.dividedToIntegerBy(new BigNumber(2).pow(232)).modulo(new
        // BigNumber(2).pow(24)).toNumber();
        const color = high256.dividedToIntegerBy(new BigNumber(2).pow(248)).modulo(0x100).toNumber();
        const level = high256
          .dividedToIntegerBy(new BigNumber(2).pow(240))
          .modulo(0x100)
          .toNumber();
        const gradeType = high256
          .dividedToIntegerBy(new BigNumber(2).pow(208 + 24))
          .modulo(0x100)
          .toNumber();
        const gradeValue = high256
          .dividedToIntegerBy(new BigNumber(2).pow(208))
          .modulo(0x1000000).toNumber();
        const plotsMined = high256
          .dividedToIntegerBy(new BigNumber(2).pow(120))
          .modulo(new BigNumber(2).pow(24)).toNumber();
        const blocksMined = high256
          .dividedToIntegerBy(new BigNumber(2).pow(88))
          .modulo(new BigNumber(2).pow(32)).toNumber();
        const age = high256
          .dividedToIntegerBy(new BigNumber(2).pow(56))
          .modulo(new BigNumber(2).pow(32)).toNumber();
        const state = high256
          .dividedToIntegerBy(new BigNumber(2).pow(32))
          .modulo(new BigNumber(2).pow(24)).toNumber();
        const stateModifiedTime = high256.modulo(new BigNumber(2).pow(32)).toNumber();

        const owner = '0x' + low256.modulo(new BigNumber(2).pow(160)).toString(16).padStart(40, "0");
        const creationTime = low256.dividedToIntegerBy(new BigNumber(2).pow(224)).modulo(0x100000000).toNumber();
        const ownedTime = low256.dividedToIntegerBy(new BigNumber(2).pow(160)).modulo(new BigNumber(2).pow(32)).toNumber();

        return {
            color,
            level,
            gradeType,
            gradeValue,
            owner,
            ownedTime,
            state,
            age,
            blocksMined: 0,
            plotsMined :0,
            creationTime,
            stateModifiedTime,
            modifiedTime: Math.max(creationTime, stateModifiedTime)
        }
    };

    getGemAuctionIsLive = async (tokenId) => {
        return !(new BigNumber(
          await (this.auctionContract.methods
            .getTokenSaleStatus(this.contract.options.address, tokenId)
            .call()))).isZero();
    };

    getImagesForGems = async (gemsToLoadImages) => {
        console.log('GEMS TO LOAD IMAGES: ', gemsToLoadImages);
        return await Promise.all(
          gemsToLoadImages.map(async gem => {
              if (!gem.image) {
                  gem.image = await getGemImage(
                    {
                        color: gem.color,
                        level: gem.level,
                        gradeType: gem.gradeType,
                        gradeValue: gem.gradeValue
                    }, gem.id);
              }
              //return gem;
          }));
    };

    getOwnerGems = async (ownerId) => {
        const notAuctionGemsUserOwns = await this.contract.methods.getPackedCollection(ownerId).call();
        return notAuctionGemsUserOwns.map(notAuctionGem => {
            const packed256uint = new BigNumber(notAuctionGem);

            const gemModifiedTime = packed256uint.dividedToIntegerBy(new BigNumber(2).pow(224)).modulo(new BigNumber(2).pow(32)).toNumber();
            const ownershipModifiedTime = packed256uint.dividedToIntegerBy(new BigNumber(2).pow(192)).modulo(new BigNumber(2).pow(32)).toNumber();
            const gemAge = packed256uint.dividedToIntegerBy(new BigNumber(2).pow(64)).modulo(new BigNumber(2).pow(32)).toNumber();
            const gradeType = packed256uint.dividedToIntegerBy(new BigNumber(2).pow(184)).modulo(new BigNumber(2).pow(8)).toNumber();
            const gradeValue = packed256uint.dividedToIntegerBy(new BigNumber(2).pow(160)).modulo(new BigNumber(2).pow(24)).toNumber();
            const level = packed256uint.dividedToIntegerBy(new BigNumber(2).pow(152)).modulo(new BigNumber(2).pow(8)).toNumber();
            const color = packed256uint.dividedToIntegerBy(new BigNumber(2).pow(24)).modulo(new BigNumber(2).pow(8)).toNumber();
            const id = packed256uint.modulo(new BigNumber(2).pow(24)).toNumber();
            const baseRate = calculateMiningRate(gradeType, gradeValue);
            const rate = baseRate * gemRateMultiplier({id, color});
            return {
                gradeType,
                gradeValue,
                level,
                color,
                id,
                age: gemAge,
                restingEnergy: gradeType >= 4 ? calculateGemRestingEnergy(gemAge, gemModifiedTime) : 0,
                state: packed256uint.dividedToIntegerBy(new BigNumber(2).pow(32)).modulo(new BigNumber(2).pow(32)).toNumber(),
                blocksMined: packed256uint.dividedToIntegerBy(new BigNumber(2).pow(96)).modulo(new BigNumber(2).pow(32)).toNumber(),
                plotsMined: packed256uint.dividedToIntegerBy(new BigNumber(2).pow(128)).modulo(new BigNumber(2).pow(24)).toNumber(),
                owner: ownerId,
                ownershipModified: ownershipModifiedTime,
                auctionIsLive: false,
                name: calculateGemName(color, id),
                rate: Math.floor(rate),
                baseRate: Math.floor(baseRate),
            }
        })
    }

    burnGems = (gemIds, tradeAsset) => {
        
        if (tradeAsset === "gold") {
            return this.gemBurnerContract.methods.tradeForGold(gemIds).send(); 
        } else if (tradeAsset === "silver") {
            return this.gemBurnerContract.methods.tradeForSilver(gemIds).send();
        }
    }

}

const gemRateMultiplier = (gem) => {
    let multiplier = 1;
    if (gem.color && (new Date()).getMonth() === (gem.color - 1)) multiplier *= 1.05;
    if (gem.id && (Number(gem.id) > 61696) && (Number(gem.id) < 61952)) multiplier *= 1.5;
    return multiplier;
};

export const gemRateDivider = (gemId, plot) => {
    return (Number(gemId) > 61696) && (Number(gemId) - 61696 === Number(plot.countryId)) ? 3/2 : 1;
};

export const resolveGemStateName = (gem) => {
    if (gem.auctionIsLive) return IN_AUCTION;
    if (gem.txType) {
        if (gem.txType === BINDING_GEM) return GETTING_READY;
        if (gem.txType === UNBINDING_GEM) return GOING_HOME;
    }
    if (gem.plotMined && Number(gem.state) !== 0) {
        const blocksLeft = gem.plotMined.layerEndPercentages[gem.level - 1] - gem.plotMined.currentPercentage;
        if (blocksLeft === 0) {
            return gem.plotMined.currentPercentage < 100 ? STUCK : MINED;
        } else {
            return MINING;
        }
    }
    return IDLE;
};

export const unpackGemProperties = (properties) => {
    const color = properties.dividedToIntegerBy(0x10000000000).toNumber();
    const level = properties
      .dividedToIntegerBy(0x100000000)
      .modulo(0x100)
      .toNumber();
    const gradeType = properties
      .dividedToIntegerBy(0x1000000)
      .modulo(0x100)
      .toNumber();
    const gradeValue = properties.modulo(0x1000000).toNumber();

    return {color, level, gradeType, gradeValue}
};

export const getGemStory = async (gemProperties, tokenId) => {

    console.log('GET GEM STORY, gemProperties: ', gemProperties.color);

    const type = {
        1: 'garnet',
        2: 'amethyst',

        3: 'aquamarine',
        4: 'diamond',
        5: 'emerald',
        6: 'pearl',

        7: 'ruby',
        8: 'peridot',

        9: 'sapphire',
        10: 'opal',

        11: 'topaz',
        12: 'turquoise',
    }[gemProperties.color];
    const lvl = `lvl${gemProperties.level}`;

    console.log('GET GEM STORY: ', type, lvl);

    try {
        if (type && lvl) {
            let story = "";
            const docData = (await db
              .doc(`specialStones/${tokenId}`)
              .get()).data();

            if (!docData) {
                try {
                    const storyDoc = (await db
                      .doc(`gems/${type}`)
                      .get());
                    if (storyDoc) {
                        story = storyDoc.data()[lvl] || ""
                    }
                }
                catch (err) {
                    throw "No default story for this type of gem!";
                }
            }
            else {
                story = (await db
                  .doc(`gems/${docData.storyName}`)
                  .get()).data()[lvl];
                if (!story) {
                    throw "No special story for this gem!";
                }
            }
            console.log("STORY::", story);
            return story;
        }
    }
    catch (e) {
        console.log("Empty story returned");
        return "Nothing is known about this gem";
    }
};

export const getGemImage = async (gemProperties, tokenId) => {

    const type = {
        1: 'Gar',
        2: 'Ame',
        3: 'Aqu',
        4: 'Dia',
        5: 'Eme',
        6: 'Pea',
        7: 'Rub',
        8: 'Per',
        9: 'Sap',
        10: 'Opa',
        11: 'Top',
        12: 'Tur',
    }[gemProperties.color];

    const level = gemProperties.level;
    const gradeType = calculateGradeType(gemProperties.gradeType);
    // check if any special images are present for gem
    // if no - use type-level-grade formula
    //const sourceImage = `${type}-${level}-${gradeType}-4500.png`;

    //console.log('GET GEM IMAGE: ', type, level);

    if (type && gradeType && level) {
        let url;
        try {
            const doc = await db
              .doc(`specialStones/${tokenId}`)
              .get();

            try {
                url = await (storage.ref(`gems512/${doc.data().imageName}-${level}-${gradeType}.png`).getDownloadURL());
            }
            catch (e) {
                url = await (storage.ref(`gems512/${doc.data().imageName}.png`).getDownloadURL());
            }
        }
        catch (err) {
            try {
                url = await (storage.ref(`gems512/${type}-${level}-${gradeType}-4500.png`).getDownloadURL())
            }
            catch (e) {
                url = await (storage.ref(`gems512/specialOneImage.png`).getDownloadURL())
            }
        }
        return url;
    }
};

export const calculateMiningRate = (gradeType, gradeValue) => ({
    1: 100 + gradeValue / 40000,
    2: 200 + gradeValue / 20000,
    3: 330 + 9 * gradeValue / 100000,
    4: 720 + (9 * gradeValue) / 50000,
    5: 2500 + 6 * gradeValue / 10000,
    6: 5000 + 13 * gradeValue / 10000,
    //
    // 1: gradeValue / 200000,
    // 2: 10 + gradeValue / 200000,
    // 3: 20 + gradeValue / 200000,
    // 4: 40 + (3 * gradeValue) / 200000,
    // 5: 100 + gradeValue / 40000,
    // 6: 300 + gradeValue / 10000,
}[gradeType] - 100);

export const calculateGradeType = (gradeType) => ({
    1: 'D',
    2: 'C',
    3: 'B',
    4: 'A',
    5: 'AA',
    6: 'AAA',
}[gradeType]);


export const calculateGemName = (color, tokenId) => {
    const id = Number(tokenId);
    if (id > 0xF100 && id < 0xF200) {
        const name = `SCG #${id - 0xF100} ${COUNTRY_LIST[id - 0xF100 - 1]}`;
        return name.length > 19 ? name.substring(0, 16) + "..." : name;
    }

    const gemType = {
        1: 'Garnet',
        2: 'Amethyst',

        3: 'Aquamarine',
        4: 'Diamond',
        5: 'Emerald',
        6: 'Pearl',

        7: 'Ruby',
        8: 'Peridot',

        9: 'Sapphire',
        10: 'Opal',

        11: 'Topaz',
        12: 'Turquoise',
    }[color];
    return `${gemType} #${tokenId}`;
};


export const calculateGemRestingEnergy = (age, modifiedTime) => {
    const linearThreshold = 37193;
    const ageMinutes = ((Date.now() / 1000) - modifiedTime) / 60 + age;
    return Math.floor(
      -7e-6 * Math.pow(Math.min(ageMinutes, linearThreshold), 2) +
      0.5406 * Math.min(ageMinutes, linearThreshold)
      + 0.0199 * Math.max(ageMinutes - linearThreshold, 0),
    );
};

export const formatRestingEnergy = (energy) => {
    return calculateEnergyInDays(energy) + "-" + calculateEnergyInHours(energy) + "-" + calculateEnergyInMinutes(energy)
};

const calculateEnergyInDays = t => Math.floor(t / (60 * 24));
const calculateEnergyInHours = t => Math.floor((t % (60 * 24))/ 60);
const calculateEnergyInMinutes = t => Math.floor(t % 60);