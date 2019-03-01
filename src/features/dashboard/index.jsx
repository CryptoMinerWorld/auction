import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Pagination from 'antd/lib/pagination';
import {withStateMachine} from 'react-automata';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {Link, Redirect, withRouter} from 'react-router-dom';
import notification from 'antd/lib/notification';
import Tabs from 'antd/lib/tabs';
import {Spring} from 'react-spring';
import {graphql} from 'react-apollo';
import Icon from 'antd/lib/icon';
import {db} from '../../app/utils/firebase';
import {setError} from '../../app/appActions';
import {
    addGemsToDashboard,
    filterUserGemsOnPageLoad, getImagesForGems, getUserCountries, getUserCountriesNumber,
    getUserDetails, getUserGems,
    paginate, useCoupon,
} from './dashboardActions';
import GemSortBox from './components/GemSortBox';
import Cards from './components/GemCard';
import LoadingCard from '../market/components/LoadingCard';
import NoCard from './components/NoCard';
import {preLoadAuctionPage} from '../market/marketActions';
import ReSync from './components/ResyncButton';
import SortBox from './components/SortBox';
import {
    getCountryDetailsFromFirebase,
    getCountryNameFromCountryId,
    getGemImage,
    getMapIndexFromCountryId,
    getNewReferralPoints,
    getPlotCount,
} from './helpers';
import stateMachine from './stateMachine';
import CountryDashboard from '../countries/components/Dashboard';
import {USER_COUNTRIES} from '../countries/queries';
import Gold from '../../app/images/dashboard/Gold.png';
import Silver from '../../app/images/dashboard/Silver.png';
import Gem from '../../app/images/dashboard/gems.png';
import Artifact from '../../app/images/dashboard/Artifacts.png';
import Keys from '../../app/images/dashboard/Keys.png';
import Land from '../../app/images/dashboard/Land.png';
import Plot from '../../app/images/dashboard/Plot.png';
import {EnhancedCoupon} from './components/Coupon';
import {completedTx, ErrorTx, startTx} from '../transactions/txActions';
import reduxStore from '../../app/store';
import Loading from "../../components/Loading";
import Spin from "antd/lib/spin";
import {getUserBalance} from "../sale/saleActions";

const {TabPane} = Tabs;

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

const select = store => {
    console.log('-------------> dashboard store <---------------', store);
    const res = {
        userGems: store.dashboard.userGems,
        totalGems: store.dashboard && store.dashboard.userGems && store.dashboard.userGems.length,
        userGemsFiltered: (store.dashboard.userGemsFiltered && store.dashboard.userGemsFiltered.length > 0) ?
          store.dashboard.userGemsFiltered :
          store.dashboard.userGems,
        userGemsPage: store.dashboard.userGemsPage ? store.dashboard.userGemsPage :
          (store.dashboard.userGemsFiltered && store.dashboard.userGemsFiltered.length > 0) ?
          store.dashboard.userGemsFiltered.slice(store.dashboard.start, store.dashboard.end) :
          store.dashboard.userGems.slice(store.dashboard.start, store.dashboard.end),
        pageNumber: store.dashboard.page,
        needToLoadImages: store.dashboard.updateImages,
        loading: store.dashboard.gemsLoading,
        error: store.dashboard.gemsLoadingError,
        currentUser: store.auth.user,
        userExists: store.auth.existingUser,
        //userName: store.auth.user && store.auth.user.name,
        //userImage: store.auth.user && store.auth.user.imageURL,
        userBalance: store.sale.balance,
        userCountries: store.dashboard.userCountries,
        sortBox: store.dashboard.sortBox,
        currentUserId: store.auth.currentUserId,
        web3: store.app.web3,
        preSaleContract: store.app.presaleContractInstance,
        refPointsContract: store.app.refPointsTrackerContractInstance,
        goldContract: store.app.goldContractInstance,
        silverContract: store.app.silverContractInstance,
        CountrySale: store.app.countrySaleInstance,
        currentAccount: store.app.currentAccount,
        gemService: store.app.gemServiceInstance,
        auctionService: store.app.auctionServiceInstance,
        silverGoldService: store.app.silverGoldServiceInstance,
        countryService: store.app.countryServiceInstance,
    };
    //console.log('dashboard store: ', res);
    return res;
}

