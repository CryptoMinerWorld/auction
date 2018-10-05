import React, { PureComponent } from 'react';
import message from 'antd/lib/message';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Confetti from 'react-confetti';
import sizeMe from 'react-sizeme';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import { compose } from 'redux';
import AuctionImage from './components/AuctionImage';
import AuctionBox from './components/AuctionBox';
import TradingBox from './components/TradingBox';
import DescriptionBox from './components/DescriptionBox/index';
import FAQ from './components/FAQ';
import MailingList from '../../components/MailingList';
import './animations.css';
import {
  OverlapOnDesktopView,
  RockOverlay,
  TopHighlight
} from './styledComponents';
import { getAuctionDetails } from './itemActions';
import { calculateGemName } from './selectors';
import StatsBox from './components/StatsBox';
import { getRestingEnergy } from './itemActions';
import { showConfirm } from '../../components/Modal';
import MobileHeader from './components/MobileHeader';

const select = store => ({
  details: store.auction,
  gemName: calculateGemName(store.auction.color, store.auction.id),
  error: store.app.error,
  currentAccount: store.auth.currentUserId,
  releaseConfetti: store.app.releaseConfetti,
  provider: store.auth.web3 && !!store.auth.web3.currentProvider,
  gemContract: store.app.gemsContractInstance,
  web3: store.app.web3
});

class Auction extends PureComponent {
  state = {
    restingEnergyMinutes: ''
  };

  componentDidMount() {
    const { match, handleGetAuctionDetails } = this.props;
    handleGetAuctionDetails(match.params.gemId);
  }

  componentDidUpdate(prevProps, prevState) {
    const transform = result =>
      this.props.web3.eth.getBlock(result, (err, result) => {
        if (err) {
          return err;
        }
        return result;
      });

    if (
      this.props.gemContract &&
      this.props.match.params.gemId &&
      !this.state.restingEnergyMinutes
    ) {
      this.props.gemContract.methods
        .getCreationTime(this.props.match.params.gemId)
        .call()
        .then(async blockNumber => {
          const { timestamp } = await transform(blockNumber);
          const linearThreshold = 37193;
          const ageSeconds = ((Date.now() / 1000) | 0) - timestamp;
          const ageMinutes = Math.floor(ageSeconds / 60);

          const restingEnergyMinutes = Math.floor(
            -7e-6 * Math.pow(Math.min(ageMinutes, linearThreshold), 2) +
              0.5406 * Math.min(ageMinutes, linearThreshold) +
              0.0199 * Math.max(ageMinutes - linearThreshold, 0)
          );

          this.setState({ restingEnergyMinutes });
        })
        .catch(err => console.log('resting energy action err', err));
    }
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
      error
    } = this.props;

    const { restingEnergyMinutes } = this.state;

    const socialShareUrl = `${process.env.REACT_APP_BASE_URL}${
      this.props.match.url
    }`;

    return (
      <div>
        <MobileHeader />
        {releaseConfetti && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: '999'
            }}
          >
            <Confetti {...size} />
          </div>
        )}
        {error && message.error(error)}
        <div className="bg-off-black ">
          <RockOverlay>
            <div className="relative mw9 center">
              {details.gemImage && (
                <AuctionImage sourceImage={details.gemImage} />
              )}
              <ReactCSSTransitionGroup
                transitionName="example"
                transitionAppear
                transitionAppearTimeout={5000}
                transitionEnterTimeout={5000}
                transitionLeaveTimeout={5000}
              >
                <DisplayBoxStateMachine
                  currentPrice={details.currentPrice}
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
                />
              </ReactCSSTransitionGroup>
            </div>
          </RockOverlay>
          <div className="bg-off-black">
            <TopHighlight />
            <div className="mw9 center relative-l">
              {details &&
                Object.keys(details).length > 0 && (
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
                  <FAQ />
                </OverlapOnDesktopView>
              </div>
            </div>
          </div>
          <MailingList />
        </div>
      </div>
    );
  }
}

const actions = {
  handleGetAuctionDetails: getAuctionDetails,
  handleGetRestingEnergy: getRestingEnergy,
  showConfirm
};

export default compose(
  sizeMe({
    monitorHeight: true,
    monitorWidth: true
  }),
  withRouter,
  connect(
    select,
    actions
  )
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
    tokenId: PropTypes.string
  }),
  size: PropTypes.shape({
    monitorHeight: PropTypes.bool,
    monitorWidth: PropTypes.bool
  }).isRequired,

  showConfirm: PropTypes.func.isRequired,
  redirectTo: PropTypes.string,
  story: PropTypes.string.isRequired,
  provider: PropTypes.bool.isRequired,
  currentAccount: PropTypes.string.isRequired
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
    tokenId: 1
  }),
  provider: false,
  story: 'Loading...'
};

const DisplayBoxStateMachine = props => {
  const { owner, currentAccount, auctionIsLive } = props;
  console.log('', { owner, currentAccount, auctionIsLive });
  let state = 'owner';

  if (owner === currentAccount) {
    state = 'owner';
  }

  if (auctionIsLive && owner !== currentAccount) {
    state = 'buyer';
  }

  if (!auctionIsLive && owner !== currentAccount) {
    state = 'viewer';
  }

  return {
    owner: <TradingBox {...props} />,
    buyer: <AuctionBox {...props} />,
    viewer: <StatsBox {...props} />
  }[state];
};
