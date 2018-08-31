import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import List from './pages/ListAuctions';
import CreateAuction from './pages/Create';
import Auction from './pages/Auction/index';

export const Routes = props => (
  <Router>
    <Fragment>
      <Route exact path="/" component={List} />
      <Route
        path="/secretAuctionPage"
        render={() => <CreateAuction {...props} />}
      />
      <Route path="/auction/:auctionid" render={() => <Auction {...props} />} />
    </Fragment>
  </Router>
);
