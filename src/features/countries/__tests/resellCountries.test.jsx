import React from 'react';
import {
  render, fireEvent, cleanup, waitForElement,
} from 'react-testing-library';
import 'jest-dom/extend-expect';
import { MockedProvider } from 'react-apollo/test-utils';
import gql from 'graphql-tag';

import CountryDetails from '../components/Dashboard/CountryDetails';

jest.mock('firebase');
jest.mock('react-ga');

afterEach(cleanup);

describe('Country Resell Feature', () => {
  const mockCountry = {
    name: 'Portugal',
  };

  test('sell button fires teh resell function', async () => {
    const handleResell = jest.fn();
    const sellMethod = jest.fn();

    const { getByTestId } = render(
      <CountryDetails
        name={mockCountry.name}
        lastBought={mockCountry.name}
        description={mockCountry.name}
        totalPlots={mockCountry.name}
        plotsBought={mockCountry.name}
        plotsMined={mockCountry.name}
        plotsAvailable={mockCountry.name}
        image={mockCountry.name}
        lastPrice={mockCountry.name}
        roi={mockCountry.name}
        handleResell={handleResell}
        sellMethod={sellMethod}
      />,
    );
    await waitForElement(() => getByTestId('countrySellButton'));
    fireEvent.click(getByTestId('countrySellPriceInput', { target: { value: 56 } }));
    fireEvent.click(getByTestId('countrySellButton'));
    // await waitForElement(() => getByTestId('countrySellButtonLoading'));
    // expect(getByTestId('countrySellButtonLoading')).toBeInTheDocument();
    expect(handleResell).toHaveBeenCalled();
    expect(handleResell).toHaveBeenCalledWith(sellMethod);
  });

  test.skip('hide teh sell button if you dont own the country', () => {});

  test.skip('if there is no contact or other needed params teh bitton is disabled and helper message is shown', () => {});
  test.skip('when you click teh button it fores a spinner', () => {});
  test.skip('adding string to price inupt will fail', () => {});
  test.skip('axe test this component', () => {});
  test.skip('error test this component', () => {});
  test.skip('remove a resold country from auction', () => {});
  test.skip('buy a resold country', () => {});

  test.skip('removing a country only remove that country', () => {});
});
