import React, { Fragment } from "react";
import { Route } from "react-router-dom";

import CreateAuction from "./pages/Create";
import Auction from "./pages/Auction";
import Marketplace from "./pages/market/ListAuctions";
import Dashboard from "./pages/dashboard/index";
import GemPage from "./pages/gems/index";

const Routes = props => (
  <Fragment>
    <Route exact path="/" component={Marketplace} />
    <Route exact path="/market" component={Marketplace} />
    <Route
      path="/secretAuctionPage"
      render={() => <CreateAuction {...props} />}
    />
    <Route path="/auction/:auctionid" render={() => <Auction {...props} />} />
    <Route path="/profile/:userId" render={() => <Dashboard {...props} />} />
    <Route path="/gem/:gemId" render={() => <GemPage {...props} />} />
  </Fragment>
);

export default Routes;
