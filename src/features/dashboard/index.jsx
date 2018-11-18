import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Pagination from 'antd/lib/pagination';
import { withStateMachine } from 'react-automata';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter, Link } from 'react-router-dom';
// import { matchesState } from 'xstate';
import notification from 'antd/lib/notification';
import Tabs from 'antd/lib/tabs';
// import { Transition, config } from 'react-spring';
import { Spring } from 'react-spring';
import { graphql } from 'react-apollo';
import { db } from '../../app/utils/firebase';
import { setError } from '../../app/appActions';
import {
  getUserGemsOnce,
  getUserDetails,
  filterUserGemsOnPageLoad,
  paginate,
  addGemsToDashboard,
} from './dashboardActions';
import GemSortBox from './components/GemSortBox';
import Cards from './components/GemCard';
import LoadingCard from '../market/components/LoadingCard';
import NoCard from './components/NoCard';
import { preLoadAuctionPage } from '../market/marketActions';
import ReSync from './components/ResyncButton';
import SortBox from './components/SortBox';
// import AuctionCategories from './components/AuctionCategories';
import {
  getReferralPoints,
  getPlotCount,
  getCountryNameFromCountryId,
  getMapIndexFromCountryId,
} from './helpers';
import stateMachine from './stateMachine';
import CountryDashboard from '../countries/components/Dashboard';
import { USER_COUNTRIES } from '../countries/queries';
import Gold from '../../app/images/dashboard/Gold.png';
import Silver from '../../app/images/dashboard/Silver.png';
import Gem from '../../app/images/dashboard/gems.png';
import Artifact from '../../app/images/dashboard/Artifacts.png';
import Keys from '../../app/images/dashboard/Keys.png';
import Land from '../../app/images/dashboard/Land.png';
import Plot from '../../app/images/dashboard/Plot.png';
import { EnhancedCoupon } from './components/Coupon';

const { TabPane } = Tabs;

require('antd/lib/tabs/style/css');
require('antd/lib/notification/style/css');
require('antd/lib/pagination/style/css');
require('antd/lib/slider/style/css');

const Grid = styled.article`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-column-gap: 20px;
`;

const CardBox = styled.section`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fill, minMax(280px, 1fr));
  grid-column-gap: 20px;
  grid-row-gap: 20px;
`;

const Primary = styled.section`
  grid-column-start: span 5;
  width: 100%;
`;

const select = store => ({
  totalGems: store.dashboard && store.dashboard.userGems && store.dashboard.userGems.length,
  auctions: store.dashboard.filter,
  paginatedRedux: store.dashboard
    && store.dashboard.filter && [
    ...store.dashboard.filter.slice(store.dashboard.start, store.dashboard.end),
  ],
  pageNumber: store.dashboard.page,
  loading: store.dashboard.gemsLoading,
  error: store.dashboard.gemsLoadingError,
  userName: store.dashboard.userDetails && store.dashboard.userDetails.name,
  userImage: store.dashboard.userDetails && store.dashboard.userDetails.imageURL,
  sortBox: store.dashboard.sortBox,
  currentUserId: store.auth.currentUserId,
  web3: store.app.web3,
  preSaleContract: store.app.presaleContractInstance,
  CountrySale: store.app.countrySaleInstance,
});

