import React from 'react';
import {
  render,
  fireEvent,
  waitForElement,
  cleanup,
  Simulate
} from 'react-testing-library';
import 'jest-dom/extend-expect';
import CreateAuction from './index';
// @dev this automatically unmounts and cleanup DOM after the test is finished.
afterEach(cleanup);

// @dev this is all the test data, easy to configure in one place
let testData = {
  createAuction: jest.fn(),
  handleApproveGemTransfer: jest.fn(),
  handleRemoveGemFromAuction: jest.fn()
};

test('Transfer gem to an auction button fires with correct data', async () => {
  // Arrange
  let { getByTestId } = render(
    <CreateAuction
      createAuction={testData.createAuction}
      handleApproveGemTransfer={testData.handleApproveGemTransfer}
      handleRemoveGemFromAuction={testData.handleRemoveGemFromAuction}
    />
  );

  // Act
  let gemIdInputNode = getByTestId('approveGemInputField');
  fireEvent.change(gemIdInputNode, { target: { value: 12345 } });
  fireEvent.click(getByTestId('transferGemButton'));

  // Assert
  expect(testData.handleApproveGemTransfer).toHaveBeenCalledTimes(1);
  expect(testData.handleApproveGemTransfer).toHaveBeenCalledWith(12345);
});

test('Create a new auction', async () => {
  let { getByTestId } = render(
    <CreateAuction
      createAuction={testData.createAuction}
      handleApproveGemTransfer={testData.handleApproveGemTransfer}
      handleRemoveGemFromAuction={testData.handleRemoveGemFromAuction}
    />
  );

  let gemIdInputNode = getByTestId('gemInputField');
  let durationInputNode = getByTestId('durationInputField');
  let startPriceInputNode = getByTestId('startPriceInputField');
  let endPriceInputNode = getByTestId('endPriceInputField');
  fireEvent.change(gemIdInputNode, { target: { value: 54321 } });
  fireEvent.change(durationInputNode, { target: { value: 49000 } });
  fireEvent.change(startPriceInputNode, { target: { value: 543210000 } });
  fireEvent.change(endPriceInputNode, { target: { value: 54321000 } });
  fireEvent.click(getByTestId('createAuctionButton'));

  expect(testData.createAuction).toHaveBeenCalledTimes(1);
  expect(testData.createAuction).toHaveBeenCalledWith(
    54321,
    49000,
    543210000,
    54321000
  );
});

test('Stop an auction and retreieve your collectible', async () => {
  let { getByTestId } = render(
    <CreateAuction
      createAuction={testData.createAuction}
      handleApproveGemTransfer={testData.handleApproveGemTransfer}
      handleRemoveGemFromAuction={testData.handleRemoveGemFromAuction}
    />
  );

  let gemIdInputNode = getByTestId('removeGemInputField');
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
