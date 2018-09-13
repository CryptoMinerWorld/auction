import React from 'react';
import {
  render,
  fireEvent,
  waitForElement,
  cleanup
} from 'react-testing-library';
import 'jest-dom/extend-expect';
import Auction from './index';

import { calcMiningRate } from './helpers';


const firebasemock = require('firebase-mock');

const mockfirestore = new firebasemock.MockFirestore();
const mockstorage = new firebasemock.MockStorage();


// @dev this automatically unmounts and cleanup DOM after the test is finished.
afterEach(cleanup);

// @dev this lets you set a deadline so that the time is easy to test
const someDate = new Date();
const numberOfDaysToAdd = 2;
someDate.setDate(someDate.getDate() + numberOfDaysToAdd);



describe('Auction page tests', () => {

 // @dev this is all the test data, easy to configure in one place
const props = {
  currentPrice: '1.323',
  minPrice: .8,
  maxPrice: 4.5,
  deadline: Math.round(someDate/1000),
  level: 2,
  grade: 5,
  rate: 53,
  color: 10,
  name: 'Amethyst Thingymajig',
  buyNow: jest.fn(),
  showConfirm: jest.fn(),
  gemId: 12345,
  story: 'hello',
  gemImage: 'hello url',
  tokenId: 12345,
  redirectTo:'',
  auctionStartTime:2000,
  auctionEndTime: 1000,
  sourceImage:'https://i.kym-cdn.com/photos/images/original/001/225/594/18a.gif',
  provider: true
};

test('Buy now button triggers the modal with the correct gem Id and the buy Now function', async () => {
  // Arrange
  const { getByTestId } = render(<Auction {...props} />);

  const buyNowButton = await waitForElement(() => getByTestId('buyNowButton'));
  // Act
  fireEvent.click(buyNowButton);

  // Assert
  expect(props.buyNow).toHaveBeenCalledTimes(1);
  expect(props.buyNow).toHaveBeenCalledWith(
    props.gemId 
  );
});

test('If no metamask show modal, otherwise let people buy directly', async () => {  
  const { getByTestId } = render(
    <Auction
    {...props}
    provider={false}
    /> );

    const metaMask = props.web3
    expect(metaMask).toBeFalsy()
      // Act
    const buyNowButton = await waitForElement(() => getByTestId('buyNowButton'));
    fireEvent.click(buyNowButton);

  expect(props.showConfirm).toHaveBeenCalledTimes(1);
  expect(props.showConfirm).toHaveBeenCalledWith(
    props.buyNow, props.gemId
  );

})

test('Countdown timer shows correct time', async () => {
  const { getByTestId } = render(
    <Auction
    {...props}
    />
  );

  const days = await waitForElement(() => getByTestId('daysLeft'));
  const hours = await waitForElement(() => getByTestId('hoursLeft'));
  const minutes = await waitForElement(() => getByTestId('minutesLeft'));
  const seconds = await waitForElement(() => getByTestId('secondsLeft'));

  expect(days).toHaveTextContent(1);
  expect(hours).toHaveTextContent(23);
  expect(minutes).toHaveTextContent(59);
  expect(seconds).not.toHaveTextContent(0);
});

test('Countdown timer shows non-plural time descriptions (for example 1 hour vs 1 hours)', async () => {
  const { getByTestId } = render(
    <Auction {...props}
    />
  );

  const daysUnit = await waitForElement(() => getByTestId('daysUnit'));
  expect(daysUnit).not.toHaveTextContent('days');
  expect(daysUnit).toHaveTextContent('day');
});

test('Progress bar shows correct start and end price', async () => {
  const { getByTestId } = render(
    <Auction {...props}
    />
  );

  const minPriceBit = await waitForElement(() => getByTestId('minPrice'));
  const maxPriceBit = await waitForElement(() => getByTestId('maxPrice'));
  const currentPriceBit = await waitForElement(() => getByTestId('currentPrice'));

  expect(minPriceBit).toHaveTextContent(props.minPrice);
  expect(maxPriceBit).toHaveTextContent(props.maxPrice);
  expect(currentPriceBit).toHaveTextContent(props.currentPrice);
});

test('Current price shows the correct price', async () => {
  const { getByTestId } = render(
    <Auction {...props}
    />
  );

  const currentPriceBit = await waitForElement(() => getByTestId('currentPrice'));

  expect(currentPriceBit).toHaveTextContent(
    props.currentPrice
  );
});

test.skip('Check if the auction is still active, show bought or over', async () => {
  const { queryByText } = render(
    <Auction {...props} isTokenOnSale={false}
    />
  );
  const Button = queryByText('submit')
  expect(Button).toBeInTheDocument()
});


test.skip('auction tell you an auction is over of the id does not exist', () => {
  expect(true).toBeFalsy();
});

test.skip('Current price depreciates over time', async () => {
  // I don't knwo how to test this since the time deprecation is happening on the contract
  // jest.advanceTimersByTime(1000); might be useful somewhere
  // https://jestjs.io/docs/en/timer-mocks.html#advance-timers-by-time
});
test.skip('Current price does not continue to depreciate after the deadline', async () => {
  // Again, I don't knwo how to test this since the time deprecation is happening on the contract
  // jest.advanceTimersByTime(1000); might be useful somewhere
  // https://jestjs.io/docs/en/timer-mocks.html#advance-timers-by-time
});

test('calcMiningRate accurately calculates the mining rate', () => {
  expect(calcMiningRate(1, 200000)).toEqual(1);
  expect(calcMiningRate(6, 1000000)).toEqual(400);
});

test.skip('auction lets people buy after a deadline is passed', () => {
    // Again, I don't knwo how to test this since the time deprecation is happening on the contract
  // jest.advanceTimersByTime(1000); might be useful somewhere
  // https://jestjs.io/docs/en/timer-mocks.html#advance-timers-by-time
});




})
