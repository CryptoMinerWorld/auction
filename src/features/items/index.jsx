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
import {clearGemPageOnExit, getAuctionDetails, getRestingEnergy, upgradeGem} from './itemActions';
import {calculateGemName} from './selectors';
import StatsBox from './components/StatsBox';
import {showConfirm} from '../../components/Modal';
import MobileHeader from './components/MobileHeader';
import {setError} from '../../app/appActions';
import {fetchLatestRestingEnergy} from './helpers';
import UpgradeComponent from './components/UpgradeComponent';
import {getAvailableGold, getAvailableSilver} from "../dashboard/helpers";

const select = store => ({
    details: store.auction,
    gemName: store.auction && calculateGemName(store.auction.color, store.auction.id),
    gemImage: store.auction && store.auction.gemImage,
    error: store.app.error,
    currentAccount: store.auth.currentUserId,
    releaseConfetti: store.app.releaseConfetti,
    provider: store.auth.web3 && !!store.auth.web3.currentProvider,
    gemContract: store.app.gemsContractInstance,
    web3: store.app.web3,
    dutchContract: store.app.dutchContractInstance,
    // eslint-disable-next-line
    gemContractAddress: store.app.gemsContractInstance && store.app.gemsContractInstance._address,
    silverContract: store.app.silverContractInstance,
    goldContract: store.app.goldContractInstance,
});

class Auction extends PureComponent {
    state = {
        restingEnergyMinutes: '',
        currentPrice: '',
        goldAvailable: 0,
        silverAvailable: 0,
    };

