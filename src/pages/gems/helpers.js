import fromExponential from 'from-exponential';
import {BigNumber} from 'bignumber.js';
import { db, storage } from '../../utils/firebase'


export const isTokenForSale = (_contract, _tokenId) =>
 
    _contract.methods.isTokenOnSale(_tokenId).call();


export const getAuctionDetails = (_contract, _tokenId) =>
    _contract.methods.items(_tokenId).call().then( result => {
      const {t0, t1, p0, p1} = result;
      return([t0, t1, p0, p1])
    })

export const getGemStory = (color, level) => {
      const type = {
          9: 'sapphire',
          10: 'opal',
          1: 'garnet',
          2: 'amethyst',
      }[color]
      const lvl = `lvl${level}`
      return db.doc(`gems/${type}`).get().then(doc => doc.data()[lvl])
  }


export const  getGemImage = (color, grade, level) => {

    const type = {
        9: 'Sap',
        10: 'Opa',
        1: 'Gar',
        2: 'Ame',
    }[color]

    const gradeType = {
        1: 'D',
        2: 'C',
        3: 'B',
        4: 'A',
        5: 'AA',
        6: 'AAA',
    }[grade]

    const sourceImage = `${type}-${level}-${gradeType}-4500.png`;

    return storage
        .ref(`gems512/${sourceImage}`)
        .getDownloadURL()
}


export const calcMiningRate = (gradeType, gradeValue) => ({
    1: gradeValue / 200000,
    2: 10 + gradeValue / 200000,
    3: 20 + gradeValue / 200000,
    4: 40 + (3 * gradeValue) / 200000,
    5: 100 + gradeValue / 40000,
    6: 300 + gradeValue / 10000
  }[gradeType]);


export const getGemQualities = (_contract, _tokenId) => 
_contract.methods
.getProperties(_tokenId)
.call()
.then( _properties => {

    // web3.utils.toBN(number)
const properties = new BigNumber(_properties)
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
        return([color, level, gradeType, gradeValue]);
      })
  
      
 export const getPrice =  (_tokenId, _contract) =>  _contract.methods.getCurrentPrice(
        _tokenId).call()
        
export const nonExponential = (count) =>     fromExponential(Number(count) / 1000000000000000000)

export const calculateGemName = (providedGrade, providedTokenId) => {
    const gemType = {
      9: "Sapphire",
      10: "Opal",
      1: "Garnet",
      2: "Amethyst"
    }[providedGrade];
    return `${gemType} #${providedTokenId}`;
  };








// converts BigNumber representing Solidity uint256 into String representing Solidity bytes
const toBytes = uint256 => {
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




  // @notice creates an auction
export const createAuctionHelper = async (
    _tokenId,
    _duration,
    _startPriceInWei,
    _endPriceInWei,
    _contract,
    _currentAccount
  ) => {
    // construct auction parameters
    const token = Number(_tokenId);
    const tokenId = new BigNumber(token);
    const t0 = Math.round(new Date().getTime() / 1000) || 0;
    const t1 = t0 + _duration;
    const p0 = _startPriceInWei;
    const p1 = _endPriceInWei;
    const two = new BigNumber(2);
  
    // convert auction parameters to bytecode for smart contract
    const data = toBytes(
      two
        .pow(224)
        .times(tokenId)
        .plus(two.pow(192).times(t0))
        .plus(two.pow(160).times(t1))
        .plus(two.pow(80).times(p0))
        .plus(p1)
    );
  
    // submit the auction
    const auctionSuccessfullyCreated = _contract.methods
      .safeTransferFrom(
        _currentAccount,
        process.env.REACT_APP_DUTCH_AUCTION,
        token,
        data
      )
      .send()
      .on("receipt", () => true)
      .catch(() => false);
  
    // get gem details
    const gemProperties = getGemQualities(_contract, _tokenId);
  
    // only proceed if auction was successfully created and you have gem details
    Promise.all([auctionSuccessfullyCreated, gemProperties])
      .then(result => {
        // destructure and format gem properties from result
        const [color, level, gradeType, gradeValue] = result[1];
        const grade = gradeType;
        const gemLevel = Number(level);
        const rate = Number(calcMiningRate(gradeType, gradeValue));
  
        // get the gem image and story since they are not stored on blockchain
        const image = getGemImage(color, gradeType, gemLevel);
        const story = getGemStory(color, gemLevel);
  
        // only proceed once you have gem image and story
        Promise.all([image, story])
          .then(([_image, _story]) => {
            const finalAuction = {
              id: _tokenId,
              minPrice: _startPriceInWei,
              maxPrice: _endPriceInWei,
              owner: _currentAccount,
              deadline: t1,
              gemImage: _image,
              story: _story,
              grade,
              gemLevel,
              color,
              rate
            };
  
            return finalAuction
          })
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  };
