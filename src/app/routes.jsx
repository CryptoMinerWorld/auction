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
})

const Items = Loadable({
    loader: () => import('../features/items'),
    loading: Loading,
});
const Dashboard = Loadable({
    loader: () => import('../features/dashboard/index'),
    loading: Loading,
});
// const Map = Loadable({
//     loader: () => import('../features/plotsale/index'),
//     loading: Loading,
// });
const Marketplace = Loadable({
    loader: () => import('../features/market'),
    loading: Loading,
});
const Sale = Loadable({
    loader: () => import('../features/sale/index'),
    loading: Loading,
});

const Stub = Loadable({
    loader: () => import('../features/stub'),
    loading: Loading,
})

const Routes = props => (
  <Fragment>
      <Route exact path="/" component={Stub}/>
      <Route path="/market" component={Stub}/>
      <Route path="/S_and_G_Sale" render={() => <Stub/>}/>
      <Route path="/mint" render={() => <Stub />}/>
      <Route path="/mSig" render={() => <Stub />}/>
      <Route path="/profile/:userId" render={() => {
        console.warn('----------> Dashboard route starts <---------');
        return (<Stub />)}}/>
      <Route path="/gem/:gemId" render={() => <Stub />}/>
      {/*<Route path="/plots" render={() => <Map {...props} />}/>*/}
  </Fragment>
);

export default Routes;
