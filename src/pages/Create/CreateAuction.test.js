import React from 'react';
import {
  render,
  fireEvent,
  waitForElement,
  cleanup
} from 'react-testing-library';
import 'jest-dom/extend-expect';
import CreateAuction from './CreateAuction';

// @dev this automatically unmounts and cleanup DOM after the test is finished.
afterEach(cleanup);

test('Create a new auction', async () => {
  expect(true).toBeFalsy();
});

test('Stop an auction and retreieve your collectibel', async () => {
  expect(true).toBeFalsy();
});
