import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';

import CreateAuction from '../features/mint';
import Items from '../features/items';
import Dashboard from '../features/dashboard/index';
import Map from '../features/countries/index';
import Marketplace from '../features/market';

// const CreateAuction = React.lazy(() => import('../features/mint'));
// const Items = React.lazy(() => import('../features/items'));
// const Dashboard = React.lazy(() => import('../features/dashboard/index'));
// const Map = React.lazy(() => import('../features/countries/index'));
// const Marketplace = React.lazy(() => import('../features/market'));

const Routes = props => (
  <Fragment>
    <Route exact path="/" component={Marketplace} />
    <Route path="/market" component={Marketplace} />
    <Route path="/mint" render={() => <CreateAuction {...props} />} />
    <Route path="/profile/:userId" render={() => <Dashboard {...props} />} />
    <Route path="/gem/:gemId" render={() => <Items {...props} />} />
    <Route path="/map" render={() => <Map {...props} />} />
  </Fragment>
);

export default Routes;
