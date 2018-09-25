import React from "react";
import { render, fireEvent, cleanup } from "react-testing-library";
import "jest-dom/extend-expect";
import { Provider } from "react-redux";
import { createStore } from "redux";
import Auth from "../index.jsx";
import { renderWithRouter } from "../../../testSetup";
// @dev this automatically unmounts and cleanup DOM after the test is finished.
afterEach(cleanup);

describe("auntentication module tests", () => {
  // @dev this is all the test data, easy to configure in one place
  const props = {
    account: jest.fn(),
    handleRemoveGemFromAuction: jest.fn()
  };

  test.skip("Auth module recieves account id from metamask", async () => {
    const store = createStore(rootReducer);
    const { getByTestId } = renderWithRouter(
      <Provider store={store}>
        <Auth {...props} />
      </Provider>,
      {
        route: "/market"
      }
    );
    expect(false).toBeFalsy();
  });

  test.skip("if no current user you get a prompt to install metamask", async () => {
    const store = createStore(rootReducer);
    const { getByTestId } = renderWithRouter(
      <Provider store={store}>
        <Auth {...props} />
      </Provider>,
      {
        route: "/market"
      }
    );
    expect(false).toBeFalsy();
  });

  test.skip("if yser exists then it loads up their data", async () => {
    expect(false).toBeFalsy();
  });

  test.skip("if users doesn;t exist then it creates a new account for them", async () => {
    const store = createStore(rootReducer);
    const { getByTestId } = renderWithRouter(
      <Provider store={store}>
        <Auth {...props} />
      </Provider>,
      {
        route: "/market"
      }
    );
    expect(true).toBeFalsy();
  });

  test.skip("listen for metamask changes in realtime", async () => {
    expect(true).toBeFalsy();
  });
});
