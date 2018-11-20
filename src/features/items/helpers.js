import fromExponential from 'from-exponential';
import { BigNumber } from 'bignumber.js';
import { db, storage } from '../../app/utils/firebase';
import {
  startTx,
  completedTx,
  ErrorTx,
  // confirmationCountTx,
} from '../transactions/txActions';
import store from '../../app/store';
// eslint-disable-next-line
// import { setError } from '../../app/appActions';

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

export const getGemStory = (color, level) => {
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
  return db
    .doc(`gems/${type}`)
    .get()
    .then(doc => doc.data()[lvl]);
};

export const getGemImage = (color, grade, level) => {
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

  const sourceImage = `${type}-${level}-${gradeType}-4500.png`;

  return storage.ref(`gems512/${sourceImage}`).getDownloadURL();
};

export const calcMiningRate = (gradeType, gradeValue) => ({
  1: gradeValue / 200000,
  2: 10 + gradeValue / 200000,
  3: 20 + gradeValue / 200000,
  4: 40 + (3 * gradeValue) / 200000,
  5: 100 + gradeValue / 40000,
  6: 300 + gradeValue / 10000,
}[gradeType]);

export const getGemQualities = (_contract, _tokenId) => _contract.methods
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
  });

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

  // converts BigNumber representing Solidity uint256 into String representing Solidity bytes
  const toBytes = (uint256) => {
    let s = uint256.toString(16);
    const len = s.length;
    // 256 bits must occupy exactly 64 hex digits
    if (len > 64) {
      s = s.substr(0, 64);
    }
    for (let i = 0; i < 64 - len; i += 1) {
      s = `0${s}`;
    }
    return `0x${s}`;
  };

  // convert auction parameters to bytecode for smart contract
  const data = toBytes(
    two
      .pow(224)
      .times(tokenId)
      .plus(two.pow(192).times(t0))
      .plus(two.pow(160).times(t1))
      .plus(two.pow(80).times(p0))
      .plus(p1),
  );

  // submit the auction
  await _contract.methods
    .safeTransferFrom(_currentAccount, process.env.REACT_APP_DUTCH_AUCTION, token, data)
    .send()
    .on('transactionHash', hash => store.dispatch(startTx(hash)))
    .on('receipt', receipt => store.dispatch(completedTx(receipt)))
    .on('error', error => store.dispatch(ErrorTx(error)));

  const auctionDetails = {
    deadline: t1,
    maxPrice: _startPriceInWei,
    minPrice: _endPriceInWei,
  };

  return auctionDetails;
};
