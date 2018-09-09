import React from 'react';
import { render, fireEvent, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';
import CreateAuction from './index';
import { ethToWei, daysToMilliseconds } from './helpers';

// @dev this automatically unmounts and cleanup DOM after the test is finished.
afterEach(cleanup);

// @dev this is all the test data, easy to configure in one place
const testData = {
  createAuction: jest.fn(),
  handleApproveGemTransfer: jest.fn(),
  handleRemoveGemFromAuction: jest.fn()
};

test('Transfer gem to an auction button fires with correct data', async () => {
  // Arrange
  const { getByTestId } = render(
    <CreateAuction
      createAuction={testData.createAuction}
      handleApproveGemTransfer={testData.handleApproveGemTransfer}
      handleRemoveGemFromAuction={testData.handleRemoveGemFromAuction}
    />
  );

  // Act
  const gemIdInputNode = getByTestId('approveGemInputField');
  fireEvent.change(gemIdInputNode, { target: { value: 12345 } });
  fireEvent.click(getByTestId('transferGemButton'));

  // Assert
  expect(testData.handleApproveGemTransfer).toHaveBeenCalledTimes(1);
  expect(testData.handleApproveGemTransfer).toHaveBeenCalledWith(12345);
});

test('Create a new auction', async () => {
  const { getByTestId } = render(
    <CreateAuction
      createAuction={testData.createAuction}
      handleApproveGemTransfer={testData.handleApproveGemTransfer}
      handleRemoveGemFromAuction={testData.handleRemoveGemFromAuction}
    />
  );

  const gemIdInputNode = getByTestId('gemInputField');
  const durationInputNode = getByTestId('durationInputField');
  const startPriceInputNode = getByTestId('startPriceInputField');
  const endPriceInputNode = getByTestId('endPriceInputField');
  fireEvent.change(gemIdInputNode, { target: { value: 54321 } });
  fireEvent.change(durationInputNode, {
    target: { value: daysToMilliseconds(20) }
  });
  fireEvent.change(startPriceInputNode, {
    target: { value: 4 }
  });
  fireEvent.change(endPriceInputNode, {
    target: { value: 1 }
  });
  fireEvent.click(getByTestId('createAuctionButton'));

  expect(testData.createAuction).toHaveBeenCalledTimes(1);
  expect(testData.createAuction).toHaveBeenCalledWith(
    54321,
    149299200000000000,
    4000000000000000000,
    1000000000000000000
  );
});

test('Stop an auction and retreieve your collectible', async () => {
  const { getByTestId } = render(
    <CreateAuction
      createAuction={testData.createAuction}
      handleApproveGemTransfer={testData.handleApproveGemTransfer}
      handleRemoveGemFromAuction={testData.handleRemoveGemFromAuction}
    />
  );

  const gemIdInputNode = getByTestId('removeGemInputField');
  fireEvent.change(gemIdInputNode, { target: { value: 54321 } });
  fireEvent.click(getByTestId('removeGemButton'));

  expect(testData.handleRemoveGemFromAuction).toHaveBeenCalledTimes(1);
  expect(testData.handleRemoveGemFromAuction).toHaveBeenCalledWith(54321);
});

test.skip('An auction cannot be submiyyed without all of teh fields in the correct type', async () => {
  expect(true).toBeFalsy();
});

test.skip('No code injection on field forms', async () => {
  expect(true).toBeFalsy();
});

test.skip('field forms always strip whitespace values', async () => {
  expect(true).toBeFalsy();
});

test.skip('List out all your gems', async () => {
  expect(true).toBeFalsy();
});

test('ethToWei convert units reliably', () => {
  expect(typeof ethToWei(1)).toBe('number');
  expect(ethToWei(1)).toEqual(1000000000000000000);
});

test('daysToMilliseconds convert units reliably', () => {
  expect(typeof daysToMilliseconds(1)).toBe('number');
  expect(daysToMilliseconds(1)).toEqual(86400000);
  expect(daysToMilliseconds(0.6)).toEqual(51840000);
  expect(daysToMilliseconds(481)).toEqual(41558400000);
});


test.skip('List a gem for auction with a single Click', () => {

  const { getByTestId } = render(
    <CreateAuction
      createAuction={testData.createAuction}
      handleApproveGemTransfer={testData.handleApproveGemTransfer}
      handleRemoveGemFromAuction={testData.handleRemoveGemFromAuction}
    />
  );
  
  expect(true).toBeFalsy();
});