import { BigNumber } from 'bignumber.js';
import { rtdb } from '../../app/utils/firebase';
import { ethToWei, daysToSeconds } from '../mint/helpers';
import store from '../../app/store';

export const handleGiftFormSubmit = async (show, giftCountryMutation) => {
  show(true);
  await giftCountryMutation();
  // send transaction to firebase
};

export const updateMap = (countryId, sold) => rtdb.ref(`/worldMap/objects/units/geometries/${countryId}/properties`).update({ sold });

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
  CountryERC721Methods,
  userId,
  countrySaleContractId,
  countryId,
  sellMutation,
  updateCountryMap,
) => {
  setLoading(true);

  // parameters for data variable
  const tokenId = new BigNumber(countryId);
  const t0 = Math.round(new Date().getTime() / 1000) || 0;
  const t1 = t0 + daysToSeconds(365);
  const p0 = ethToWei(priceInEth) + 1000000000;
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

  return CountryERC721Methods.safeTransferFrom(userId, countrySaleContractId, countryId, data)
    .send()
    .then(() => Promise.all(sellMutation(), updateCountryMap(countryId, false)))
    .then(() => {
      setLoading(false);
    })
    .catch((error) => {
      console.log('error', error);
      setLoading(false);
    });
};

export const checkIfCountryIsForSale = countryId => {
  console.log('STORE:', store.getState());
  return store
    && store.getState().app.countryContract
    && store
      .getState()
      .app.countryContract.methods.ownerOf(countryId)
      .call({}, (error, address) => {
          if (address) {
              console.log('country already sold', countryId);
              return false;
          }

          console.log('country is for sale', countryId);

          return true;
      });
};