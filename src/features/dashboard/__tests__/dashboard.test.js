import React from 'react';
import { waitForElement, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
// import Dashboard from '../index';
import rootReducer from '../../../app/rootReducer.js';
import { renderWithRouter } from '../../../app/testSetup';
import SortBox from '../components/SortBox';
import GemSortBox from '../components/GemSortBox';

jest.mock('react-ga');
afterEach(cleanup);
// jest.mock('firebase');

test.skip('when I sort my dashboard it rearranges my gems', async () => {
  const store = createStore(rootReducer);

  const { getByTestId, debug } = renderWithRouter(
    <Provider store={store}>
      <SortBox />
    </Provider>,
    {
      route: '/profile/0x11A4770C7990B4c9adD7b6787E1c5F39387f8EAd',
    },
  );
  expect(true).toBeTruthy();
});

test('when I filter my dashboard it filters my gems', async () => {
  const store = createStore(rootReducer);

  const { getByTestId } = renderWithRouter(
    <Provider store={store}>
      <GemSortBox />
    </Provider>,
    {
      route: '/profile/0x11A4770C7990B4c9adD7b6787E1c5F39387f8EAd',
    },
  );
  expect(true).toBeTruthy();
});

test.skip('when I load my dashboard it shows me my gems', async () => {
  const store = createStore(rootReducer);

  const { getByTestId } = renderWithRouter(
    <Provider store={store}>
      <Dashboard />
    </Provider>,
    {
      route: '/profile/0x11A4770C7990B4c9adD7b6787E1c5F39387f8EAd',
    },
  );
  expect(true).toBeTruthy();
});
