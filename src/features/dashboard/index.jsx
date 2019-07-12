import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {Redirect, withRouter} from 'react-router-dom';
import notification from 'antd/lib/notification';
import Tabs from 'antd/lib/tabs';
import {Spring} from 'react-spring';
import Icon from 'antd/lib/icon';
import {
    addGemsToDashboard,
    filterUserGemsOnPageLoad,
    getUserArtifacts,
    getUserCountries,
    getUserCountriesNumber,
    getUserDetails,
    getUserGems,
    scrollGems,
    useCoupon,
    withdrawCountryEth,
} from './dashboardActions';
import {preLoadAuctionPage} from '../market/marketActions';
import CountryDashboard from '../countries/components/Dashboard';
import Gold from '../../app/images/dashboard/Gold.png';
import Silver from '../../app/images/dashboard/Silver.png';
import Gem from '../../app/images/dashboard/gems.png';
import Artifact from '../../app/images/dashboard/Artifacts.png';
import Keys from '../../app/images/dashboard/Keys.png';
import Land from '../../app/images/dashboard/Land.png';
import Plot from '../../app/images/dashboard/Plot.png';
import {EnhancedCoupon} from './components/Coupon';
import Loading from "../../components/Loading";
import Spin from "antd/lib/spin";
import {getUserBalance} from "../sale/saleActions";
import PlotDashboard from "../plots";
import {getUserPlots, refreshUserPlot} from "../plots/plotActions";
import {setDashboardEventListeners} from "./dashboardEventListener";
import GemDashboard from "./components/GemDashboard";
import {getAvailableCountryPlots} from "../plotsale/plotSaleActions";
import {USER_PLOTS_RELOAD_BEGUN} from "../plots/plotConstants";
import {COUNTRY_WITHDRAW} from "./dashboardConstants";


const {TabPane} = Tabs;

require('antd/lib/tabs/style/css');
require('antd/lib/notification/style/css');
require('antd/lib/pagination/style/css');
require('antd/lib/slider/style/css');


const RedeemCoupon = styled.div`
    @media(min-width: 900px) {
        margin-right: 190px;
    }
    @media(max-width: 700px) {
        display: none !important;
    }
`;

const SilverGoldBalance = styled.div`
    @media(min-width: 900px) {
        position: absolute;
        right: 0;
        top: 15px;
        z-index: 2;
    }
`;


const select = store => ({
    dataLoaded: {
        plots: store.plots.plotsLoaded,
        gems: store.dashboard.gemsLoaded,
    },
    dataRefreshed: store.dashboard.dataRefreshed,
    userPlots: store.plots.userPlots,
    userGems: store.dashboard.userGems,
    totalGems: store.dashboard && store.dashboard.userGems && store.dashboard.userGems.length,
    userGemsFiltered: (store.dashboard.userGemsFiltered && store.dashboard.userGemsFiltered.length >= 0) ?
      store.dashboard.userGemsFiltered :
      store.dashboard.userGems,
    userGemsScrolled: store.dashboard.userGemsScrolled ? store.dashboard.userGemsScrolled :
      (store.dashboard.userGemsFiltered && store.dashboard.userGemsFiltered.length >= 0) ?
        store.dashboard.userGemsFiltered.slice(0, store.dashboard.end) :
        store.dashboard.userGems.slice(0, store.dashboard.end),
    hasMoreGems: store.dashboard.hasMoreGems,
    pageNumber: store.dashboard.page,
    error: store.dashboard.gemsLoadingError,
    currentUser: store.auth.user,
    transactionHistory: store.tx.transactionHistory,
    pendingTransactions: store.tx.pendingTransactions,
    userExists: store.auth.existingUser,
    userBalance: store.sale.balance,
    userCountries: store.dashboard.userCountries,
    countriesNotWithdrawnEth: store.dashboard.countriesNotWithdrawnEth,
    userArtifacts: store.dashboard.userArtifacts,
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
    plotService: store.app.plotServiceInstance,
    artifactContract: store.app.artifactContractInstance,
});

class Dashboard extends Component {

    static propTypes = {
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
        userGemsScrolled: [],
        hasMoreGems: false,
        updateImages: true,
    };

    state = {
        dashboardUser: null,
        tab: 1,
        redirectPath: '',
        alreadyRedirected: false,
        eventSubscriptions: [],
    };

    clearSubscriptions = () => {
        this.state.eventSubscriptions.forEach((subscription) => {
            console.log("subscription unsubscribe:", subscription);
            subscription.unsubscribe();
        })
    };

