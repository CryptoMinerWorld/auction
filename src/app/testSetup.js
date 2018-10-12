import React from 'react';
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import {
  render
} from 'react-testing-library';

// this is a handy function that I utilize for any component
// that relies on the router being in context
export const renderWithRouter = (
    ui,
    {
      route = "/",
      history = createMemoryHistory({ initialEntries: [route] })
    } = {}
  ) => {
    return {
      ...render(<Router history={history}>{ui}</Router>),
      // adding `history` to the returned utilities to allow us
      // to reference it in our tests (just try to avoid using
      // this to test implementation details).
      history
    }}


  export const temp =  (
    ui,
    {
      route = "/",
      history = createMemoryHistory({ initialEntries: [route] })
    } = {}
  ) => ({
      ...render(<Router history={history}>{ui}</Router>),
      // adding `history` to the returned utilities to allow us
      // to reference it in our tests (just try to avoid using
      // this to test implementation details).
      history
    })

    