class Dashboard extends Component {

    static propTypes = {
        loading: PropTypes.bool.isRequired,
        error: PropTypes.bool.isRequired,
        userName: PropTypes.string,
        userImage: PropTypes.string,
        handleAddGemsToDashboard: PropTypes.func.isRequired,
        web3: PropTypes.shape({}),
        match: PropTypes.shape({}),
        gems: PropTypes.shape({}),
        history: PropTypes.shape({}),
        sortBox: PropTypes.bool.isRequired,
        totalGems: PropTypes.number.isRequired,
        userGemsPage: PropTypes.arrayOf(PropTypes.shape({})),
        userGemsFiltered: PropTypes.arrayOf(PropTypes.shape({})),
        handlePagination: PropTypes.func.isRequired,
        pageNumber: PropTypes.number,
        handlePreLoadAuctionPage: PropTypes.func.isRequired,
        machineState: PropTypes.shape({}),
        preSaleContract: PropTypes.shape({}),
        refPointsContract: PropTypes.shape({}),
        goldContract: PropTypes.shape({}),
        silverContract: PropTypes.shape({}),
        CountrySale: PropTypes.shape({}),
    };

    static defaultProps = {
        //userImage:
          //'https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FAquamarine%20Face%20Emoji.png?alt=media&token=b759ae07-bb8c-4ec8-9399-d3844d5428ef',
        web3: {},
        match: {},
        gems: {},
        history: {},
        machineState: {},
        pageNumber: 1,
        CountrySale: {},
        userGemsPage: [],
        updateImages: true,
    };

    state = {
        //referralPoints:,
        plots: 0,
        dashboardUser: null,
        //silverAvailable: 'loading...',
        //goldAvailable: 'loading...',
        tab: 1,
        redirectPath: '',
        alreadyRedirected: false,
    };

    async componentDidMount() {

        console.log('PROPS is ', this.props);
        //referralTracker(this.props.location.search);

        this.setState({redirectPath: ''});

        const {preSaleContract, match, data, handleGetUserBalance, refPointsContract,
            goldContract, silverContract, handleGetUserGems, gemService, countryService,
            auctionService, silverGoldService, userExists, currentUserId, currentUser, handleShowSignInBox, handleGetUserCountries} = this.props;

        if (gemService && auctionService && match && match.params && match.params.userId)  {
            handleGetUserGems(match.params.userId);
        }

        if (countryService && match.params.userId) {
            handleGetUserCountries(match.params.userId);
        }

        if (preSaleContract && preSaleContract.methods && match.params.userId !== 'false') {
            // getReferralPoints(preSaleContract, match.params.userId)
            //   .then(referralPoints => referralPoints && this.setState({referralPoints}))
            //   .catch(err => setError(err));
            getPlotCount(preSaleContract, match.params.userId)
              .then(plots => plots && this.setState({plots}))
              .catch(err => setError(err));
        }

        if (silverGoldService) {
            handleGetUserBalance(match.params.userId);
        }

        if (userExists !== false) {
            if (match.params.userId && match.params.userId !== currentUserId) {
                const userDetails = await getUserDetails(match.params.userId);
                if (userDetails) {
                    this.setState({dashboardUser: userDetails});
                }
            }
            else {
                this.setState({dashboardUser: currentUser});
            }
        }
        else {
            if (match.params.userId) {
                const userDetails = await getUserDetails(match.params.userId);
                if (userDetails) {
                    this.setState({dashboardUser: userDetails});
                }
            }
            else {
                handleShowSignInBox();
            }
        }

        // if (silverGoldService) {
        //     const balance = await silverGoldService.getUserBalance(match.params.userId);
        //     this.setState({
        //         referralPoints: balance[0],
        //         silverAvailable: balance[1],
        //         goldAvailable: balance[2]
        //     });
        // }

        // if (refPointsContract && refPointsContract.methods && match.params.userId !== 'false') {
        //
        //     getNewReferralPoints(refPointsContract, match.params.userId)
        //       .then(referralPoints => referralPoints && this.setState({referralPoints}))
        //       .catch(err => setError(err));
        // }
        //
        // if (silverGoldService && goldContract && goldContract.methods && match.params.userId !== 'false') {
        //     const gold = await silverGoldService.getAvailableGold(match.params.userId);
        //     if (gold) {
        //         this.setState({goldAvailable: gold});
        //     }
        // }
        //
        // if (silverGoldService && silverContract && silverContract.methods && match.params.userId !== 'false') {
        //     const silver = await silverGoldService.getAvailableSilver(match.params.userId);
        //     if (silver) {
        //         this.setState({silverAvailable: silver});
        //     }
        // }

        //data.refetch();
        const country = window.location.hash.length;

        if (country > 0) {
            this.setState({tab: 2});
        }
    }

