import React from 'react';
import {
  render,
  fireEvent,
  waitForElement,
  cleanup
} from 'react-testing-library';
import 'jest-dom/extend-expect';
import Auction from './index';

// @dev this automatically unmounts and cleanup DOM after the test is finished.
afterEach(cleanup);

// @dev this lets you set a deadline so that the time is easy to test
let someDate = new Date();
let numberOfDaysToAdd = 2;
someDate.setDate(someDate.getDate() + numberOfDaysToAdd);

// @dev this is all the test data, easy to configure in one place
let testData = {
  currentPrice: 1.323,
  minPrice: 0.8,
  maxPrice: 4.5,
  deadline: someDate,
  level: 2,
  grade: 'a',
  rate: 53,
  name: 'Amethyst Thingymajig',
  handleBuyNow: jest.fn(),
  showConfirm: jest.fn(),
  gemId: 12345
};

test('Buy now button triggers the modal with the correct gem Id and the buy Now function', () => {
  // Arrange
  const { getByTestId } = render(
    <Auction
      currentPrice={testData.currentPrice}
      minPrice={testData.minPrice}
      maxPrice={testData.maxPrice}
      level={testData.level}
      grade={testData.grade}
      rate={testData.rate}
      buyNow={testData.handleBuyNow}
      deadline={testData.deadline}
      name={testData.name}
      tokenId={testData.gemId}
      showConfirm={testData.showConfirm}
    />
  );

  // Act
  fireEvent.click(getByTestId('buyNowButton'));

  // Assert
  expect(testData.showConfirm).toHaveBeenCalledTimes(1);
  expect(testData.showConfirm).toHaveBeenCalledWith(
    testData.gemId,
    testData.handleBuyNow
  );
});

test('Countdown timer shows correct time', async () => {
  const { getByTestId } = render(
    <Auction
      currentPrice={testData.currentPrice}
      minPrice={testData.minPrice}
      maxPrice={testData.maxPrice}
      level={testData.level}
      grade={testData.grade}
      rate={testData.rate}
      buyNow={testData.handleBuyNow}
      deadline={testData.deadline}
      name={testData.name}
    />
  );

  const days = await waitForElement(() => getByTestId('daysLeft'));
  const hours = await waitForElement(() => getByTestId('hoursLeft'));
  const minutes = await waitForElement(() => getByTestId('minutesLeft'));
  const seconds = await waitForElement(() => getByTestId('secondsLeft'));

  expect(days).toHaveTextContent(1);
  expect(hours).toHaveTextContent(23);
  expect(minutes).toHaveTextContent(59);
  expect(seconds).not.toHaveTextContent(59);
});

test('Countdown timer shows non-plural time descriptions (for example 1 hour vs 1 hours)', async () => {
  const { getByTestId } = render(
    <Auction
      currentPrice={testData.currentPrice}
      minPrice={testData.minPrice}
      maxPrice={testData.maxPrice}
      level={testData.level}
      grade={testData.grade}
      rate={testData.rate}
      buyNow={testData.handleBuyNow}
      deadline={testData.deadline}
      name={testData.name}
    />
  );

  const daysUnit = await waitForElement(() => getByTestId('daysUnit'));
  expect(daysUnit).not.toHaveTextContent('days');
  expect(daysUnit).toHaveTextContent('day');
});

test('Progress bar shows correct start and end price', async () => {
  const { getByTestId } = render(
    <Auction
      currentPrice={testData.currentPrice}
      minPrice={testData.minPrice}
      maxPrice={testData.maxPrice}
      level={testData.level}
      grade={testData.grade}
      rate={testData.rate}
      buyNow={testData.handleBuyNow}
      deadline={testData.deadline}
      name={testData.name}
    />
  );

  expect(getByTestId('minPrice')).toHaveTextContent(testData.minPrice);
  expect(getByTestId('maxPrice')).toHaveTextContent(testData.maxPrice);
  expect(getByTestId('currentPrice')).toHaveTextContent(testData.currentPrice);
});

test('Current price shows the correct price', async () => {
  const { getByTestId } = render(
    <Auction
      currentPrice={testData.currentPrice}
      minPrice={testData.minPrice}
      maxPrice={testData.maxPrice}
      level={testData.level}
      grade={testData.grade}
      rate={testData.rate}
      buyNow={testData.handleBuyNow}
      deadline={testData.deadline}
      name={testData.name}
    />
  );

  expect(getByTestId('currentAuctionPrice')).toHaveTextContent(
    testData.currentPrice
  );
});

test.only('Check if the auction is still active, show bought or over', async () => {
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
