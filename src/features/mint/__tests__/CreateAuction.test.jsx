import React from 'react';
import { render, fireEvent, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';
import CreateAuction from '..';
import { ethToWei, daysToSeconds } from '../helpers';

// @dev this automatically unmounts and cleanup DOM after the test is finished.
afterEach(cleanup);

describe('Auction page tests', () => {
  // @dev this is all the test data, easy to configure in one place
  const props = {
    createAuction: jest.fn(),
    handleRemoveGemFromAuction: jest.fn(),
    sourceImage:
      'https://i.kym-cdn.com/photos/images/original/001/225/594/18a.gif'
  };

  test.skip('Create a new auction', async () => {
    const { getByTestId } = render(<CreateAuction {...props} />);

    const gemIdInputNode = getByTestId('gemInputField');
    const durationInputNode = getByTestId('durationInputField');
    const startPriceInputNode = getByTestId('startPriceInputField');
    const endPriceInputNode = getByTestId('endPriceInputField');

    fireEvent.change(gemIdInputNode, { target: { value: 54321 } });
    fireEvent.change(durationInputNode, {
      target: { value: daysToSeconds(20) }
    });
    fireEvent.change(startPriceInputNode, {
      target: { value: 4 }
    });
    fireEvent.change(endPriceInputNode, {
      target: { value: 1 }
    });
    fireEvent.click(getByTestId('createAuctionButton'));

    expect(props.createAuction).toHaveBeenCalledTimes(1);
    expect(props.createAuction).toHaveBeenCalledWith(
      54321,
      149299200000,
      4000000000000000000,
      1000000000000000000
    );
  });

  test.skip('Stop an auction and retreieve your collectible', async () => {
    const { getByTestId } = render(<CreateAuction {...props} />);

    const gemIdInputNode = getByTestId('removeGemInputField');
    fireEvent.change(gemIdInputNode, { target: { value: 54321 } });
    fireEvent.click(getByTestId('removeGemButton'));

    expect(props.handleRemoveGemFromAuction).toHaveBeenCalledTimes(1);
    expect(props.handleRemoveGemFromAuction).toHaveBeenCalledWith(54321);
  });

  test.skip('An auction cannot be submitted without all of the fields in the correct type', async () => {
    const { getByTestId } = render(<CreateAuction {...props} />);
    fireEvent.click(getByTestId('createAuctionButton'));
    expect(props.createAuction).toHaveBeenCalledTimes(0);
  });

  test.skip('No code injection on field forms', async () => {
    const { getByTestId } = render(<CreateAuction {...props} />);
    expect(true).toBeFalsy();
  });

  test.skip('field forms always strip whitespace values', async () => {
    const { getByTestId } = render(<CreateAuction {...props} />);
    expect(true).toBeFalsy();
  });

  test.skip('progress bar shows correct value', async () => {
    const { getByTestId } = render(<CreateAuction {...props} />);
    expect(true).toBeFalsy();
  });

  test.skip('List out all your gems', async () => {
    const { getByTestId } = render(<CreateAuction {...props} />);
    expect(true).toBeFalsy();
  });

  test('ethToWei convert units reliably', () => {
    expect(typeof ethToWei(1)).toBe('number');
    expect(ethToWei(1)).toEqual(1000000000000000000);
  });

  test('daysToSeconds convert units reliably', () => {
    expect(typeof daysToSeconds(1)).toBe('number');
    expect(daysToSeconds(1)).toEqual(86400);
    expect(daysToSeconds(0.6)).toEqual(51840);
    expect(daysToSeconds(481)).toEqual(41558400);
  });

  test.skip('List a gem for auction with a single Click', () => {
    const { getByTestId } = render(<CreateAuction {...props} />);
    expect(true).toBeFalsy();
  });
});
