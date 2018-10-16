import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { db } from '../../app/utils/firebase';
import styled from 'styled-components';
import Pagination from 'antd/lib/pagination';
import { withStateMachine } from 'react-automata';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter, Link } from 'react-router-dom';
import { matchesState } from 'xstate';
import {
  getUserGemsOnce,
  getUserDetails,
  filterUserGemsOnPageLoad,
  paginate,
  addGemsToDashboard
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
import { stateMachine } from './stateMachine';
import notification from 'antd/lib/notification';
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
  totalGems:
    store.dashboard &&
    store.dashboard.userGems &&
    store.dashboard.userGems.length,
  auctions: store.dashboard.filter,
  paginated: store.dashboard &&
    store.dashboard.filter && [
      ...store.dashboard.filter.slice(
        store.dashboard.start,
        store.dashboard.end
      )
    ],
  pageNumber: store.dashboard.page,
  loading: store.dashboard.gemsLoading,
  error: store.dashboard.gemsLoadingError,
  userName: store.dashboard.userDetails && store.dashboard.userDetails.name,
  userImage:
    store.dashboard.userDetails && store.dashboard.userDetails.imageURL,
  sortBox: store.dashboard.sortBox,
  currentUserId: store.auth.currentUserId,
  web3: store.app.web3
});

class Dashboard extends Component {
  static propTypes = {
    auctions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        minPrice: PropTypes.number,
        maxPrice: PropTypes.number,
        price: PropTypes.number,
        deadline: PropTypes.oneOfType([
          PropTypes.shape({
            seconds: PropTypes.number
          }),
          PropTypes.number
        ]),
        image: PropTypes.string,
        owner: PropTypes.string,
        gradeType: PropTypes.number,
        quality: PropTypes.number,
        rate: PropTypes.number
      })
    ),
    loading: PropTypes.bool.isRequired,
    error: PropTypes.bool.isRequired,
    userName: PropTypes.string,
    userImage: PropTypes.string,
    handleAddGemsToDashboard: PropTypes.func.isRequired
  };

  static defaultProps = {
    auctions: [
      {
        id: 1,
        minPrice: 0,
        maxPrice: 1,
        price: 0.5,
        deadline: 1548390590016,
        image:
          'https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FAquamarine%20Face%20Emoji.png?alt=media&token=b759ae07-bb8c-4ec8-9399-d3844d5428ef',
        owner: 'User',
        gradeType: 1,
        quality: 1,
        rate: 1
      }
    ],
    userName: 'Loading...',
    userImage:
      'https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FAquamarine%20Face%20Emoji.png?alt=media&token=b759ae07-bb8c-4ec8-9399-d3844d5428ef'
  };

  // componentDidMount() {
  //   const { match } = this.props;

  //   // // this.props.handleGetAuctions(this.props.currentUserId);
  //   // this.props.handleGetAuctions(match.params.userId);
  //   // // this.props.handleGetUserDetails(this.props.currentUserId);
  //   // this.props.handleGetUserDetails(match.params.userId);
  //   // this.props.handlePagination(1, 14);
  // }

  componentDidUpdate(prevProps) {
    const { web3, transition, match } = this.props;
    if (web3 !== prevProps.web3) {
      transition('WITH_METAMASK');
    }

    if (match.params.userId !== prevProps.match.params.userId) {
      console.log('userId changed');
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
      .then(doc => {
        return doc.data();
      });

    const userGems = db
      .collection('stones')
      .where('owner', '==', userIdToLowerCase)
      .orderBy('gradeType', 'desc')
      .get()
      .then(collection => collection.docs.map(doc => doc.data()));

    Promise.all([userDetails, userGems])
      .then(([userDetails, userGems]) =>
        transition('GOT_USER_GEMS', {
          gems: userGems,
          userName: userDetails.name,
          userImage: userDetails.imageURL
        })
      )
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
      duration: null
    });
  };

  redirectToMarket = () => {
    console.log('redirect');
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
      machineState
    } = this.props;

    return (
      <div className="bg-off-black white pa4">
        {matchesState('withMetamask', machineState.value) && (
          <AuctionCategories
            gemCount={totalGems}
            getReferralPoints={getReferralPoints}
            getPlotCount={getPlotCount}
          />
        )}

        <div className="flex  aic mt3 wrap jcc jcb-ns">
          <div className=" flex aic">
            <img
              src={userImage}
              className="h3 w-auto pr3 dib"
              alt="gem auctions"
            />
            <h1 className="white" data-testid="header">
              {userName}
            </h1>
          </div>
          <ReSync />
        </div>
        <Grid>
          <Primary>
            <div className="flex jcb aic">
              <GemSortBox />
              {sortBox && <SortBox />}
            </div>
            <CardBox>
              {loading &&
                [1, 2, 3, 4, 5, 6].map(num => <LoadingCard key={num} />)}
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
  handleAddGemsToDashboard: addGemsToDashboard
};

export default compose(
  withRouter,
  connect(
    select,
    actions
  ),
  withStateMachine(stateMachine)
)(Dashboard);
