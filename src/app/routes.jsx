import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import Icon from 'antd/lib/icon';

const Loading = () => (
  <div className="w-100 tc pa3">
    <Icon type="loading" theme="outlined" />
  </div>
);

const CreateAuction = Loadable({
  loader: () => import('../features/mint'),
  loading: Loading,
});

const Items = Loadable({
  loader: () => import('../features/items'),
  loading: Loading,
});
const Dashboard = Loadable({
  loader: () => import('../features/dashboard/index'),
  loading: Loading,
});
const Map = Loadable({
  loader: () => import('../features/countries/index'),
  loading: Loading,
});
const Marketplace = Loadable({
  loader: () => import('../features/market'),
  loading: Loading,
});

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
