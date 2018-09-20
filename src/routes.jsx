import React, { Fragment } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import CreateAuction from "./pages/Create";
import Auction from "./pages/Auction";
import Marketplace from "./pages/market/ListAuctions";

const Routes = props => (
  <Router>
    <Fragment>
      <Route exact path="/" component={Marketplace} />
      <Route exact path="/market" component={Marketplace} />
      <Route
        path="/secretAuctionPage"
        render={() => <CreateAuction {...props} />}
      />
      <Route path="/auction/:auctionid" render={() => <Auction {...props} />} />
    </Fragment>
  </Router>
);

export default Routes;
