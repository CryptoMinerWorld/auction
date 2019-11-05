const functions = require('firebase-functions');
const express = require('express');
const BigNumber = require('bignumber.js')

const db = require('firebase-admin');

const Web3 = require('web3');
const INFURA_URL = 'https://mainnet.infura.io/v3/000e2a10115948bca0ba880169f968f0'

import {COUNTRY_LIST} from "./country_list";
const gemABI = (require('./ABI/GemERC721.json')).abi;
// const GEM_ERC721_CONTRACT = '0x0F3c237D0Bd742B5Af3a5606525daA3fE3b19a0d'; //ropsten

const GEM_ERC721_CONTRACT = '0x34Fa7ddde9D0E1B98CD281EE1E8BA1DB37C64399'; //mainnet

db.initializeApp({...functions.config().firebase, 
  credential: db.credential.applicationDefault(),
});

const api = express();
const web3 = new Web3(INFURA_URL);
const gemContract = new web3.eth.Contract(gemABI, GEM_ERC721_CONTRACT)

const getGem = async (tokenId) => {
  try {
      const gem = await getPackedGem(tokenId);

      console.log("Gem:", JSON.stringify(gem));
      const baseRate = calculateMiningRate(gem.gradeType, gem.gradeValue);
      const monthBonusMultiplier = gemMonthRateMultiplier(gem.color);
      const countryBonusMultiplier = gemCountryRateMultiplier(gem.id);
      //const rateMultiplier = gemRateMultiplier({id: tokenId, color: gem.color});
      const rate = baseRate * countryBonusMultiplier * monthBonusMultiplier;

      const attributes = [
        {
          "trait_type": "level",
          "value" : gem.level
        },
        {
          "trait_type": "grade",
          "value": calculateGradeType(gem.gradeType)
        },
        {
          "trait_type": "rate",
          "value": rate.toFixed(1) + "%"
        },
        {
          "trait_type": "resting energy",
          "value": gem.gradeType >= 4 ? formatRestingEnergy(calculateGemRestingEnergy(gem.age, gem.modifiedTime)) : 0
        }
      ]

      if (monthBonusMultiplier > 1) attributes.push({
        "display_type": "boost_percentage",
        "trait_type": "monthly bonus",
        "value": 5
      });

      if (countryBonusMultiplier > 1) attributes.push({
        "display_type": "boost_percentage",
        "trait_type": `when used on ${COUNTRY_LIST[Number(tokenId) - 0xF100 - 1]}`,
        "value": 50
      });

      const finalGem = {
          description: await getGemStory(gem, tokenId),
          image: await getGemImage(gem, tokenId),
          name: calculateGemName(gem.color, tokenId),
          "external_url": "https://game.cryptominerworld.com/gem/" + tokenId,
          attributes
        };
      return finalGem;
  }
  catch (e) {
      console.error('GET GEM ERROR:', e);
  }
};

const getPackedGem = async (tokenId) => {
  try {
      const packed256_256 = await (gemContract.methods
        .getPacked(tokenId)
        .call());
      return await unpackGem([new BigNumber(packed256_256[0]), new BigNumber(packed256_256[1])]);
  }
  catch (err) {
      console.log('ERROR in getPacked', err)
  }
};

