import { utils } from 'web3';

export const ethToWei = (eth) => {
  const stringValue = eth === '' || eth === undefined || eth === ' ' ? '0' : eth.toString();
  return Number(utils.toWei(stringValue, 'ether'));
};

export const ethToGWei = (eth) => {
    const stringValue = eth === '' || eth === undefined || eth === ' ' ? '0' : eth.toString();
    return Number(utils.toWei(stringValue, 'ether'))/1000000000;
};

export const daysToSeconds = days => Number(days * 86400);
