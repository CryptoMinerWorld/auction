import React, { Fragment } from "react";
import { Route } from "react-router-dom";
import CreateAuction from "../features/mint";
import Auction from "../features/auction";
import Marketplace from "../features/market";
import Dashboard from "../features/dashboard/index";
import GemPage from "../features/dashboard/components/gems";

const Routes = props => (
  <Fragment>
    <Route exact path="/" component={Marketplace} />
    {/* <Redirect exact from="/" to="/market" /> */}
    <Route path="/market" component={Marketplace} />
    <Route path="/mint" render={() => <CreateAuction {...props} />} />
    <Route path="/auction/:auctionid" render={() => <Auction {...props} />} />
    <Route path="/profile/:userId" render={() => <Dashboard {...props} />} />
    <Route path="/gem/:gemId" render={() => <GemPage {...props} />} />
  </Fragment>
);

export default Routes;
