import React from 'react';
import { cleanup, fireEvent, wait } from 'react-testing-library';
import 'jest-dom/extend-expect';

// redux and routing
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { renderWithRouter } from '../../../app/testSetup';
import rootReducer from '../../../app/rootReducer.js';

// components to test
import TradingBox from '../components/TradingBox';

// @dev this automatically unmounts and cleanup DOM after the test is finished.
afterEach(cleanup);

describe.only('Creating an Auction', () => {
  // @dev this is all the test data, easy to configure in one place
  const AuctionProps = {
    tokenId: 12345,
    handleCreateAuction: jest.fn(),
    handleRemoveGemFromAuction: jest.fn(),
    auctionIsLive: false,
    level: 1,
    grade: 1,
    rate: 1,
    restingEnergyMinutes: 1,
    name: 'PropTypes.string.isRequired',
    currentPrice: 10000,
    minPrice: 10000,
    maxPrice: 100000,
    sourceImage: 'https://picsum.photos/200/300',
  };

  test.skip('Selling a gem fires the create Auction function', async () => {
    const store = createStore(rootReducer);

    const { getByTestId } = renderWithRouter(
      <Provider store={store}>
        <TradingBox {...AuctionProps} />
      </Provider>,
      {
        route: '/gem/12345',
      },
    );

    fireEvent.change(getByTestId('durationInputField'), { target: { value: 1 } });
    fireEvent.change(getByTestId('startPriceInputField'), { target: { value: 0.018 } });
    fireEvent.click(getByTestId('createAuctionButton'));
    // handleCreateAuction(payload, this.turnLoaderOff, history);
    await wait(() => expect(getByTestId('createAuctionButton')).toBeCalled());
    // expect(AuctionProps.handleCreateAuction).toHaveBeenCalled();
    expect(AuctionProps.handleCreateAuction).toHaveBeenCalledWith(5);
  });
});
