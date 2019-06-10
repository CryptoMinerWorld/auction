import {BigNumber} from 'bignumber.js';
import {db, storage} from '../../app/utils/firebase';

export default class GemService {

    constructor(gemContractInstance, web3Instance, auctionContractInstance) {
        console.log('Gem Service constructor called', gemContractInstance);
        this.contract = gemContractInstance;
        this.web3 = web3Instance;
        this.auctionContract = auctionContractInstance;
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
    }

    getGem = async (tokenId) => {
        try {
            const gem = await this.getPackedGem(tokenId);
            console.log('GEM UNPACKED: ', gem);

            const finalGem = {
                ...gem,
                id: tokenId,
                //owner: gemOwner,
                story: await getGemStory(gem, tokenId),
                image: await getGemImage(gem, tokenId),
                name: calculateGemName(gem.color, tokenId),
                rate: calculateMiningRate(gem.gradeType, gem.gradeValue),
                restingEnergy: gem.gradeType >= 4 ? calculateGemRestingEnergy(gem.age, gem.modifiedTime) : 0
            }
            console.log('FINAL GEM:', finalGem);
            return finalGem;
        }
        catch (e) {
            console.error('GET GEM ERROR:', e);
        }
    }

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
    }

    unpackGem = async ([high256, low256]) => {
        const plotId = high256.dividedToIntegerBy(new BigNumber(2).pow(232)).modulo(new BigNumber(2).pow(24)).toNumber();
        const color = high256.dividedToIntegerBy(new BigNumber(2).pow(224)).modulo(0x100).toNumber();
        const level = high256
          .dividedToIntegerBy(new BigNumber(2).pow(216))
          .modulo(0x100)
          .toNumber();
        const gradeType = high256
          .dividedToIntegerBy(new BigNumber(2).pow(184 + 24))
          .modulo(0x100)
          .toNumber();
        const gradeValue = high256
          .dividedToIntegerBy(new BigNumber(2).pow(184))
          .modulo(0x1000000).toNumber();
        const plotsMined = high256
          .dividedToIntegerBy(new BigNumber(2).pow(128))
          .modulo(new BigNumber(2).pow(24)).toNumber();
        const blocksMined = high256
          .dividedToIntegerBy(new BigNumber(2).pow(96))
          .modulo(new BigNumber(2).pow(32)).toNumber();
        const age = high256
          .dividedToIntegerBy(new BigNumber(2).pow(64))
          .modulo(new BigNumber(2).pow(32)).toNumber();
        const state = high256
          .dividedToIntegerBy(new BigNumber(2).pow(32))
          .modulo(new BigNumber(2).pow(32)).toNumber();
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
            blocksMined,
            plotsMined,
            plotId,
            modifiedTime: Math.max(creationTime, stateModifiedTime)
        }
    }

    getGemAuctionIsLive = async (tokenId) => {
        return !(new BigNumber(
          await (this.auctionContract.methods
            .getTokenSaleStatus(this.contract.options.address, tokenId)
            .call()))).isZero();
    }

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
    }

    getOwnerGems = async (ownerId) => {
        const notAuctionGemsUserOwns = await this.contract.methods.getPackedCollection(ownerId).call();
        return notAuctionGemsUserOwns.map(notAuctionGem => {
            const packed200uint = new BigNumber(notAuctionGem);
            const gemId = packed200uint.dividedToIntegerBy(new BigNumber(2).pow(176)).toNumber();
            const gemPackedProperties = packed200uint.dividedToIntegerBy(new BigNumber(2).pow(128)).modulo(new BigNumber(2).pow(48));
            const gemPlotsMined = packed200uint.dividedToIntegerBy(new BigNumber(2).pow(104)).modulo(new BigNumber(2).pow(24));
            const gemBlocksMined = packed200uint.dividedToIntegerBy(new BigNumber(2).pow(72)).modulo(new BigNumber(2).pow(32));
            const gemAge = packed200uint.dividedToIntegerBy(new BigNumber(2).pow(40)).modulo(new BigNumber(2).pow(32)).toNumber();
            const gemModifiedTime = packed200uint.dividedToIntegerBy(0x100).modulo(new BigNumber(2).pow(32)).toNumber();
            const gemState = packed200uint.modulo(new BigNumber(2).pow(8)).toNumber();
            const gemProperties = unpackGemProperties(gemPackedProperties);
            return {
                ...gemProperties,
                id: gemId,
                age: gemAge,
                restingEnergy: gemProperties.gradeType >= 4 ? calculateGemRestingEnergy(gemAge, gemModifiedTime) : 0,
                state: gemState,
                blocksMined: gemBlocksMined,
                plotsMined: gemPlotsMined,
                owner: ownerId,
                auctionIsLive: false, //await this.getGemAuctionIsLive(gemId),
                name: calculateGemName(gemProperties.color, gemId),
                rate: calculateMiningRate(gemProperties.gradeType, gemProperties.gradeValue),
                //restingEnergyMinutes: calculateGemRestingEnergy(gemCreationTime)
            }
        })
    }
}


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
}

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
                      .get())
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
    1: gradeValue / 200000,
    2: 10 + gradeValue / 200000,
    3: 20 + gradeValue / 200000,
    4: 40 + (3 * gradeValue) / 200000,
    5: 100 + gradeValue / 40000,
    6: 300 + gradeValue / 10000,
}[gradeType].toFixed(1));

export const calculateGradeType = (gradeType) => ({
    1: 'D',
    2: 'C',
    3: 'B',
    4: 'A',
    5: 'AA',
    6: 'AAA',
}[gradeType]);


export const calculateGemName = (color, tokenId) => {
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
    const ageMinutes = ((Date.now() / 1000) - modifiedTime)/60 + age;
    return Math.floor(
      -7e-6 * Math.pow(Math.min(ageMinutes, linearThreshold), 2) +
      0.5406 * Math.min(ageMinutes, linearThreshold)
      + 0.0199 * Math.max(ageMinutes - linearThreshold, 0),
    );
}
