import React, {Fragment} from 'react';
import {Route} from 'react-router-dom';
import Loadable from 'react-loadable';
import Loading from '../components/Loading';
import {Erc20Market} from "../components/Erc20Market";

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
const Market = Loadable({
    loader: () => import('../features/market'),
    loading: Loading,
});
const Sale = Loadable({
    loader: () => import('../features/sale/index'),
    loading: Loading,
});
const Chest = Loadable({
    loader: () => import('../features/chests/index'),
    loading: Loading,
});
const ReferralInfo = Loadable({
    loader: () => import('../features/referrals/index'),
    loading: Loading,
});


const Routes = props => (
  <Fragment>
      <Route exact path="/" component={Market}/>
      <Route path="/market" component={Market}/>
      <Route path="/S_and_G_Sale" render={() => <Sale {...props} />}/>
      <Route path="/mint" render={() => <CreateAuction {...props} />}/>
      <Route path="/referrals" render={() => <ReferralInfo/>}/>
      <Route path="/mSig" render={() => <AccessMultiSig {...props} />}/>
      <Route path="/profile/:userId?" render={() => <Dashboard {...props} />}/>
      <Route path="/gem/:gemId" render={() => <Items {...props} />}/>
      <Route exact path="/plots" render={() => <Map {...props} />}/>
      <Route exact path="/plots/:countryId" render={() => <Map {...props} />}/>
      <Route exact path="/chest" render={() => <Chest {...props}/>}/>
      <Route path="/erc20" render={() => <Erc20Market/>} />
      {/*<Route path="/erc20" render={() => <Erc20App/>} />*/}
  </Fragment>
);

export default Routes;