class Dashboard extends Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    error: PropTypes.bool.isRequired,
    userName: PropTypes.string,
    userImage: PropTypes.string,
    handleAddGemsToDashboard: PropTypes.func.isRequired,
    web3: PropTypes.shape({}),
    transition: PropTypes.func.isRequired,
    match: PropTypes.shape({}),
    gems: PropTypes.shape({}),
    history: PropTypes.shape({}),
    sortBox: PropTypes.bool.isRequired,
    totalGems: PropTypes.number.isRequired,
    paginatedRedux: PropTypes.arrayOf(PropTypes.shape({})),
    handlePagination: PropTypes.func.isRequired,
    pageNumber: PropTypes.number,
    handlePreLoadAuctionPage: PropTypes.func.isRequired,
    machineState: PropTypes.shape({}),
    // loadingQL: PropTypes.shape({}).isRequired,
    // errorQL: PropTypes.shape({}).isRequired,
    data: PropTypes.shape({}).isRequired,
    preSaleContract: PropTypes.shape({}),
    CountrySale: PropTypes.shape({}),
  };

  static defaultProps = {
    userName: 'Loading...',
    userImage:
      'https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FAquamarine%20Face%20Emoji.png?alt=media&token=b759ae07-bb8c-4ec8-9399-d3844d5428ef',
    web3: {},
    match: {},
    gems: {},
    history: {},
    machineState: {},
    pageNumber: 1,
    preSaleContract: {},
    CountrySale: {},
    paginatedRedux: [{}],
  };

  state = {
    referralPoints: 0,
    plots: 0,
    tab: 1,
  };

  componentDidMount() {
    const { preSaleContract, match, data } = this.props;
    if (preSaleContract && preSaleContract.methods && match.params.userId !== 'false') {
      getReferralPoints(preSaleContract, match.params.userId)
        .then(referralPoints => this.setState({ referralPoints }))
        .catch(err => setError(err));
      getPlotCount(preSaleContract, match.params.userId)
        .then(plots => this.setState({ plots }))
        .catch(err => setError(err));
    }
    data.refetch();
    const country = window.location.hash;
    if (country) {
      this.setState({ tab: 2 });
    }
  }

  componentDidUpdate(prevProps) {
    const {
      web3, transition, preSaleContract, match,
    } = this.props;

    if (web3 !== prevProps.web3) {
      transition('WITH_METAMASK');
    }

    if (match.params.userId !== prevProps.match.params.userId) {
      transition('LOADING');
    }

    if (preSaleContract !== prevProps.preSaleContract && match.params.userId !== 'false') {
      getReferralPoints(preSaleContract, match.params.userId)
        .then(referralPoints => this.setState({ referralPoints }))
        .catch(err => setError(err));
      getPlotCount(preSaleContract, match.params.userId)
        .then(plots => this.setState({ plots }))
        .catch(err => setError(err));
    }
  }

  loadDataFromUrlIdentifier = () => {
    const { match, transition } = this.props;
    const userIdToLowerCase = match.params.userId
      .split('')
      .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
      .join('');

    const userDetails = db
      .doc(`users/${userIdToLowerCase}`)
      .get()
      .then(doc => doc.data());

    const userGems = db
      .collection('stones')
      .where('owner', '==', userIdToLowerCase)
      .orderBy('gradeType', 'desc')
      .get()
      .then(collection => collection.docs.map(doc => doc.data()));

    Promise.all([userDetails, userGems])
      .then(([userDeets, usersGems]) => transition('GOT_USER_GEMS', {
        gems: usersGems,
        userName: userDeets.name,
        userImage: userDeets.imageURL,
      }))
      .catch(error => transition('ERROR_FETCHING_GEMS', { error }));
  };

  checkForMetaMask = () => {
    const { web3, transition } = this.props;
    // console.log('web3', web3);
    if (web3 === undefined) {
      transition('NO_WEB3');
    }
    if (web3) {
      // console.log('web3', web3);
      transition('WITH_METAMASK');
    }
  };

  populateDashboard = () => {
    const { handleAddGemsToDashboard, gems } = this.props;
    handleAddGemsToDashboard(gems);
  };

  showError = () => {
    const { error, transition } = this.props;
    notification.error({
      message: 'Error',
      description: error,
      onClose: () => transition('RETURN_TO_MARKET'),
      duration: null,
    });
  };

  redirectToMarket = () => {
    const { history } = this.props;
    history.push('/market');
  };

  redeemCoupon = async (value, CountrySaleMethods, buyNow, markSold) => {
    CountrySaleMethods.methods
      .useCoupon(value)
      .send()
      .on('transactionHash', hash => console.log('hash', hash));

    await CountrySaleMethods.events
      .CouponConsumed()
      .on('data', (event) => {
        // which one is the tx receipt
        const {
          transactionHash, blockHash, signature, blockNumber, returnValues,
        } = event;

        console.log(
          'transactionHash, blockHash, signature, blockNumber',
          transactionHash,
          blockHash,
          signature,
          blockNumber,
        );

        console.log('event.rturnValues', returnValues);

        const { plots, _by, _tokenId } = returnValues;

        const newOwnerId = _by;
        const countryId = Number(_tokenId);
        const totalPlots = plots;

        console.log(
          'getCountryNameFromCountryId(countryId)',
          getCountryNameFromCountryId(countryId),
        );

        buyNow({
          variables: {
            id: getCountryNameFromCountryId(countryId),
            newOwnerId,
            price: 0,
            timeOfPurchase: Date.now(),
            totalPlots,
          },
        })
          .then(async () => {
            await markSold(getMapIndexFromCountryId(countryId));
            return true;

            // loading false
            // close modal
          })
          .catch((err) => {
            // setloading false
            // log error
            console.error(err);
          });
      })
      .on('error', console.error);
  };

  render() {
    const {
      loading,
      userName,
      userImage,
      sortBox,
      totalGems,
      paginatedRedux,
      handlePagination,
      pageNumber,
      handlePreLoadAuctionPage,
      data,
      match,
      CountrySale,
    } = this.props;

    const { plots, referralPoints, tab } = this.state;

    return (
      <div className="bg-off-black white card-container" data-testid="profile-page">
        <div className="flex  aic  wrap jcc jcb-ns pv4">
          <div className=" flex aic pt3 pt0-ns">
            <img src={userImage} className="h3 w-auto pr3 dib" alt="gem auctions" />
            <h1 className="white" data-testid="userName">
              {userName}
            </h1>
          </div>
          <div className="flex-ns dn col tc">
            <div className="flex">
              <div className="flex col tc">
                <img src={Gold} alt="Gold" className="h3 w-auto ph3" />
                Gold
              </div>
              <div className="flex col tc">
                <img src={Silver} alt="Silver" className="h3 w-auto ph3" />
                Silver
              </div>
            </div>
          </div>
        </div>

        <Tabs
          defaultActiveKey={tab}
          // size="large"
          animated
          className="bg-off-black white "
          tabBarExtraContent={(
            <div className="flex-ns dn">
              <Spring from={{ opacity: 0 }} to={{ opacity: 1 }} config={{ delay: 4000 }}>
                {props => (
                  <div style={props} className="pr4">
                    {referralPoints === '' ? (
                      <p data-testid="loadingReferralPoints" className="tr o-50">
                        Loading Referral Points...
                      </p>
                    ) : (
                      <small data-testid="referralPoints" className="tr fr o-50">
                        {`${referralPoints} REFERAL ${
                          referralPoints === 1 ? 'POINT' : 'POINTS'
                        } AVAILABLE `}
                      </small>
                    )}
                  </div>
                )}
              </Spring>
              <EnhancedCoupon handleRedemption={this.redeemCoupon} CountrySaleMethods={CountrySale}>
                Redeem Coupon
              </EnhancedCoupon>
              <ReSync />
            </div>
)}
          type="card"
        >
          <TabPane
            tab={(
              <span className="h-100 flex aic">
                <img src={Gem} alt="Gems" className="h2 w-auto pr2" />
                {totalGems || 0}
                {' '}
Gems
              </span>
)}
            key="1"
          >
            <Grid className="ph3">
              <Primary>
                <div className="flex jcb aic">
                  <GemSortBox />
                  {sortBox && <SortBox />}
                </div>
                <CardBox>
                  {loading && [1, 2, 3, 4, 5, 6].map(num => <LoadingCard key={num} />)}
                  {paginatedRedux && paginatedRedux.length > 0 ? (
                    paginatedRedux.map(auction => (
                      <Link
                        to={`/gem/${auction.id}`}
                        key={auction.id}
                        onClick={() => handlePreLoadAuctionPage(auction)}
                      >
                        <Cards auction={auction} />
                      </Link>
                    ))
                  ) : (
                    <NoCard />
                  )}
                </CardBox>
                <div className="white w-100 tc pv4">
                  <Pagination
                    current={pageNumber}
                    pageSize={15}
                    total={totalGems}
                    hideOnSinglePage
                    onChange={(page, pageSize) => {
                      window.scrollTo(0, 0);
                      handlePagination(page, pageSize);
                    }}
                  />
                </div>
              </Primary>
            </Grid>
          </TabPane>
          <TabPane
            tab={(
              <span
                className={`h-100 flex aic ${!(
                  data
                  && data.user
                  && data.user.countries.length >= 0
                ) && 'white o-50'}`}
              >
                <img src={Land} alt="" className="h2 w-auto pr2" />
                {// eslint-disable-next-line
                (data && data.user && data.user.countries.length) || 0}{' '}
                Countries
              </span>
)}
            // disabled={!(data && data.user && data.user.countries.length >= 0)}
            key="2"
          >
            <CountryDashboard
              countries={data && data.user && data.user.countries}
              userId={match.params.userId}
            />
          </TabPane>

          <TabPane
            tab={(
              <span className="h-100 flex aic white o-50">
                <img src={Artifact} alt="" className="h2 w-auto pr2" />
0 Artifacts
              </span>
)}
            disabled
            key="3"
          />

          <TabPane
            tab={(
              <span className="h-100 flex aic white o-50 ">
                <img src={Plot} alt="" className="h2 w-auto pr2" />
                {plots}
                {' '}
Plots
              </span>
)}
            disabled
            key="4"
          />

          <TabPane
            tab={(
              <span className="h-100 flex aic white o-50">
                <img src={Keys} alt="" className="h2 w-auto pr2" />
0 Keys
              </span>
)}
            disabled
            key="5"
          />
        </Tabs>
      </div>
    );
  }
}

const actions = {
  handleGetAuctions: getUserGemsOnce,
  handleGetUserDetails: getUserDetails,
  handleFilterUserGemsOnPageLoad: filterUserGemsOnPageLoad,
  handlePagination: paginate,
  handlePreLoadAuctionPage: preLoadAuctionPage,
  handleAddGemsToDashboard: addGemsToDashboard,
};

export default compose(
  withRouter,
  connect(
    select,
    actions,
  ),
  withStateMachine(stateMachine),
  graphql(USER_COUNTRIES, {
    options: props => ({
      variables: {
        id: props.match.params.userId,
      },
      // pollInterval: 500,
    }),
  }),
)(Dashboard);
