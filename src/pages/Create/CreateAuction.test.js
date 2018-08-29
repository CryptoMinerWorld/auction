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

test('List out all your gems', async () => {
  expect(true).toBeFalsy();
});

test('Create a new auction', async () => {
  expect(true).toBeFalsy();
});

test('Stop an auction and retreieve your collectibel', async () => {
  expect(true).toBeFalsy();
});

test('An auction cannot be submiyyed without all of teh fields in the correct type', async () => {
  expect(true).toBeFalsy();
});

test('No code injection on field forms', async () => {
  expect(true).toBeFalsy();
});

test('field forms always strip whitespace values', async () => {
  expect(true).toBeFalsy();
});
