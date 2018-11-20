import cases from 'jest-in-case';
import {
  calculatePercentage, weiToEth, gradeConverter,
} from '../helpers';

// jest.mock('../../../app/utils/firebase', () => ({
//   db: {
//     collection: jest.fn(() => ({
//       where: jest.fn(() => ({
//         get: jest.fn(() => jest.fn(() => 123)),
//       })),
//     })),
//   },
// }));



cases('calculatePercentage for price progress bar', (opts) => {
  expect(calculatePercentage(opts.min, opts.max, opts.current)).toBe(opts.total);
}, [
  {
    name: '0% @0', min: 0, max: 1000, current: 1000, total: 0,
  },
  {
    name: '25% @0', min: 0, max: 1000, current: 750, total: 25,
  },
  {
    name: '50% @0', min: 0, max: 1000, current: 500, total: 50,
  },
  {
    name: '75% @0', min: 0, max: 1000, current: 250, total: 75,
  },
  {
    name: '100% @0', min: 0, max: 1000, current: 0, total: 100,
  },
  {
    name: '0%', min: 500, max: 1000, current: 1000, total: 0,
  },
  {
    name: '25%', min: 500, max: 1000, current: 875, total: 25,
  },
  {
    name: '50% ', min: 500, max: 1000, current: 750, total: 50,
  },
  {
    name: '75% ', min: 500, max: 1000, current: 625, total: 75,
  },
  {
    name: '100%', min: 500, max: 1000, current: 500, total: 100,
  },
]);

test('weiToEth convert wei to Eth', () => {
  expect(weiToEth(1000000000000000000)).toBe(1);
});

test('weiToEth convert wei to Eth', () => {
  expect(gradeConverter(4)).toBe('A');
});

// test('updateDBwithNewPrice updates teh db with a new price', async () => {
//   const dbCall = jest.fn(async () => new Promise(resolve => resolve(123))
//   updateDBwithNewPrice(43, dbCall).then(datum => expect(datum).toBe(3454))
// });
