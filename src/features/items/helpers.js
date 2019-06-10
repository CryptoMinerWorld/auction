import fromExponential from 'from-exponential';
import {BigNumber} from 'bignumber.js';
import {db, storage} from '../../app/utils/firebase';
import {completedTx, ErrorTx, startTx,} from '../transactions/txActions';
import store from '../../app/store';
import {parseTransactionHashFromError} from "../transactions/helpers";

export function isTokenForSale(_contract, _tokenId) {
    return _contract.methods.isTokenOnSale(_tokenId).call();
}

export const getAuctionDetails = (_contract, _tokenId) => _contract.methods
  .items(_tokenId)
  .call()
  .then((result) => {
      const {
          t0, t1, p0, p1,
      } = result;
      return [t0, t1, p0, p1];
  });

export const getGemStory = async (color, level, gemId) => {
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
    }[color];
    const lvl = `lvl${level}`;


    if (color && level) {

        let story;
        const docData = (await db
          .doc(`specialStones/${gemId}`)
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

export const getGemImage = async (color, grade, level, gemId) => {
    const type = {
        9: 'Sap',
        10: 'Opa',
        1: 'Gar',
        2: 'Ame',
    }[color];

    const gradeType = {
        1: 'D',
        2: 'C',
        3: 'B',
        4: 'A',
        5: 'AA',
        6: 'AAA',
    }[grade];

    // check if any special images are present for gem
    // if no - use type-level-grade formula
    //const sourceImage = `${type}-${level}-${gradeType}-4500.png`;

    if (color && grade && level) {
        let url;
        try {
            const doc = await db
              .doc(`specialStones/${gemId}`)
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

export const calcMiningRate = (gradeType, gradeValue) => ({
    1: gradeValue / 200000,
    2: 10 + gradeValue / 200000,
    3: 20 + gradeValue / 200000,
    4: 40 + (3 * gradeValue) / 200000,
    5: 100 + gradeValue / 40000,
    6: 300 + gradeValue / 10000,
}[gradeType]);


export const getGemQualities = (_contract, _tokenId) => {
//     console.trace();
    console.log("TOKEN_ID: ", _contract);
    return _contract.methods
      .getProperties(_tokenId)
      .call()
      .then((_properties) => {
          const properties = new BigNumber(_properties);
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
          return [color, level, gradeType, gradeValue];
      }).catch((err) =>
        console.log(55555555555, err));

}

export function getPrice(_tokenId, _contract, gemContract) {
    return _contract.methods.getCurrentPrice(gemContract, Number(_tokenId)).call();
}

export const nonExponential = count => fromExponential(Number(count) / 1000000000000000000);

export const calculateGemName = (providedGrade, providedTokenId) => {
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
    }[providedGrade];
    return `${gemType} #${providedTokenId}`;
};

export function removeAuctionHelper(dutchContract, tokenId, gemContract) {
    return dutchContract.methods.remove(gemContract, tokenId);
}

export const createAuctionHelper = async (
  _tokenId,
  _duration,
  _startPriceInWei,
  _endPriceInWei,
  _contract,
  _currentAccount,
) => {
    // construct auction parameters
    const token = Number(_tokenId);
    const tokenId = new BigNumber(token);
    const t0 = Math.round(new Date().getTime() / 1000) || 0;
    const t1 = t0 + _duration;
    const p0 = _startPriceInWei;
    const p1 = _endPriceInWei;
    const two = new BigNumber(2);

    console.log("Start auction:", _contract);
    // submit the auction
    await _contract.methods
      .addWith(process.env.REACT_APP_GEM_ERC721, _tokenId, t0, t1, p0, p1)
      .send()
      .on('transactionHash', hash => store.dispatch(
        startTx({
            hash,
            currentUser: _currentAccount,
            method: 'AUCTION_START',
            tokenId: token,
            description: 'Adding gem on auction'
        }),
      ))
      .on('receipt', receipt => store.dispatch(completedTx({
          receipt,
          hash: receipt.transactionHash,
          txMethod: 'AUCTION_START',
      })))
      .on('error', err => store.dispatch(ErrorTx({
          txMethod: 'AUCTION_START',
          error: err,
          hash: parseTransactionHashFromError(err.message)
      })));

    const auctionDetails = {
        deadline: t1,
        maxPrice: _startPriceInWei,
        minPrice: _endPriceInWei,
    };

    return auctionDetails;
};


const transform = (result, web3) => web3.eth.getBlock(result, (err, results) => {
    if (err) {
        return err;
    }
    return results;
});

// export const fetchLatestRestingEnergy = (blockNumber) => {
//     const {timestamp} = await transform(blockNumber, web3)
//     const linearThreshold = 37193;
//     const ageSeconds = ((Date.now() / 1000) | 0) - timestamp;
//     const ageMinutes = Math.floor(ageSeconds / 60);
//     const restedEnergyMinutes = Math.floor(
//       -7e-6 * Math.pow(Math.min(ageMinutes, linearThreshold), 2) +
//       0.5406 * Math.min(ageMinutes, linearThreshold)
//       + 0.0199 * Math.max(ageMinutes - linearThreshold, 0),
//     );
//     return restedEnergyMinutes;
// }

export const isEmptyObject = (obj) => Object.keys(obj).length === 0 && obj.constructor === Object;