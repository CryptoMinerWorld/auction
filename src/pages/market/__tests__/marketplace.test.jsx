import React from "react";
import { render, cleanup } from "react-testing-library";
import "jest-dom/extend-expect";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { Provider } from "react-redux";
import { createStore } from "redux";
import App from "../../../App";
import Marketplace from "../ListAuctions";
import amethyst from "../../../images/amethystImage.png";
import rootReducer from "../../../reducers/index";

jest.mock("react-ga");
// @dev this automatically unmounts and cleanup DOM after the test is finished.
afterEach(cleanup);

// this is a handy function that I utilize for any component
// that relies on the router being in context
function renderWithRouter(
  ui,
  {
    route = "/",
    history = createMemoryHistory({ initialEntries: [route] })
  } = {}
) {
  return {
    ...render(<Router history={history}>{ui}</Router>),
    // adding `history` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    history
  };
}

describe("Marketplace page tests", () => {
  // @dev this is all the test data, easy to configure in one place
  const props = {
    auctions: [
      {
        id: 432,
        minPrice: 1,
        maxPrice: 4,
        price: 2.3,
        deadline: 1537255385592,
        image: amethyst,
        owner: "Crypto beasts",
        grade: 1,
        quality: 2,
        rate: 3
      }
    ]
  };

  test("the marketplace route loads the marketplace", async () => {
    const store = createStore(rootReducer);
    const { getByTestId } = renderWithRouter(
      <Provider store={store}>
        <App />
      </Provider>,
      {
        route: "/"
      }
    );

    expect(getByTestId("header").textContent).toBe("gem auctions");
  });

  test.skip("creating an auction fires an auction created event", async () => {
    const store = createStore(rootReducer);
    const { getByTestId } = renderWithRouter(
      <Provider store={store}>
        <App />
      </Provider>,
      {
        route: "/secretauctionpage"
      }
    );

    // mock a auction going through

    expect(false).toBeTruthy();
  });

  test.skip("the database saves the auction when an auction is created", async () => {
    const { getByTestId } = render(<Marketplace {...props} />);

    // go to the mint
    // create an auction
    // go to teh market
    // make sure the auction is saved on the db

    expect(false).toBeTruthy();
  });

  test("gem and auction information is saved to database when an auction is created", async () => {
    const { getByTestId } = render(<Marketplace {...props} />);

    // go to the mint
    // create an auction
    // go to teh market
    // make sure the auction is saved on the db

    expect(false).toBeTruthy();
  });

  test.skip("a non-exitent link shows a 404 page", async () => {
    const { container } = renderWithRouter(<App />, {
      route: "/"
    });

    expect(false).toBeTruthy();
  });
});
