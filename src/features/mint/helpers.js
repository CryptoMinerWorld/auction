import { utils } from 'web3';

export const ethToWei = (eth) => {
  console.log('eth', eth);
  const stringValue = eth === '' || eth === undefined || eth === ' ' ? '0' : eth.toString();
  return Number(utils.toWei(stringValue, 'ether'));
};

export const daysToSeconds = days => Number(days * 86400);
