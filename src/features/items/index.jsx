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
    clearGemPageOnExit,
    getAuctionDetails,
    getGemData,
    getOwnerDataByOwnerId,
    getRestingEnergy,
    upgradeGem
} from './itemActions';
import {calculateGemName} from './selectors';
import StatsBox from './components/StatsBox';
import {showConfirm} from '../../components/Modal';
import MobileHeader from './components/MobileHeader';
import {setError} from '../../app/appActions';
import {fetchLatestRestingEnergy} from './helpers';
import UpgradeComponent from './components/UpgradeComponent';
import {getAvailableGold, getAvailableSilver} from "../dashboard/helpers";

const select = store => {
    console.warn('GEM PAGE STORE: ', store);
    return {
        gem: store.auction.gem,
          ownerData: store.auction.ownerData,
      details: store.auction,
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
      gemContractAddress: store.app.gemsContractInstance && store.app.gemsContractInstance._address,
      silverContract: store.app.silverContractInstance,
      goldContract: store.app.goldContractInstance,
    }
};

class Auction extends PureComponent {
    state = {
        restingEnergyMinutes: '',
        currentPrice: '',
        goldAvailable: 0,
        silverAvailable: 0,
    };

    async componentDidMount() {
        const {
            match, handleGetGemData, dutchContract, gemContractAddress, goldContract, silverContract, currentAccount
        } = this.props;
        if (match && match.params && match.params.gemId) {
            handleGetGemData(match.params.gemId);
        }

        //todo: improve priceInterval (only if auction is live ?)
        this.Priceinterval = setInterval(() => {
            if (dutchContract && gemContractAddress) {
                dutchContract.methods
                  .getCurrentPrice(gemContractAddress, match.params.gemId)
                  .call()
                  .then((currentPrice) => {
                      this.setState({currentPrice: Number(currentPrice)});
                  })
                  .catch(error => console.warn(error));
            }
        }, 60000);

        if (goldContract && goldContract.methods && currentAccount) {
            //console.log(11111111111);
            const gold = await getAvailableGold(goldContract, currentAccount);
            if (gold) {
                this.setState({goldAvailable: gold});
            }
        }

        if (silverContract && silverContract.methods && currentAccount) {
            //console.log(122222222);
            const silver = await getAvailableSilver(silverContract, currentAccount);
            if (silver) {
                this.setState({silverAvailable: silver});
            }
        }
    }

    async componentDidUpdate(prevProps) {

        console.log('componentDidUpdateProps: ', this.props);

        const {gemContract, match, goldContract, silverContract, currentAccount, handleGetGemData, gemService, auctionService} = this.props;
        const {restingEnergyMinutes} = this.state;

        if (this.props.gem && !this.state.ownerData) {
            const ownerData = await getOwnerDataByOwnerId(this.props.gem.owner);
            console.log('OWNER DATA: ', ownerData);
            this.setState({ownerData});
        }

        if (gemService && auctionService && (gemService !== prevProps.gemService || auctionService !== prevProps.auctionService))  {
            handleGetGemData(match.params.gemId);
        }

        if (goldContract && goldContract.methods && currentAccount && (goldContract !== prevProps.goldContract || currentAccount !== prevProps.currentAccount)) {
            const gold = await getAvailableGold(goldContract, currentAccount);
            if (gold) {
                this.setState({goldAvailable: gold});
            }
        }

        if (silverContract && silverContract.methods && currentAccount && (silverContract !== prevProps.silverContract || currentAccount !== prevProps.currentAccount)) {
            const silver = await getAvailableSilver(silverContract, currentAccount);
            if (silver) {
                this.setState({silverAvailable: silver});
            }
        }
    }

    componentWillUnmount() {
        // const {match, handleClearGemPage} = this.props;
        // if (match && match.params && match.params.gemId) {
        //     handleClearGemPage(match.params.gemId);
        // }
        clearInterval(this.Priceinterval);
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
            gem
        } = this.props;

        const {goldAvailable, silverAvailable, ownerData} = this.state;
        const socialShareUrl = `${process.env.REACT_APP_BASE_URL}${match.url}`;
        return (
          <div>
              <MobileHeader/>
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
                              {gem && (
                                <ReactCSSTransitionGroup
                                  transitionName="example"
                                  transitionAppear
                                  transitionAppearTimeout={5000}
                                  transitionEnterTimeout={5000}
                                  transitionLeaveTimeout={5000}
                                >
                                    <DisplayBoxStateMachine
                                      gem = {gem}
                                      handleBuyNow={buyNow}
                                      showConfirm={showConfirm}
                                      provider={provider}
                                      currentAccount={currentAccount}
                                      userImage={details.userImage}
                                      lastSoldFor={details && details.lastSoldFor && details.lastSoldFor}
                                      goldAvailable={goldAvailable}
                                      silverAvailable={silverAvailable}
                                    />
                                </ReactCSSTransitionGroup>
                              )}
                          </div>
                      </div>
                  </RockOverlay>
                  <div className="bg-off-black">
                      <TopHighlight/>
                      <div className="mw9 center relative-l">
                          {gem && (
                            <DescriptionBox
                              gem = {gem}
                              ownerData = {ownerData}
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
                  <MailingList/>
              </div>
          </div>
        );
    }
}

const actions = {
    handleGetGemData: getGemData,
    //handleGetAuctionDetails: getAuctionDetails,
    showConfirm,
    handleClearGemPage: clearGemPageOnExit,
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
        owner: <TradingBox {...props} />,
        buyer: <AuctionBox {...props} />,
        viewer: <StatsBox {...props} />,
    }[state];
};
