import {BigNumber} from 'bignumber.js';

export const isTokenForSale = (_contract, _tokenId) =>
 
    _contract.methods.isTokenOnSale(_tokenId).call();


export const getAuctionDetails = (_contract, _tokenId) =>
    _contract.methods.items(_tokenId).call().then( result => {
      const {t0, t1, p0, p1} = result;
      return([t0, t1, p0, p1])
    })

// export const calcMiningRate = (gradeType, gradeValue) => {
//   switch (gradeType) {
//     case 1:
//       return gradeValue / 200000;
//     case 2:
//       return 10 + gradeValue / 200000;
//     case 3:
//       return 20 + gradeValue / 200000;
//     case 4:
//       return 40 + (3 * gradeValue) / 200000;
//     case 5:
//       return 100 + gradeValue / 40000;
//     case 6:
//       return 300 + gradeValue / 10000;
//     default:
//       return 300 + gradeValue / 10000;
//   }
// };

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
  
      