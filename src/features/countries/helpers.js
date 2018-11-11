// import { db } from '../../app/utils/firebase';
import { BigNumber } from 'bignumber.js';
import { ethToWei, daysToSeconds } from '../mint/helpers';

export const handleGiftFormSubmit = async (show, giftCountryMutation) => {
  show(true);
  await giftCountryMutation();
  // send transaction to firebase
};

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

export const handleResell = (
  priceInEth,
  setLoading,
  CountryERC721Method,
  userId,
  countryContractId,
  countryId,
) => {
  setLoading(true);
  // parameters for data variable
  const tokenId = new BigNumber(countryId);
  const t0 = Math.round(new Date().getTime() / 1000) || 0;
  const t1 = t0 + daysToSeconds(365);
  const p0 = ethToWei(priceInEth);
  const p1 = ethToWei(priceInEth);
  const two = new BigNumber(2);

  // convert country sale parameters to bytecode for smart contract
  const data = toBytes(
    two
      .pow(224)
      .times(tokenId)
      .plus(two.pow(192).times(t0))
      .plus(two.pow(160).times(t1))
      .plus(two.pow(80).times(p0))
      .plus(p1),
  );

  // userId:: string 0xD9b74f73d933Fde459766f74400971B29B90c9d2;
  // countryContractId:: string 0x3dc3cd66827e4a6a6f047ed66a0624b3cfa2ad39;
  // countryId:: number 180;
  // data:: string 0x000000b45be7c7935dc8fb1300000de0b6b3a764000000000de0b6b3a7640000;

  try {
    CountryERC721Method.safeTransferFrom(userId, countryContractId, countryId, data)
      .send()
      .then(() => {
        // send transaction to firebase
        // await sellMutation();
        // show(false);
        console.log('done...', userId, countryContractId, countryId);
      });
  } catch (err) {
    console.log('err', err);
  }
};