const unpackGem = async ([high256, low256]) => {

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

  // console.log("OWNER:", low256.modulo(new BigNumber(2).pow(160)).toString(16));
  // const owner = '0x' + low256.modulo(new BigNumber(2).pow(160)).toString(16).padStart(40, "0");
  const creationTime = low256.dividedToIntegerBy(new BigNumber(2).pow(224)).modulo(0x100000000).toNumber();
  // const ownedTime = low256.dividedToIntegerBy(new BigNumber(2).pow(160)).modulo(new BigNumber(2).pow(32)).toNumber();

  return {
      color,
      level,
      gradeType,
      gradeValue,
      state,
      age,
      blocksMined: 0,
      plotsMined :0,
      creationTime,
      stateModifiedTime,
      modifiedTime: Math.max(creationTime, stateModifiedTime)
  }
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
          console.log("DOC DATA0");
          const docData = (await db.firestore()
            .doc(`specialStones/${tokenId}`)
            .get()).data();
            console.log("DOC DATA1", docData);
          if (!docData) {
              try {
                  const storyDoc = (await db.firestore()
                    .doc(`gems/${type}`)
                    .get());
                    console.log("DOC DATA2", docData);
                  if (storyDoc) {
                      story = storyDoc.data()[lvl] || ""
                  }
              }
              catch (err) {
                  throw "No default story for this type of gem!";
              }
          }
          else {
            console.log("DOC DATA3", docData);
              story = (await db.firestore()
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
      console.log("Empty story returned", e);
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

  const storageBucket = db.storage().bucket( 'gs://cryptominerworld-7afd6.appspot.com' )

  if (type && gradeType && level) {
      let url;
      try {
          const doc = await db.firestore()
            .doc(`specialStones/${tokenId}`)
            .get();

          try {
              url = (await storageBucket.file(`gems512/${doc.data().imageName}-${level}-${gradeType}.png`).getSignedUrl({
                action: "read",
                expires: '03-17-2025' // this is an arbitrary date
              }))[0]
          }
          catch (e) {
              url = (await storageBucket.file(`gems512/${doc.data().imageName}.png`).getSignedUrl({
                action: "read",
                expires: '03-17-2025' // this is an arbitrary date
              }))[0]
          }
      }
      catch (err) {
          try {
              url = (await storageBucket.file(`gems512/${type}-${level}-${gradeType}-4500.png`).getSignedUrl({
                action: "read",
                expires: '03-17-2025' // this is an arbitrary date
              })) [0]
          }
          catch (e) {
              console.error("Error while retrieving image from the storage", e)
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

const calculateGradeType = (gradeType) => ({
  1: 'D',
  2: 'C',
  3: 'B',
  4: 'A',
  5: 'AA',
  6: 'AAA',
}[gradeType]);


const calculateGemName = (color, tokenId) => {
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

// const gemRateMultiplier = (gem) => {
//   let multiplier = 1;
//   if (gem.color && (new Date()).getMonth() === (gem.color - 1)) multiplier *= 1.05;
//   if (gem.id && (Number(gem.id) > 61696) && (Number(gem.id) < 61952)) multiplier *= 1.5;
//   return multiplier;
// };

const gemCountryRateMultiplier = (id) => {
  let multiplier = 1;
  if (id && (Number(id) > 61696) && (Number(id) < 61952)) multiplier *= 1.5;
  return multiplier;
}

const gemMonthRateMultiplier = (color) => {
  let multiplier = 1;
  if (color && (new Date()).getMonth() === (color - 1)) multiplier *= 1.05;
  return multiplier;
}

const calculateGemRestingEnergy = (age, modifiedTime) => {
  const linearThreshold = 37193;
  const ageMinutes = ((Date.now() / 1000) - modifiedTime) / 60 + age;
  return Math.floor(
    -7e-6 * Math.pow(Math.min(ageMinutes, linearThreshold), 2) +
    0.5406 * Math.min(ageMinutes, linearThreshold)
    + 0.0199 * Math.max(ageMinutes - linearThreshold, 0),
  );
};

const formatRestingEnergy = (energy) => {
  return calculateEnergyInDays(energy) + " days, " + calculateEnergyInHours(energy) + " hours, " + calculateEnergyInMinutes(energy) + " minutes"
};

const calculateEnergyInDays = t => Math.floor(t / (60 * 24));
const calculateEnergyInHours = t => Math.floor((t % (60 * 24))/ 60);
const calculateEnergyInMinutes = t => Math.floor(t % 60);

api.get('/api/gem/:id', async (request, response) => {
  try {
    const gem = await getGem(request.params.id);
    if (!gem) {
      response.statusCode = 404;
      response.send({error: "Token not found"})
    }
    else {
      response.send(gem);
    }
  }
  catch(e) {
    response.statusCode = 500;
    response.send({error: 'Server error'})
  }
})

exports.api = functions.https.onRequest(api)