    async componentDidUpdate(prevProps) {

        console.log('DASHBOARD PROPS is ', this.props);
        console.log('DASHBOARD STATE is ', this.state);
        const {
            web3, transition, preSaleContract, match, refPointsContract, goldContract, silverContract,
            handleGetUserGems, handleGetUserDetails, handleGetImagesForGems, gemService, auctionService, silverGoldService, countryService, handleGetUserCountries,
          pageNumber, userGemsPage, userGemsFiltered, needToLoadImages, userBalance, handleGetUserBalance, currentUserId, userExists, currentUser,
          handleShowSignInBox
        } = this.props;

        const {
            silverAvailable, goldAvailable, referralPoints, imagesLoadingStarted, dashboardUser
        } = this.state;

        // if (!userImage || !userName) {
        //     if (match.params.userId && (match.params.userId !== currentUserId)) {
        //         handleGetUserDetails(match.params.userId);
        //     } else {
        //         this.
        //     }
        // }
        if ((userExists !== prevProps.userExists) || (match.params.userId !== prevProps.match.params.userId)) {
            console.log('CHECK EXISTS:', userExists);
            if (userExists) {
                if (match.params.userId && match.params.userId !== currentUserId) {
                    const userDetails = await getUserDetails(match.params.userId);
                    if (userDetails) {
                        this.setState({dashboardUser: userDetails});
                    }
                }
                else {
                    this.setState({dashboardUser: currentUser});
                }
            }
            else {
                if (match.params.userId) {
                    console.log('match.params.userId:', match.params.userId);
                    const userDetails = await getUserDetails(match.params.userId);
                    console.log('user details:', userDetails);
                    if (userDetails) {
                        this.setState({dashboardUser: userDetails});
                    }
                }
                else {
                    handleShowSignInBox();
                }
            }
        }

        if (!needToLoadImages && imagesLoadingStarted) {
            this.setState({imagesLoadingStarted: false});
        }

        //console.log('111 props: ', this.props, prevProps);
        //console.log('111 state: ', this.state);
        if (web3 !== prevProps.web3) {
            //transition('WITH_METAMASK');
        }

        if (gemService && auctionService &&
          (gemService !== prevProps.gemService || auctionService !== prevProps.auctionService || match.params.userId !== prevProps.match.params.userId))  {
            console.warn('HANDLE GET USER GEMS <<<<<<<<<<<<<');
            this.setState({imagesLoadingStarted: false});
            handleGetUserGems(match.params.userId);
        }

        if (!imagesLoadingStarted && gemService && userGemsPage && (userGemsPage.length > 0) && (needToLoadImages || pageNumber !== prevProps.pageNumber)) {
            //console.log('GET IMAGES! 1');
            this.setState({imagesLoadingStarted: true});
            //console.log('GET IMAGES! 2');
            handleGetImagesForGems(userGemsPage);
        }

        if (preSaleContract !== prevProps.preSaleContract && match.params.userId !== 'false') {
            // getReferralPoints(preSaleContract, match.params.userId)
            //   .then(referralPoints => this.setState({referralPoints}))
            //   .catch(err => setError(err));
            getPlotCount(preSaleContract, match.params.userId)
              .then(plots => this.setState({plots}))
              .catch(err => setError(err));
        }

        //may cause infinite updating: (silverGoldService && !userBalance) ||
        if ((silverGoldService !== prevProps.silverGoldService) || match.params.userId !== prevProps.match.params.userId) {
            handleGetUserBalance(match.params.userId);
        }

        if ((countryService !== prevProps.countryService) || match.params.userId !== prevProps.match.params.userId) {
            handleGetUserCountries(match.params.userId);
        }

        // if (silverGoldService && !(silverAvailable && goldAvailable && referralPoints) || (silverGoldService !== prevProps.silverGoldService)) {
        //     const balance = await silverGoldService.getUserBalance(match.params.userId);
        //     this.setState({
        //         referralPoints: balance[0],
        //         silverAvailable: balance[1],
        //         goldAvailable: balance[2]
        //     });
        // }
        //
        // if (refPointsContract !== prevProps.refPointsContract && match.params.userId !== 'false') {
        //     getNewReferralPoints(refPointsContract, match.params.userId)
        //       .then(referralPoints => referralPoints && this.setState({referralPoints}))
        //       .catch(err => setError(err));
        // }
        //
        // if (silverGoldService !== prevProps.silverGoldService && match.params.userId !== 'false') {
        //     const gold = await silverGoldService.getAvailableGold(match.params.userId);
        //     if (gold) {
        //         this.setState({goldAvailable: gold});
        //     }
        // }
        //
        // if (silverGoldService !== prevProps.silverGoldService && match.params.userId !== 'false') {
        //     const silver = await silverGoldService.getAvailableSilver(match.params.userId);
        //     if (silver) {
        //         this.setState({silverAvailable: silver});
        //     }
        // }
    }

