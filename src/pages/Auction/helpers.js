export const isTokenOnSale = (_contract, _tokenId) =>
  new Promise((resolve, reject) => {
    _contract.isTokenOnSale(_tokenId, (error, result) => {
      if (!error) resolve(result);
      else reject(error);
    });
  });

export const getAuctionDetails = (_contract, _tokenId) =>
  new Promise((resolve, reject) => {
    _contract.items(_tokenId, (error, result) => {
      if (!error) {
        resolve(result);
      } else reject(error);
    });
  });

export const calcMiningRate = (gradeType, gradeValue) => {
  switch (gradeType) {
    case 1:
      return gradeValue / 200000;
    case 2:
      return 10 + gradeValue / 200000;
    case 3:
      return 20 + gradeValue / 200000;
    case 4:
      return 40 + (3 * gradeValue) / 200000;
    case 5:
      return 100 + gradeValue / 40000;
    case 6:
      return 300 + gradeValue / 10000;
    default:
      return 300 + gradeValue / 10000;
  }
};

export const getGemQualities = (_contract, _tokenId) =>
  new Promise((resolve, reject) => {
    _contract.getProperties(_tokenId, (error, properties) => {
      if (!error) {
        let color = properties.dividedToIntegerBy(0x10000000000).toNumber();
        let level = properties
          .dividedToIntegerBy(0x100000000)
          .modulo(0x100)
          .toNumber();
        let gradeType = properties
          .dividedToIntegerBy(0x1000000)
          .modulo(0x100)
          .toNumber();
        let gradeValue = properties.modulo(0x1000000).toNumber();
        resolve([color, level, gradeType, gradeValue]);
      } else reject(error);
    });
  });
