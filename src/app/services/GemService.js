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
            const properties = new BigNumber (await (this.contract.methods
              .getProperties(tokenId)
              .call()));

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

            return { color, level, gradeType, gradeValue }
        }
        catch(err) {
              console.log('ERROR in getGemProperties', err)
        }
    }

    getGemOwner = async (tokenId) => {
        return (await this.contract.methods
          .ownerOf(tokenId)
          .call())
    }

    getGemCreationTime = async (tokenId) => {
        const blockNumber = await this.contract.methods
          .getCreationTime(tokenId)
          .call();

        const {timestamp} = await transform(blockNumber, this.web3);
        return timestamp;
    }

    getGem = async (tokenId) => {
        const [gemProperties, gemOwner, gemCreationTime] = await Promise.all(
          [
              this.getGemProperties(tokenId),
              this.getGemOwner(tokenId),
              this.getGemCreationTime(tokenId)
          ]);

        console.log(1111111111, gemProperties, gemOwner, gemCreationTime);

        return {
            ...gemProperties,
            id: tokenId,
            owner: gemOwner,
            story: await getGemStory(gemProperties, tokenId),
            image: await getGemImage(gemProperties, tokenId),
            name: calculateGemName(gemProperties.color, tokenId),
            rate: calculateMiningRate(gemProperties.gradeType, gemProperties.gradeValue),
            restingEnergyMinutes: calculateGemRestingEnergy(gemCreationTime)
        }
    }

    getGemAuctionIsLive = async (tokenId) => {
        return !(new BigNumber(
          await (this.auctionContract.methods
            .getTokenSaleStatus(this.contract._address, tokenId)
            .call()))).isZero();
    }

    getImagesForGems = async (gemsToLoadImages) => {
        await Promise.all(
          gemsToLoadImages.map(async gem => {
              gem.image = await getGemImage(
                {
                    color: gem.color,
                    level: gem.level,
                    gradeType: gem.gradeType,
                    gradeValue: gem.gradeValue
                }, gem.id);
              return gem;
          }));
    }

    getOwnerGems = async (ownerId) => {

        const idsOfGemsUserOwns = await this.contract.methods.getCollection(ownerId).call();

        return await Promise.all(
          idsOfGemsUserOwns.map(async gemId => {
              const gemProperties = await this.getGemProperties(gemId);
              return {
                  ...gemProperties,
                  id: gemId,
                  owner: ownerId,
                  auctionIsLive: await this.getGemAuctionIsLive(gemId),
                  //story: await getGemStory(gemProperties, gemId),
                  //image: await getGemImage(gemProperties, gemId),
                  name: calculateGemName(gemProperties.color, gemId),
                  rate: calculateMiningRate(gemProperties.gradeType, gemProperties.gradeValue),
                  //restingEnergyMinutes: calculateGemRestingEnergy(gemCreationTime)
              }
          })
        )
    }
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

    if (type && lvl) {

        let story;
        const docData = (await db
          .doc(`specialStones/${tokenId}`)
          .get()).data();

        try {
            story = (await db
              .doc(`gems/${docData.storyName}`)
              .get()).data()[lvl];
            if (!story) {
                throw "No special story for this gem!";
            }
        }
        catch (e) {
            story = (await db
              .doc(`gems/${type}`)
              .get()).data()[lvl];
        }
        console.log("STORY::", story);
        return story;
    }
};

export const getGemImage = async (gemProperties, tokenId) => {

    console.log('GET GEM STORY, gemProperties: ', gemProperties);

    const type = {
        9: 'Sap',
        10: 'Opa',
        1: 'Gar',
        2: 'Ame',
    }[gemProperties.color];

    const gradeType = {
        1: 'D',
        2: 'C',
        3: 'B',
        4: 'A',
        5: 'AA',
        6: 'AAA',
    }[gemProperties.gradeType];

    const level = gemProperties.level;
    // check if any special images are present for gem
    // if no - use type-level-grade formula
    //const sourceImage = `${type}-${level}-${gradeType}-4500.png`;

    console.log('GET GEM IMAGE: ', type, level);

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
            catch(e) {
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


export const calculateGemRestingEnergy = (creationTimestamp) => {

    const linearThreshold = 37193;
    const ageSeconds = ((Date.now() / 1000) | 0) - creationTimestamp;
    const ageMinutes = Math.floor(ageSeconds / 60);
    return Math.floor(
      -7e-6 * Math.pow(Math.min(ageMinutes, linearThreshold), 2) +
      0.5406 * Math.min(ageMinutes, linearThreshold)
      + 0.0199 * Math.max(ageMinutes - linearThreshold, 0),
    );
}


const transform = (result, web3) => web3.eth.getBlock(result, (err, results) => {
    if (err) {
        return err;
    }
    return results;
});
