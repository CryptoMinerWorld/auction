import React, {PureComponent} from 'react';
import message from 'antd/lib/message';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import Confetti from 'react-confetti';
import sizeMe from 'react-sizeme';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {connect} from 'react-redux';
import {compose} from 'redux';
import AuctionImage from './components/AuctionImage';
import AuctionBox from './components/AuctionBox';
import TradingBox from './components/TradingBox';
import DescriptionBox from './components/DescriptionBox/index';
import FAQ from './components/FAQ';
import MailingList from '../../components/MailingList';
import './animations.css';
import {OverlapOnDesktopView, RockOverlay, TopHighlight} from './styledComponents';
import {
    clearGemPage,
    getGemAuctionData,
    getGemData,
    getGemMiningData,
    getGemTransactionData,
    getOwnerDataByOwnerId
} from './itemActions';
import StatsBox from './components/StatsBox';
import {showConfirm} from '../../components/Modal';
import MobileHeader from './components/MobileHeader';
import {setError} from '../../app/appActions';
import {getUserBalance} from "../sale/saleActions";
import {setItemEventListeners} from "./itemEventListener";
import {formatRestingEnergy, resolveGemStateName} from "../../app/services/GemService";
import ExtraGemInfo from "./components/ExtraGemInfo";
import styled from "styled-components";
import Loading from "../../components/Loading";

const select = store => {

    const dataLoaded = store.auction.dataLoaded;
    const allDataLoaded = dataLoaded && dataLoaded.gem && dataLoaded.auction && dataLoaded.mining && dataLoaded.tx;
    const gem = store.auction.gem;
    if (allDataLoaded) {
        gem.stateName = resolveGemStateName(gem);
    }
    return {
        gem,
        dataLoaded,
        allDataLoaded,
        //ownerData: store.auction.ownerData,
        //gemName: store.auction && calculateGemName(store.auction.color, store.auction.id),
        gemImage: store.auction && store.auction.gemImage,
        error: store.app.error,
        currentAccount: store.auth.currentUserId,
        releaseConfetti: store.app.releaseConfetti,
        provider: store.auth.web3 && !!store.auth.web3.currentProvider,
        gemContract: store.app.gemsContractInstance,
        web3: store.app.web3,
        dutchContract: store.app.dutchContractInstance,
        gemService: store.app.gemServiceInstance,
        auctionService: store.app.auctionServiceInstance,
        gemContractAddress: store.app.gemsContractInstance && store.app.gemsContractInstance.options.address,
        silverContract: store.app.silverContractInstance,
        goldContract: store.app.goldContractInstance,
        userBalance: store.sale.balance,
        plotService: store.app.plotServiceInstance,
        silverGoldService: store.app.silverGoldServiceInstance,
        pendingTransactions: store.tx.pendingTransactions,
    }
};

class Auction extends PureComponent {
    state = {
        restingEnergyMinutes: '',
        currentPrice: '',
        goldAvailable: 0,
        silverAvailable: 0,
        eventSubscriptions: [],
    };

    clearSubscriptions = () => {
        this.state.eventSubscriptions.forEach((subscription) => {
            console.log("subscription unsubscribe:", subscription);
            subscription.unsubscribe();
        })
    };

    async componentDidMount() {

        console.log('componentDidMountProps: ', this.props);
        console.log('componentDidMountState: ', this.state);

        const {
            match, handleGetUserBalance, silverGoldService, gemService,
          dataLoaded,
          gem,
            auctionService,
            currentAccount, pendingTransactions, plotService,
            handleGetGemData,
            handleGetGemAuctionData,
            handleGetGemMiningData,
          handleGetGemTxData,
        } = this.props;

        if (match && match.params && match.params.gemId) {
            if (gemService) {
                const eventSubscriptions = setItemEventListeners({
                    gemService,
                    gemChangedCallback: handleGetGemData,
                    auctionChangedCallback: handleGetGemAuctionData,
                    txChangedCallback: handleGetGemTxData,
                    miningChangedCallback: handleGetGemMiningData,
                    tokenId: match.params.gemId,
                    transactionResolved: () => {}
                });
                this.setState({eventSubscriptions});
                handleGetGemData(match.params.gemId);
            }
            if (auctionService) {
                handleGetGemAuctionData(match.params.gemId);
            }
            if (pendingTransactions && dataLoaded.auction && dataLoaded.gem) {
                handleGetGemTxData(gem);
            }
            if (plotService && gem && dataLoaded.gem) {
                (Number(gem.state) !== 0) && handleGetGemMiningData(match.params.gemId);
            }
        }

        if (silverGoldService && currentAccount) {
            handleGetUserBalance(currentAccount);
        }

        if (plotService) {
            //todo: remove this
            console.log("EFFECTIVE RESTING ENERGY OF:", formatRestingEnergy(await this.props.plotService.getEffectiveRestingEnergyOf(match.params.gemId)));
        }
    }

