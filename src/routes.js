import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import List from './pages/ListAuctions';
import { CreateAuctionContainer } from './pages/Create/CreateAuction';
import Manage from './pages/ManageAuction';
import Auction from './pages/Auction/index';

export const Routes = props => (
  <Router>
    <Fragment>
      <Route exact path="/" component={List} />
      <Route
        path="/create"
        render={() => <CreateAuctionContainer {...props} />}
      />
      <Route path="/manage" component={Manage} />
      <Route path="/auction/:auctionid" render={() => <Auction {...props} />} />
    </Fragment>
  </Router>
);