    populateDashboard = () => {
        const {handleAddGemsToDashboard, userGemsFiltered} = this.props;
        handleAddGemsToDashboard(userGemsFiltered);
    };

    checkForMetaMask = () => {
        const {web3, transition} = this.props;
        if (web3 === undefined) {
            transition('NO_WEB3');
        }
        if (web3) {
            transition('WITH_METAMASK');
        }
    };

    showError = () => {
        const {error, transition} = this.props;
        notification.error({
            message: 'Error',
            description: error,
            onClose: () => transition('RETURN_TO_MARKET'),
            duration: null,
        });
    };

    redirectToMarket = () => {
        const {history} = this.props;
        history.push('/market');
    };

    //unused
    //todo: refactor
    // redeemCoupon = async (
    //   value,
    //   CountrySaleMethods,
    //   buyNow,
    //   markSold,
    //   setloading,
    //   showModal,
    //   // redirect,
    // ) => {
    //     const {data} = this.props;
    //     CountrySaleMethods.methods
    //       .useCoupon(value)
    //       .send()
    //       .on('transactionHash', hash => reduxStore.dispatch(
    //         startTx({
    //             hash,
    //             method: 'country',
    //         }),
    //       ));
    //
    //     await CountrySaleMethods.events
    //       .CouponConsumed()
    //       .on('data', async (event) => {
    //
    //           const {returnValues} = event;
    //           const {plots, _by, _tokenId} = returnValues;
    //           const newOwnerId = _by
    //             .split('')
    //             .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
    //             .join('');
    //           const countryId = Number(_tokenId);
    //           const totalPlots = Number(plots);
    //           const countryMapIndex = getMapIndexFromCountryId(countryId);
    //           const country = await getCountryDetailsFromFirebase(countryMapIndex);
    //
    //           buyNow({
    //               variables: {
    //                   id: getCountryNameFromCountryId(countryId),
    //                   newOwnerId,
    //                   price: 0,
    //                   timeOfPurchase: Date.now(),
    //                   totalPlots,
    //                   imageLinkLarge: country.imageLinkLarge,
    //                   imageLinkMedium: country.imageLinkMedium,
    //                   imageLinkSmall: country.imageLinkSmall,
    //                   countryId: country.countryId,
    //                   mapIndex: country.mapIndex,
    //                   roi: country.roi,
    //               },
    //           })
    //             .then(async () => {
    //                 await markSold(getMapIndexFromCountryId(countryId));
    //                 return getCountryNameFromCountryId(countryId);
    //             })
    //             .then(async () => {
    //                 // async (countryName) => {
    //                 setloading(false);
    //                 showModal(false);
    //                 await data.refetch();
    //                 reduxStore.dispatch(completedTx(event));
    //                 // redirect(`/profile/${newOwnerId}#${countryName}`);
    //             })
    //             .catch(err => reduxStore.dispatch(ErrorTx(err)));
    //       })
    //       .on('error', error => reduxStore.dispatch(ErrorTx(error)));
    // };