    async componentDidUpdate(prevProps) {

        console.log('componentDidUpdateProps: ', this.props);
        console.log('componentDidUpdateState: ', this.state);

        const {gemContract, gem, plotService, match, userBalance, silverGoldService, handleGetUserBalance, currentAccount,
          dataLoaded,
            handleGetGemData,
            handleGetGemAuctionData,
            handleGetGemMiningData,
            handleGetGemTxData,
            gemService, auctionService, pendingTransactions} = this.props;
        const {restingEnergyMinutes} = this.state;

        if (dataLoaded && dataLoaded !== prevProps.dataLoaded) {
            console.log(`New Data Loaded (gem: ${dataLoaded.gem}, auction: ${dataLoaded.auction}, mining: ${dataLoaded.mining}, tx: ${dataLoaded.tx}`);
        }

        if (this.props.gem && !this.state.ownerData) {
            const ownerData = await getOwnerDataByOwnerId(this.props.gem.owner);
            this.setState({ownerData});
        }

        if (gemService && auctionService && (gemService !== prevProps.gemService || auctionService !== prevProps.auctionService)) {
            const eventSubscriptions = setItemEventListeners({
                gemService,
                gemChangedCallback: handleGetGemData,
                auctionChangedCallback: handleGetGemAuctionData,
                txChangedCallback: handleGetGemTxData,
                miningChangedCallback: handleGetGemMiningData,
                tokenId: match.params.gemId,
                transactionResolved: () => {}
            });
            this.setState({eventSubscriptions});
        }

        if (gemService && (gemService !== prevProps.gemService)) {
            handleGetGemData(match.params.gemId);
        }
        if (auctionService && (auctionService !== prevProps.auctionService)) {
            handleGetGemAuctionData(match.params.gemId);
        }
        if (pendingTransactions && gem && dataLoaded.auction && dataLoaded.gem &&
          (pendingTransactions !== prevProps.pendingTransactions || ((dataLoaded !== prevProps.dataLoaded) && !dataLoaded.tx ))) {
            handleGetGemTxData(gem);
        }
        if (plotService && gem && dataLoaded.gem && (plotService !== prevProps.plotService || dataLoaded.gem !== prevProps.dataLoaded.gem)) {
            (Number(gem.state) !== 0) && handleGetGemMiningData(match.params.gemId);
        }

        if (silverGoldService && currentAccount && (silverGoldService !== prevProps.silverGoldService || !userBalance || currentAccount !== prevProps.currentAccount)) {
            handleGetUserBalance(currentAccount);
        }

        if (plotService && plotService !== prevProps.plotService) {
            //todo: remove this
            console.log("EFFECTIVE RESTING ENERGY OF:", formatRestingEnergy(await this.props.plotService.getEffectiveRestingEnergyOf(match.params.gemId)));
        }

        // if (gem && gem !== prevProps.gem) {
        //     this.Priceinterval = setInterval(() => {
        //         if (auctionService.auctionContract && auctionService.gemContract && gem) {
        //             auctionService.auctionContract.methods
        //               .getCurrentPrice(match.params.gemId)
        //               .call()
        //               .then((currentPrice) => {
        //                   this.setState({currentPrice: Number(currentPrice)});
        //               })
        //               .catch(error => console.warn(error));
        //         }
        //     }, 60000);
        // }
    }

    componentWillUnmount() {
        const {match, handleClearGemPage} = this.props;
        this.clearSubscriptions();
        if (match && match.params && match.params.gemId) {
            handleClearGemPage(match.params.gemId);
        }
        // clearInterval(this.Priceinterval);
    }

    render() {
        const {
            releaseConfetti,
            size,
            buyNow,
            provider,
            currentAccount,
            details,
            error,
            match,
            gem,
          dataLoaded
        } = this.props;

        const {goldAvailable, silverAvailable, ownerData} = this.state;
        const socialShareUrl = `${process.env.REACT_APP_BASE_URL}${match.url}`;
        return (
          <div>
              {/*<MobileHeader/>*/}
              {releaseConfetti && (
                <div
                  style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      zIndex: '999',
                  }}
                >
                    <Confetti {...size} />
                </div>
              )}
              {error && message.error(error)}
              <div className="bg-off-black ">
                  <RockOverlay>
                      <div className="relative mw9 center">
                          {gem && <AuctionImage sourceImage={gem.image}/>}
                          <div className="ma3 ma0-ns">
                              {dataLoaded.gem && gem && (
                                <ReactCSSTransitionGroup
                                  transitionName="example"
                                  transitionAppear
                                  transitionAppearTimeout={4000}
                                  transitionEnterTimeout={4000}
                                  transitionLeaveTimeout={4000}
                                >
                                    <OverlapBoxOnDesktopView>
                                        <DisplayBoxStateMachine
                                          gem={gem}
                                          handleBuyNow={buyNow}
                                          showConfirm={showConfirm}
                                          provider={provider}
                                          currentAccount={currentAccount}
                                          userImage={details.userImage}
                                          lastSoldFor={details && details.lastSoldFor && details.lastSoldFor}
                                          goldAvailable={goldAvailable}
                                          silverAvailable={silverAvailable}
                                          dataLoaded={dataLoaded}
                                        />
                                        {/*<ExtraGemInfo*/}
                                          {/*creationTime={"0-0-0"}*/}
                                          {/*totalBlocksProcessed={[0, 0, 0, 0, 0]}*/}
                                          {/*totalItemsMinedUp={0}*/}
                                          {/*totalTimeMined={"0-0-0"}/>*/}
                                    </OverlapBoxOnDesktopView>
                                </ReactCSSTransitionGroup>
                              )}
                              {!dataLoaded.gem &&
                                <div style={{height: '300px'}}>
                                    <Loading/>
                                </div>
                              }
                          </div>
                      </div>
                  </RockOverlay>
                  <div className="bg-off-black">
                      <TopHighlight/>
                      <div className="mw9 center relative-l">
                          {dataLoaded.gem && gem && (
                            <DescriptionBox
                              dataLoaded={dataLoaded}
                              gem={gem}
                              ownerData={ownerData}
                              userName={details.userName}
                              userImage={details.userImage}
                              shareUrl={socialShareUrl}
                            />
                          )}

