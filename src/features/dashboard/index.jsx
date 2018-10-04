import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Auth from '../auth';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter, Link } from 'react-router-dom';
import { lifecycle } from 'recompose';
import {
  getUserGemsOnce,
  getUserDetails,
  filterUserGemsOnPageLoad
} from './dashboardActions';
import GemSortBox from './components/GemSortBox';
import Cards from './components/GemCard';
import LoadingCard from '../market/components/LoadingCard';
import NoCard from './components/NoCard';
import { redirectedHome } from '../market/marketActions';
import ReSync from './components/ResyncButton';
import SortBox from './components/SortBox';
require('antd/lib/slider/style/css');

const Grid = styled.article`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-column-gap: 20px;
`;

const CardBox = styled.section`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-column-gap: 20px;
  grid-row-gap: 20px;
`;

const Primary = styled.section`
  grid-column-start: span 5;
  width: 100%;
`;

const select = store => ({
  auctions: store.dashboard.filter,
  loading: store.dashboard.gemsLoading,
  error: store.dashboard.gemsLoadingError,
  userName: store.dashboard.userDetails && store.dashboard.userDetails.name,
  userImage:
    store.dashboard.userDetails && store.dashboard.userDetails.imageURL,
  redirectToHome: store.auth.redirectToHome,
  newUser: store.auth.newUser,
  sortBox: store.dashboard.sortBox
});

// @notice the username name and image is also stored on every gem object so I render whichever one shows up first, the reason I make two calls is because not every users has gems

const Dashboard = ({
  auctions,
  loading,
  error,
  userName,
  userImage,
  newUser,
  sortBox
}) => {
  if (error) {
    return <div>Error! {error.message}</div>;
  }

  return (
    <div className="bg-off-black white pa4">
      {newUser && <Auth />}
      <div className="flex jcb aic  mt3">
        <div className=" flex aic">
          <img
            src={userImage || auctions[0].userImage}
            className="h3 w-auto pr3 dib"
            alt="gem auctions"
          />
          <h1 className="white" data-testid="header">
            {`${userName || auctions[0].userName}'s Dashboard`}
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
            {auctions && auctions.length > 0 ? (
              auctions.map(auction => (
                <Link to={`/gem/${auction.id}`} key={auction.id}>
                  <Cards auction={auction} />
                </Link>
              ))
            ) : (
              <NoCard />
            )}
          </CardBox>
          {/* <p>pagination</p> */}
        </Primary>
      </Grid>
    </div>
  );
};

const actions = {
  handleGetAuctions: getUserGemsOnce,
  handleGetUserDetails: getUserDetails,
  handleRedirectedHome: redirectedHome,
  handleFilterUserGemsOnPageLoad: filterUserGemsOnPageLoad
};

export default compose(
  connect(
    select,
    actions
  ),
  withRouter,
  lifecycle({
    componentDidMount() {
      this.props.handleGetAuctions(this.props.match.params.userId);
      this.props.handleGetUserDetails(this.props.match.params.userId);
    },
    componentDidUpdate() {
      if (this.props.redirectToHome) {
        this.props.history.push('/');
      }
    }
  })
)(Dashboard);

Dashboard.propTypes = {
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
  userImage: PropTypes.string
};

Dashboard.defaultProps = {
  auctions: [
    {
      id: 1,
      minPrice: 0,
      maxPrice: 1,
      price: 0.5,
      deadline: 1548390590016,
      image:
        'https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FAquamarine%20Face%20Emoji.png?alt=media&token=b759ae07-bb8c-4ec8-9399-d3844d5428ef',
      owner: 'Someone',
      gradeType: 1,
      quality: 1,
      rate: 1
    }
  ],
  userName: 'Someone',
  userImage:
    'https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FAquamarine%20Face%20Emoji.png?alt=media&token=b759ae07-bb8c-4ec8-9399-d3844d5428ef'
};
