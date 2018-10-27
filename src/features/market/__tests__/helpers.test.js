import {
  calculatePercentage, weiToEth, gradeConverter, updateDBwithNewPrice,
} from '../helpers';

jest.mock('../../../app/utils/firebase', () => ({
  db: {
    collection: jest.fn(() => ({
      where: jest.fn(() => ({
        get: jest.fn(() => jest.fn(() => 123)),
      })),
    })),
  },
}));

test('calculatePercentage calculate a peercentage', () => {
  expect(calculatePercentage(100, 49)).toBe(51);
});

test('weiToEth convert wei to Eth', () => {
  expect(weiToEth(1000000000000000000)).toBe(1);
});

test('weiToEth convert wei to Eth', () => {
  expect(gradeConverter(4)).toBe('A');
});

test('updateDBwithNewPrice updates teh db with a new price', async () => {
  const dbCall = jest.fn(async () => new Promise(resolve => resolve(123))
  updateDBwithNewPrice(43, dbCall).then(datum => expect(datum).toBe(3454))
});
