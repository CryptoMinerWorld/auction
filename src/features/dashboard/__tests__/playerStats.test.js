import React from 'react';
import { waitForElement, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';
import PlayerStats , { TestPlayerStats } from '../components/AuctionCategories';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from '../../../app/rootReducer.js';
import { renderWithRouter } from '../../../app/testSetup';

jest.mock('react-ga');
afterEach(cleanup);

test('referral points function shows loading text', async () => {
  const getPoints = jest.fn();
  const store = createStore(rootReducer);
  const getPlotCount = jest.fn(() => new Promise(resolve => resolve(1)));

  const { getByTestId } = renderWithRouter(
    <Provider store={store}>
      <PlayerStats
        gemCount={1}
        getReferralPoints={getPoints}
        getPlotCount={getPlotCount}
      />
    </Provider>,

    {
      route: '/profile/0x11A4770C7990B4c9adD7b6787E1c5F39387f8EAd'
    }
  );

  const loadingReferralPoints = await waitForElement(() =>
    getByTestId('loadingReferralPoints')
  );

  expect(loadingReferralPoints).toHaveTextContent('Loading Referral Points...');
});

test('referral points function is called when the workshop page loads', async () => {
  const getPoints = jest.fn(() => new Promise(resolve => resolve(1)));
  const preSaleContract = jest.fn();
  const getPlotCount = jest.fn(() => new Promise(resolve => resolve(1)));

  const { getByTestId } = renderWithRouter(
    <TestPlayerStats
      gemCount={1}
      getReferralPoints={getPoints}
      preSaleContract={preSaleContract}
      getPlotCount={getPlotCount}
    />,
    {
      route: '/profile/0x11A4770C7990B4c9adD7b6787E1c5F39387f8EAd'
    }
  );

  const referralPoints = await waitForElement(() =>
    getByTestId('referralPoints')
  );

  expect(referralPoints).toHaveTextContent('1 REFERAL POINT AVAILABLE');
  expect(getPoints).toHaveBeenCalled();
});

test('referral points componnet show plural grammer', async () => {
  const getPoints = jest.fn(() => new Promise(resolve => resolve(2)));
  const preSaleContract = jest.fn();
  const getPlotCount = jest.fn(() => new Promise(resolve => resolve(1)));

  const { getByTestId } = renderWithRouter(
    <TestPlayerStats
      gemCount={1}
      getReferralPoints={getPoints}
      preSaleContract={preSaleContract}
      getPlotCount={getPlotCount}
    />,
    {
      route: '/profile/0x11A4770C7990B4c9adD7b6787E1c5F39387f8EAd'
    }
  );

  const referralPoints = await waitForElement(() =>
    getByTestId('referralPoints')
  );

  expect(referralPoints).toHaveTextContent('2 REFERAL POINTS AVAILABLE');
  expect(getPoints).toHaveBeenCalled();
  
});

test('plots of land function is called when the workshop page loads', async () => {
  const getPoints = jest.fn(() => new Promise(resolve => resolve(1)));
  const preSaleContract = jest.fn();
  const getPlotCount = jest.fn(() => new Promise(resolve => resolve(1)));

  const { getByTestId } = renderWithRouter(
    <TestPlayerStats
      gemCount={1}
      getReferralPoints={getPoints}
      preSaleContract={preSaleContract}
      getPlotCount={getPlotCount}
    />,
    {
      route: '/profile/0x11A4770C7990B4c9adD7b6787E1c5F39387f8EAd'
    }
  );

  const plots = await waitForElement(() =>
    getByTestId('plotsOfLand')
  );

  expect(plots).toHaveTextContent('1 PLOT');
  expect(getPlotCount).toHaveBeenCalled();
});

test('plots component show plural grammer', async () => {
  const getPoints = jest.fn(() => new Promise(resolve => resolve(2)));
  const preSaleContract = jest.fn();
  const getPlotCount = jest.fn(() => new Promise(resolve => resolve(0)));

  const { getByTestId } = renderWithRouter(
    <TestPlayerStats
      gemCount={1}
      getReferralPoints={getPoints}
      preSaleContract={preSaleContract}
      getPlotCount={getPlotCount}
    />,
    {
      route: '/profile/0x11A4770C7990B4c9adD7b6787E1c5F39387f8EAd'
    }
  );

  const plots = await waitForElement(() =>
    getByTestId('plotsOfLand')
  );

  expect(plots).toHaveTextContent('0 PLOTS');
  expect(getPlotCount).toHaveBeenCalled();
});



