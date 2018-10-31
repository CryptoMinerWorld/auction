import React from 'react';
import {
  render, fireEvent, cleanup, wait,
} from 'react-testing-library';
import 'jest-dom/extend-expect';
import { MockedProvider } from 'react-apollo/test-utils';
import gql from 'graphql-tag';
import CountryPage from '../index';

jest.mock('firebase');

afterEach(cleanup);


const mocks = [
  {
    request: {
      query: gql`
        {
          user(id: "0xd9b74f73d933fde459766f74400971b29b90c9d2") {
            name
          }
        }
      `,
      variables: { id: '123' },
    },
    result: {
      data: {
        item: 'Josh',
      },
    },
  },
];

const handleBuyNow = jest.fn();

describe('Country Map', () => {
  test('map page renders', () => {
    const { getByTestId, getByText } = render(
      <MockedProvider mocks={mocks}>
        <CountryPage handleBuyNow={handleBuyNow} />
      </MockedProvider>,
    );
    expect(getByTestId('mapPage')).toBeInTheDocument();
    expect(getByTestId('mapComponent')).toBeInTheDocument();
    expect(getByTestId('cartComponent')).toBeInTheDocument();
    expect(getByText('John Brown')).toBeInTheDocument();
  });

  test.skip('map matches snapshot', () => {
    const { getByTestId } = render(
      <MockedProvider mocks={mocks}>
        <CountryPage handleBuyNow={handleBuyNow} />
      </MockedProvider>,
    );
    expect(getByTestId('mapPage')).toMatchSnapshot();
  });

  test('when I hover on a country its details appear in the detail bar', () => {
    const { getByTestId } = render(
      <MockedProvider mocks={mocks}>
        <CountryPage handleBuyNow={handleBuyNow} />
      </MockedProvider>,
    );
    fireEvent.mouseEnter(getByTestId('Brazil'));
    expect(getByTestId('countryDetails')).toHaveTextContent('Brazil');
  });

  test('when I select a countrty it gets added to the cart', () => {
    const { getByText, getByTestId } = render(
      <MockedProvider mocks={mocks}>
        <CountryPage handleBuyNow={handleBuyNow} />
      </MockedProvider>,
    );
    fireEvent.click(getByTestId('India'));
    expect(getByText('India')).toBeInTheDocument();
  });

  test('when I select a country in the cart it gets removed', () => {
    const { getByText, getByTestId, queryByText } = render(
      <MockedProvider mocks={mocks}>
        <CountryPage handleBuyNow={handleBuyNow} />
      </MockedProvider>,
    );
    fireEvent.click(getByTestId('India'));
    expect(getByText('India')).toBeInTheDocument();
    fireEvent.click(getByTestId('remove-India'));
    expect(queryByText('India')).not.toBeInTheDocument();
  });

  test('when I buy items the buy now metamask modal appears', () => {
    const { getByTestId, getByText, queryByTestId } = render(
      <MockedProvider mocks={mocks}>
        <CountryPage handleBuyNow={handleBuyNow} />
      </MockedProvider>,
    );
    fireEvent.click(getByTestId('India'));
    expect(getByText('India')).toBeInTheDocument();
    getByTestId('cartLoading');

    wait(() => expect(
      queryByTestId('cartLoading')
        .toBeNull(),
    ));
    getByTestId('buyNow');
    fireEvent.click(getByTestId('buyNow'));
    expect(handleBuyNow).toBeCalled();
    expect(handleBuyNow).toBeCalledWith([{
      country: 'Brazil', key: '1', plots: 44, price: 32, return: 54, roi: 45,
    }, {
      country: 'India', key: '1', plots: 44, price: 32, return: 54, roi: 45,
    }]);
  });

  test('once I have bought a country it appears in my profile', () => {
    expect(true).toBeFalsy();
  });
});


test.skip('info bar aggregates price when a country is not selected ', () => {
  expect(true).toBeFalsy();
});

test.skip('cancelling the metamsk prompt also cancels the buy now modal ', () => {
  expect(true).toBeFalsy();
});

test.skip('when I hover on a countrty its details appear in a tool tip', () => {
  expect(true).toBeFalsy();
});

test.skip('map details update in realtime', () => {
  expect(true).toBeFalsy();
});

test.skip('You shoud only be able to add a country once', () => {
  expect(true).toBeFalsy();
});

// tab structure on workshop
// profile country details update in realtime?
// gifting a country
// handling transactions