                          <div className="w-50-l measure-wide-l">
                              <OverlapOnDesktopView>
                                  <FAQ/>
                              </OverlapOnDesktopView>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        );
    }
}

const actions = {
    handleGetGemData: getGemData,
    handleGetGemAuctionData: getGemAuctionData,
    handleGetGemMiningData: getGemMiningData,
    handleGetGemTxData: getGemTransactionData,
    handleGetUserBalance: getUserBalance,
    handleClearGemPage: clearGemPage,
    showConfirm,
    handleSetError: setError,

};

export default compose(
  sizeMe({
      monitorHeight: true,
      monitorWidth: true,
  }),
  withRouter,
  connect(
    select,
    actions,
  ),
)(Auction);

Auction.propTypes = {
    // gem: PropTypes.shape({
    //     image: PropTypes.string,
    //     level: PropTypes.number,
    //     currentPrice: PropTypes.number,
    //     deadline: PropTypes.number,
    //     color: PropTypes.number,
    //     minPrice: PropTypes.number,
    //     maxPrice: PropTypes.number,
    //     gradeType: PropTypes.number,
    //     rate: PropTypes.number,
    //     tokenId: PropTypes.string,
    // }),
    size: PropTypes.shape({
        monitorHeight: PropTypes.bool,
        monitorWidth: PropTypes.bool,
    }).isRequired,
    //gemName: PropTypes.string.isRequired,
    //gemImage: PropTypes.string.isRequired,
    showConfirm: PropTypes.func.isRequired,
    //redirectTo: PropTypes.string,
    //story: PropTypes.string,
    provider: PropTypes.bool,
    //currentAccount: PropTypes.string.isRequired,
};

Auction.defaultProps = {
    redirectTo: '',
    details: PropTypes.shape({
        sourceImage: 'http://thecodeplayer.com/uploads/wt/13.png',
        level: 1,
        currentPrice: 0,
        deadline: 0,
        color: 10,
        minPrice: 0,
        maxPrice: 1,
        grade: 1,
        rate: 100,
        tokenId: 1,
    }),
    provider: false,
    // gem: PropTypes.shape({
    //     image: 'http://thecodeplayer.com/uploads/wt/13.png',
    //     level: 1,
    //     currentPrice: 0,
    //     deadline: 0,
    //     color: 10,
    //     minPrice: 0,
    //     maxPrice: 1,
    //     gradeType: 1,
    //     rate: 100,
    //     tokenId: 1,
    // })
    //story: 'Loading...',
};

const DisplayBoxStateMachine = (props) => {

    const {gem, currentAccount, auctionIsLive} = props;

    console.log('DisplayBoxStateMachineProps: ', props);

    const currentAccountLowerCase = currentAccount
      && currentAccount
        .split('')
        .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
        .join('');

    const ownerLowerCase = gem.owner
      && gem.owner
        .split('')
        .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
        .join('');

    console.log('Owner lower case:', ownerLowerCase);

    let state = 'viewer';

    if (ownerLowerCase === currentAccountLowerCase) {
        state = 'owner';
    }

    if (gem.auctionIsLive && ownerLowerCase !== currentAccountLowerCase) {
        state = 'buyer';
    }

    if (!gem.auctionIsLive && ownerLowerCase !== currentAccountLowerCase) {
        state = 'viewer';
    }

    console.log('State: ', state);

    return {
        owner: <TradingBox {...props} role={"owner"}/>,
        buyer: <AuctionBox {...props} role={"buyer"}/>,
        viewer: <StatsBox {...props} role={"viewer"}/>,
    }[state];
};

const OverlapBoxOnDesktopView = styled.div`
  @media (min-width: 64em) {
    position: absolute;
    top: 2em;
    left: 5em;
    min-width: 480px;
    z-index: 2;
  }
`;
