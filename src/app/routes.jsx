import React, {Fragment} from 'react';
import {Route} from 'react-router-dom';
import Loadable from 'react-loadable';
import Loading from '../components/Loading';

const CreateAuction = Loadable({
    loader: () => import('../features/mint'),
    loading: Loading,
});
const AccessMultiSig = Loadable({
    loader: () => import('../features/multisig/'),
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
    loader: () => import('../features/plotsale/index'),
    loading: Loading,
});
const Marketplace = Loadable({
    loader: () => import('../features/market'),
    loading: Loading,
});
const Sale = Loadable({
    loader: () => import('../features/sale/index'),
    loading: Loading,
});

const Routes = props => (
  <Fragment>
      <Route exact path="/" component={Marketplace}/>
      <Route path="/market" component={Marketplace}/>
      <Route path="/S_and_G_Sale" render={() => <Sale {...props} />}/>
      <Route path="/mint" render={() => <CreateAuction {...props} />}/>
      <Route path="/mSig" render={() => <AccessMultiSig {...props} />}/>
      <Route path="/profile/:userId?" render={() => <Dashboard {...props} />}/>
      <Route path="/gem/:gemId" render={() => <Items {...props} />}/>
      <Route exact path="/plots" render={() => <Map {...props} />}/>
      <Route exact path="/plots/:countryId" render={() => <Map {...props} />}/>
  </Fragment>
);

export default Routes;