    async componentDidMount() {

        console.log('PROPS is ', this.props);

        this.setState({redirectPath: ''});

        const {
            pendingTransactions,
            preSaleContract, match, data, handleGetUserBalance, handleGetUserGems, gemService, countryService, plotService, handleGetUserPlots, handleRefreshUserPlot,
            handleTransactionResolved,
            auctionService, silverGoldService, userExists, currentUserId, currentUser, handleShowSignInBox, handleGetUserCountries, handleGetUserArtifacts, artifactContract
        } = this.props;

        if (gemService && auctionService && match && match.params && match.params.userId) {
            handleGetUserGems(match.params.userId);
        }

        if (countryService && match.params.userId) {
            handleGetUserCountries(match.params.userId);
        }

        if (artifactContract && match.params.userId) {
            handleGetUserArtifacts(match.params.userId);
        }

        if (plotService) {
            console.log("DASHBOARD PROPS PENDING TRANSACTION (1):", pendingTransactions);
            if (handleRefreshUserPlot && gemService && currentUserId) {
                setDashboardEventListeners({
                    plotService,
                    gemService,
                    updatedEventCallback: (plot) => {
                        handleRefreshUserPlot(plot);
                        handleGetUserBalance(currentUserId)
                    },
                    releasedEventCallback: handleRefreshUserPlot,
                    boundEventCallback: handleRefreshUserPlot,
                    issuedEventCallback: handleGetUserPlots,
                    reloadGemsCallback: handleGetUserGems,
                    countryBalanceUpdatedCallback: handleGetUserCountries,
                    changeGemCallback: () => {
                        handleGetUserGems(currentUserId)
                    },
                    currentUserId,
                });
            }

            if (pendingTransactions && currentUserId) {
                handleGetUserPlots(match.params.userId);
            }
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
    }

    async componentDidUpdate(prevProps) {

        console.log('DASHBOARD PROPS is ', this.props);
        console.log('DASHBOARD STATE is ', this.state);
        const {
            pendingTransactions,
            web3, preSaleContract, match,
            handleGetUserGems, gemService, auctionService, silverGoldService, countryService, plotService, handleGetUserPlots, handleGetUserCountries,
            handleGetUserBalance, currentUserId, userExists, currentUser, artifactContract, handleGetUserArtifacts, handleRefreshUserPlot,
            handleShowSignInBox, handlePlotsReloadBegun
        } = this.props;

        if ((userExists !== prevProps.userExists) || (match.params.userId !== prevProps.match.params.userId)) {
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
                    const userDetails = await getUserDetails(match.params.userId);
                    if (userDetails) {
                        this.setState({dashboardUser: userDetails});
                    }
                }
                else {
                    handleShowSignInBox();
                }
            }
        }

        if (gemService && auctionService &&
          (gemService !== prevProps.gemService || auctionService !== prevProps.auctionService || match.params.userId !== prevProps.match.params.userId)) {
            handleGetUserGems(match.params.userId);
        }

        if (plotService && handleRefreshUserPlot && currentUserId &&
          (plotService !== prevProps.plotService || match.params.userId !== prevProps.match.params.userId)) {
            setDashboardEventListeners({
                plotService,
                gemService,
                updatedEventCallback: (plot) => {
                    handleRefreshUserPlot(plot);
                    handleGetUserBalance(currentUserId)
                },
                releasedEventCallback: handleRefreshUserPlot,
                boundEventCallback: handleRefreshUserPlot,
                issuedEventCallback: handleGetUserPlots,
                reloadGemsCallback: handleGetUserGems,
                countryBalanceUpdatedCallback: handleGetUserCountries,
                changeGemCallback: () => {
                    handleGetUserGems(currentUserId)
                },
                currentUserId,
            });
        }


        if (plotService && pendingTransactions && currentUserId && match.params.userId &&
          (pendingTransactions !== prevProps.pendingTransactions)) {
            handleGetUserPlots(match.params.userId);
        }

        if (plotService && pendingTransactions && currentUserId && match.params.userId &&
          (match.params.userId !== prevProps.match.params.userId)) {
            handlePlotsReloadBegun();
            handleGetUserPlots(match.params.userId);
        }

        if ((silverGoldService !== prevProps.silverGoldService) || match.params.userId !== prevProps.match.params.userId) {
            handleGetUserBalance(match.params.userId);
        }
        if ((countryService !== prevProps.countryService) || match.params.userId !== prevProps.match.params.userId) {
            handleGetUserCountries(match.params.userId);
        }
        if (artifactContract !== prevProps.artifactContract || (match.params.userId !== prevProps.match.params.userId)) {
            handleGetUserArtifacts(match.params.userId);
        }
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

    redirect = redirectPath => this.setState({redirectPath});

