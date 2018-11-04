import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Pagination from 'antd/lib/pagination';
import { withStateMachine } from 'react-automata';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter, Link } from 'react-router-dom';
import { matchesState } from 'xstate';
import notification from 'antd/lib/notification';
import Tabs from 'antd/lib/tabs';
import { Transition, config } from 'react-spring';
import { graphql } from 'react-apollo';
import { db } from '../../app/utils/firebase';
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
import AuctionCategories from './components/AuctionCategories';
import { getReferralPoints, getPlotCount } from './helpers';
import stateMachine from './stateMachine';
import CountryDashboard from '../countries/components/Dashboard';
import { USER_COUNTRIES } from '../countries/queries';

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
  paginated: store.dashboard
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
    gems: PropTypes.shape([]),
    history: PropTypes.shape({}),
    sortBox: PropTypes.func.isRequired,
    totalGems: PropTypes.number.isRequired,
    paginated: PropTypes.bool.isRequired,
    handlePagination: PropTypes.func.isRequired,
    pageNumber: PropTypes.number.isRequired,
    handlePreLoadAuctionPage: PropTypes.func.isRequired,
    machineState: PropTypes.shape({}),
    loadingQL: PropTypes.shape({}).isRequired,
    errorQL: PropTypes.shape({}).isRequired,
    data: PropTypes.shape({}).isRequired,

  };

  static defaultProps = {
    userName: 'Loading...',
    userImage:
      'https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FAquamarine%20Face%20Emoji.png?alt=media&token=b759ae07-bb8c-4ec8-9399-d3844d5428ef',
    web3: {},
    match: {},
    gems: [],
    history: {},
    machineState: {},
  };

  componentDidUpdate(prevProps) {
    const { web3, transition, match } = this.props;

    if (web3 !== prevProps.web3) {
      transition('WITH_METAMASK');
    }

    if (match.params.userId !== prevProps.match.params.userId) {
      transition('LOADING');
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

  render() {
    const {
      loading,
      userName,
      userImage,
      sortBox,
      totalGems,
      paginated,
      handlePagination,
      pageNumber,
      handlePreLoadAuctionPage,
      machineState,
      data,
    } = this.props;

    return (
      <div className="bg-off-black white ph4" data-testid="profile-page">
        <Transition
          from={{ transform: 'translate3d(0,-200px,0)' }}
          enter={{ transform: 'translate3d(0,0px,0)' }}
          config={config.molasses}
        >
          {props => (
            <div style={props}>
              {matchesState('withMetamask', machineState.value) && (
                <AuctionCategories
                  gemCount={totalGems}
                  getReferralPoints={getReferralPoints}
                  getPlotCount={getPlotCount}
                />
              )}
            </div>
          )}
        </Transition>

        <div className="flex  aic mt3 wrap jcc jcb-ns">
          <div className=" flex aic">
            <img src={userImage} className="h3 w-auto pr3 dib" alt="gem auctions" />
            <h1 className="white" data-testid="userName">
              {userName}
            </h1>
          </div>
        </div>

        <Tabs
          defaultActiveKey="2"
          size="large"
          animated
          className="bg-off-black white "
          tabBarExtraContent={<ReSync />}
        >
          <TabPane tab="Gems" key="1">
            <Grid>
              <Primary>
                <div className="flex jcb aic">
                  <GemSortBox />
                  {sortBox && <SortBox />}
                </div>
                <CardBox>
                  {loading && [1, 2, 3, 4, 5, 6].map(num => <LoadingCard key={num} />)}
                  {paginated && paginated.length > 0 ? (
                    paginated.map(auction => (
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
          <TabPane tab="Countries" key="2">
            <CountryDashboard countries={data && data.user && data.user.countries} />

            {/* web3: false,
    countries: [],
    account: false, */}
          </TabPane>
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

// const EnhancedDashboard = props => (
//   <Query query={USER_COUNTRIES}>
//     {({ loading, error, data }) => (
//       <Dashboard {...props} data={data} loadingQL={loading} errorQL={error} />
//     )}
//   </Query>
// );

export default compose(
  withRouter,
  connect(
    select,
    actions,
  ),
  withStateMachine(stateMachine),
  graphql(USER_COUNTRIES, {
    options:
      // props
      () => ({
        variables: {
          id: '0xd9b74f73d933fde459766f74400971b29b90c9d2',
          // props.userId &&
          // props.userId
          //   .split('')
          //   .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
          //   .join(''),
        },
      }),
  }),
)(Dashboard);