    redirect = redirectPath => this.setState({redirectPath});

    render() {

        //console.log('---------- DASHBOARD --------------');

        const {
            loading,
            //userName,
            //userImage,
            sortBox,
            totalGems,
            userGemsPage,
          userGemsFiltered,
            handlePagination,
            pageNumber,
            handlePreLoadAuctionPage,
            data,
            match,
            CountrySale,
          userBalance,
          handleUseCoupon,
          userExists,
          userCountries
        } = this.props;

        const {
            plots, tab, redirectPath, alreadyRedirected, dashboardUser
        } = this.state;
        if (redirectPath && !alreadyRedirected) {
            this.setState({alreadyRedirected: true});
            return <Redirect to={`${redirectPath}`}/>;
        }

        //console.log('USER GEMS PAGE:', userGemsPage);

        return (
          <div className="bg-off-black white card-container" data-testid="profile-page">
              <div className="flex  aic  wrap jcc jcb-ns pv4">
                  <div className=" flex aic pt3 pt0-ns">
                      {dashboardUser && dashboardUser.imageURL ? <img src={dashboardUser.imageURL} className="h3 w-auto pr3 pl3-ns dib" alt=""/> :
                        <Spin indicator={
                          <Icon type="loading" style={{ fontSize: 24, color: '#e406a5' }} spin />}
                        />
                      }
                      <h1 className="white" data-testid="userName">
                          {dashboardUser && dashboardUser.name || "Loading..."}
                      </h1>
                  </div>
                  <div className="flex-ns dn col tc">
                          <div className="flex">
                              <div className="flex col tc">
                                  <img src={Gold} alt="Gold" className="h3 w-auto ph3"/>
                                  {userBalance && userBalance.goldAvailable}
                              </div>
                              <div className="flex col tc">
                                  <img src={Silver} alt="Silver" className="h3 w-auto ph3"/>
                                  {userBalance && userBalance.silverAvailable}
                              </div>
                          </div>
                  </div>
              </div>

              <Tabs
                activeKey={`${tab}`}
                animated
                className="bg-off-black white"
                tabBarExtraContent={(
                  <div className="flex-ns dn">
                      <Spring from={{opacity: 0}} to={{opacity: 1}} config={{delay: 4000}}>
                          {props => (
                            <div style={props} className="pr4">
                                {!userBalance ? (
                                  <p data-testid="loadingReferralPoints" className="tr o-50 white">
                                      Loading Referral Points...
                                  </p>
                                ) : (
                                  <small data-testid="referralPoints" className="tr fr o-50 white">
                                      {`${userBalance.referralPoints} REFERRAL ${
                                        userBalance.referralPoints === 1 ? 'POINT' : 'POINTS'
                                        } AVAILABLE `}
                                  </small>
                                )}
                            </div>
                          )}
                      </Spring>
                      {userExists &&
                      <EnhancedCoupon
                        handleRedemption={handleUseCoupon}
                        redirect={this.redirect}
                        //userId={data && data.userId}
                      >
                          Redeem Coupon
                      </EnhancedCoupon>
                      }
                      {/*{tab === 1 && <ReSync/>}*/}
                  </div>
                )}
                type="card"
              >
                  <TabPane
                    tab={(
                      <span
                        tabIndex={-1}
                        role="button"
                        onKeyPress={() => this.setState({tab: 1})}
                        className="h-100 flex aic"
                        onClick={() => this.setState({tab: 1})}
                      >
                <img src={Gem} alt="Gems" className="h2 w-auto pr2"/>
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
                                  <GemSortBox/>
                                  {sortBox && <SortBox/>}
                              </div>
                              <CardBox>
                                  {loading && [1, 2, 3, 4, 5, 6].map(num => <LoadingCard key={num}/>)}
                                  {!loading && userGemsPage && userGemsPage.length > 0 ? (
                                    userGemsPage.map(userGem => {
                                        //console.log('USER GEM: ', userGem);
                                        return (
                                      <Link
                                        to={`/gem/${userGem.id}`}
                                        key={userGem.id}
                                        onClick={() => handlePreLoadAuctionPage(userGem)}
                                      >
                                          <Cards auction={userGem}/>
                                      </Link>
                                    )})
                                  ) :
                                    !loading ? <NoCard/> : ""
                                  }
                              </CardBox>
                              <div className="white w-100 tc pv4">
                                  <Pagination
                                    current={pageNumber}
                                    pageSize={15}
                                    total={userGemsFiltered.length}
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
                        tabIndex={-2}
                        onKeyPress={() => this.setState({tab: 2})}
                        role="button"
                        onClick={() => this.setState({tab: 2})}
                        className={`h-100 flex aic white ${!(
                          userCountries
                        ) && ' o-50'}`}
                      >
                <img src={Land} alt="" className="h2 w-auto pr2"/>
                          {// eslint-disable-next-line
                              !userCountries ? (
                                <Icon type="loading" theme="outlined"/>
                              ) : userCountries.length
                          }
                          {' '}
                          Countries
              </span>
                    )}
                    disabled={
                        !(userCountries)
                        || userCountries.length === 0
                    }

                    key="2"
                  >
                      <CountryDashboard
                        userCountryIdList={userCountries}
                        userId={match.params.userId}
                      />
                  </TabPane>

                  <TabPane
                    tab={(
                      <span className="h-100 flex aic white o-50">
                <img src={Artifact} alt="" className="h2 w-auto pr2"/>
0 Artifacts
              </span>
                    )}
                    disabled
                    key="3"
                  />

                  <TabPane
                    tab={(
                      <span className="h-100 flex aic white o-50 ">
                <img src={Plot} alt="" className="h2 w-auto pr2"/>
                          {/*{plots}*/}
                          {/*{' '}*/}
                          0 Plots
              </span>
                    )}
                    disabled
                    key="4"
                  />

                  <TabPane
                    tab={(
                      <span className="h-100 flex aic white o-50">
                <img src={Keys} alt="" className="h2 w-auto pr2"/>
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
    handleGetUserGems: getUserGems,
    handleGetUserDetails: getUserDetails,
    handleFilterUserGemsOnPageLoad: filterUserGemsOnPageLoad,
    handlePagination: paginate,
    handlePreLoadAuctionPage: preLoadAuctionPage,
    handleAddGemsToDashboard: addGemsToDashboard,
    handleGetImagesForGems: getImagesForGems,
    handleGetUserBalance: getUserBalance,
    handleUseCoupon: useCoupon,
    handleShowSignInBox: () => ({ type: 'SHOW_SIGN_IN_BOX' }),
    handleGetUserCountries: getUserCountries,
};

export default compose(
  withRouter,
  connect(
    select,
    actions,
  ),
  // graphql(USER_COUNTRIES, {
  //     options: props => ({
  //         variables: {
  //             id: props.match.params.userId
  //               .split('')
  //               .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
  //               .join(''),
  //         },
  //     }),
  // }),
  //withStateMachine(stateMachine),
)(Dashboard);