    render() {

        const {
            dataLoaded,
            currentUserId,
            sortBox,
            totalGems,
            userPlots,
            handlePreLoadAuctionPage,
            match,
            userBalance,
            handleUseCoupon,
            userExists,
            userCountries,
            userArtifacts,
            pendingTransactions,
        } = this.props;

        const {
            plots, tab, redirectPath, alreadyRedirected, dashboardUser
        } = this.state;
        if (redirectPath && !alreadyRedirected) {
            this.setState({alreadyRedirected: true});
            return <Redirect to={`${redirectPath}`}/>;
        }

        return (
          <div className="bg-off-black white card-container" data-testid="profile-page">
              <div className="flex aic wrap jcc jcb-ns relative">
                  <div className=" flex aic pt3 pt0-ns">
                      {dashboardUser && dashboardUser.imageURL ?
                        <img src={dashboardUser.imageURL} className="h3 w-auto pr3 pl3-ns dib" alt=""/> :
                        <Spin indicator={
                            <Icon type="loading" style={{fontSize: 24, color: '#e406a5'}} spin/>}
                        />
                      }
                      <h1 className="white" data-testid="userName" style={{margin: "10px 0"}}>
                          {dashboardUser && dashboardUser.name || "Loading..."}
                      </h1>
                  </div>
                  <SilverGoldBalance className="flex col tc">
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
                  </SilverGoldBalance>
              </div>

              <Tabs
                activeKey={`${tab}`}
                animated
                className="bg-off-black white"
                tabBarExtraContent={(
                  <RedeemCoupon className="flex-ns dn">
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
                  </RedeemCoupon>
                )}
                type="card"
              >
                  <TabPane
                    tab={(

                      <span
                        tabIndex={-2}
                        onKeyPress={() => this.setState({tab: 1})}
                        role="button"
                        onClick={() => this.setState({tab: 1})}
                        className="h-100 flex aic white ">
                <img src={Plot} alt="" className="h2 w-auto pr2"/>
                          {(dataLoaded.plots && userPlots) ? userPlots.length : ".."}
                          {' '}
                          Plots
              </span>
                    )}
                    disabled={false}
                    key="1"
                  >
                      <PlotDashboard dataLoaded={dataLoaded} userPlots={userPlots} userId={match.params.userId}
                                     goToGemWorkshop={() => this.setState({tab: 2})}/>
                  </TabPane>
                  <TabPane
                    tab={(
                      <span
                        tabIndex={-1}
                        role="button"
                        onKeyPress={() => this.setState({tab: 2})}
                        className="h-100 flex aic"
                        onClick={() => this.setState({tab: 2})}
                      >
                <img src={Gem} alt="Gems" className="h2 w-auto pr2"/>
                          {totalGems || 0}
                          {' '}
                          Gems
              </span>
                    )}
                    key="2"
                  >
                      <GemDashboard/>
                  </TabPane>
                  <TabPane
                    tab={(
                      <span
                        tabIndex={-2}
                        onKeyPress={() => this.setState({tab: 3})}
                        role="button"
                        onClick={() => this.setState({tab: 3})}
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

                    key="3"
                  >
                      <CountryDashboard
                        userCountryIdList={[11]}//userCountries}
                        withdrawEth={() => {
                            this.props.handleWithdrawCountryEth();
                        }}
                        totalNotWithdrawn={this.props.countriesNotWithdrawnEth}
                        isWithdrawing={pendingTransactions && pendingTransactions.find(tx => tx.type === COUNTRY_WITHDRAW)}
                        userId={match.params.userId}
                        currentUserId={currentUserId}
                        handleGetAvailableCountryPlots={this.props.handleGetAvailableCountryPlots}
                      />
                  </TabPane>

                  <TabPane
                    tab={(
                      <span className="h-100 flex aic white o-50">
                <img src={Artifact} alt="" className="h2 w-auto pr2"/>
                          {userBalance && userBalance.artifacts || '..'} Artifacts
              </span>
                    )}
                    disabled
                    key="4"
                  />
                  <TabPane
                    tab={(
                      <span className="h-100 flex aic white o-50">
                <img src={Keys} alt="" className="h2 w-auto pr2"/>
                          {userBalance && userBalance.keys || '..'} Keys
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
    handlePlotsReloadBegun: () => dispatch => dispatch({type: USER_PLOTS_RELOAD_BEGUN}),
    handleRefreshUserPlot: refreshUserPlot,
    handleGetUserArtifacts: getUserArtifacts,
    handleGetUserPlots: getUserPlots,
    handleGetUserGems: getUserGems,
    handleGetUserDetails: getUserDetails,
    handleFilterUserGemsOnPageLoad: filterUserGemsOnPageLoad,
    handleScroll: scrollGems,
    handlePreLoadAuctionPage: preLoadAuctionPage,
    handleAddGemsToDashboard: addGemsToDashboard,
    handleGetUserBalance: getUserBalance,
    handleUseCoupon: useCoupon,
    handleShowSignInBox: () => ({type: 'SHOW_SIGN_IN_BOX'}),
    handleGetUserCountries: getUserCountries,
    handleGetAvailableCountryPlots: getAvailableCountryPlots,
    handleWithdrawCountryEth: withdrawCountryEth,
};

export default compose(
  withRouter,
  connect(
    select,
    actions,
  ),
)(Dashboard);