    async componentDidMount() {
        const {
            match, handleGetAuctionDetails, dutchContract, gemContractAddress, goldContract, silverContract, currentAccount
        } = this.props;
        console.log('HEY!');
        console.log(match.params);
        if (match && match.params && match.params.gemId) {
            handleGetAuctionDetails(match.params.gemId);
        }

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
        }, 10000);

        if (goldContract && goldContract.methods && currentAccount) {
            console.log(11111111111);
            const gold = await getAvailableGold(goldContract, currentAccount);
            if (gold) {
                this.setState({goldAvailable: gold});
            }
        }

        if (silverContract && silverContract.methods && currentAccount) {
            console.log(122222222);
            const silver = await getAvailableSilver(silverContract, currentAccount);
            if (silver) {
                this.setState({silverAvailable: silver});
            }
        }

    }

    async componentDidUpdate(prevProps) {
        const {gemContract, match, goldContract, silverContract, currentAccount} = this.props;
        const {restingEnergyMinutes} = this.state;

        console.log("silver contract ::::::::::", silverContract);
        console.log("CurrentAccount: ", currentAccount);
        if (gemContract && match.params.gemId && !restingEnergyMinutes) {
            fetchLatestRestingEnergy(gemContract, match.params.gemId, prevProps.web3)
              .then(latestRestingEnergyMinutes =>
                // eslint-disable-next-line
                this.setState({restingEnergyMinutes: latestRestingEnergyMinutes}),)
              .catch(err => console.log('error fetching resting energy', err));
        }
        console.log("LALALALACurrentAccount: ", currentAccount);

        if (goldContract && goldContract.methods && currentAccount && (goldContract !== prevProps.goldContract || currentAccount !== prevProps.currentAccount)) {
            console.log(11111111111);
            const gold = await getAvailableGold(goldContract, currentAccount);
            if (gold) {
                this.setState({goldAvailable: gold});
            }
        }

        if (silverContract && silverContract.methods && currentAccount && (silverContract !== prevProps.silverContract || currentAccount !== prevProps.currentAccount)) {
            console.log(122222222);
            const silver = await getAvailableSilver(silverContract, currentAccount);
            if (silver) {
                this.setState({silverAvailable: silver});
            }
        }
    }

    componentWillUnmount() {
        const {match, handleClearGemPage} = this.props;
        if (match && match.params && match.params.gemId) {
            handleClearGemPage(match.params.gemId);
        }

        clearInterval(this.Priceinterval);
    }

    render() {
        const {
            releaseConfetti,
            size,
            buyNow,
            redirectTo,
            provider,
            currentAccount,
            details,
            gemName,
            gemImage,
            error,
            match,
        } = this.props;

        const {restingEnergyMinutes, currentPrice, goldAvailable, silverAvailable} = this.state;
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
                          {details && gemImage && <AuctionImage sourceImage={gemImage}/>}
                          <div className="ma3 ma0-ns">
                              {details && (
                                <ReactCSSTransitionGroup
                                  transitionName="example"
                                  transitionAppear
                                  transitionAppearTimeout={5000}
                                  transitionEnterTimeout={5000}
                                  transitionLeaveTimeout={5000}
                                >
                                    <DisplayBoxStateMachine
                                      currentPrice={currentPrice || details.currentPrice}
                                      minPrice={details.minPrice}
                                      maxPrice={details.maxPrice}
                                      deadline={details.deadline}
                                      handleBuyNow={buyNow}
                                      level={details.level}
                                      grade={details.gradeType}
                                      rate={details.rate}
                                      name={gemName}
                                      tokenId={details.id}
                                      redirectTo={redirectTo}
                                      showConfirm={showConfirm}
                                      provider={provider}
                                      currentAccount={currentAccount}
                                      story={details.story}
                                      owner={details.owner}
                                      userImage={details.userImage}
                                      auctionIsLive={details.auctionIsLive}
                                      gemId={details.gemId}
                                      restingEnergyMinutes={restingEnergyMinutes}
                                      lastSoldFor={details && details.lastSoldFor && details.lastSoldFor}
                                      sourceImage={gemImage}
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
                          {details
                          && Object.keys(details).length > 0 && (
                            <DescriptionBox
                              level={details.level}
                              grade={details.gradeType}
                              rate={details.rate}
                              color={details.color}
                              story={details.story}
                              name={gemName}
                              userName={details.userName}
                              auctionIsLive={details.auctionIsLive}
                              ownerId={details.owner}
                              gemId={details.id}
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
    handleGetAuctionDetails: getAuctionDetails,
    handleGetRestingEnergy: getRestingEnergy,
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
    details: PropTypes.shape({
        sourceImage: PropTypes.string,
        level: PropTypes.number,
        currentPrice: PropTypes.number,
        deadline: PropTypes.number,
        color: PropTypes.number,
        minPrice: PropTypes.number,
        maxPrice: PropTypes.number,
        grade: PropTypes.number,
        rate: PropTypes.number,
        tokenId: PropTypes.string,
    }),
    size: PropTypes.shape({
        monitorHeight: PropTypes.bool,
        monitorWidth: PropTypes.bool,
    }).isRequired,
    gemName: PropTypes.string.isRequired,
    gemImage: PropTypes.string.isRequired,
    showConfirm: PropTypes.func.isRequired,
    redirectTo: PropTypes.string,
    story: PropTypes.string,
    provider: PropTypes.bool,
    currentAccount: PropTypes.string.isRequired,
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
    story: 'Loading...',
};

const DisplayBoxStateMachine = (props) => {
    const {owner, currentAccount, auctionIsLive} = props;

    const currentAccountLowerCase = currentAccount
      && currentAccount
        .split('')
        .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
        .join('');

    const ownerLowerCase = owner
      && owner
        .split('')
        .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
        .join('');

    let state = 'viewer';

    if (ownerLowerCase === currentAccountLowerCase) {
        state = 'owner';
    }

    if (auctionIsLive && ownerLowerCase !== currentAccountLowerCase) {
        state = 'buyer';
    }

    if (!auctionIsLive && ownerLowerCase !== currentAccountLowerCase) {
        state = 'viewer';
        //state = 'owner';
    }

    return {
        owner: <TradingBox {...props} />,
        buyer: <AuctionBox {...props} />,
        viewer: <StatsBox {...props} />,
    }[state];
};
