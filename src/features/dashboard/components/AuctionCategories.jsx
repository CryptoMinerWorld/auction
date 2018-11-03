import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { Spring } from 'react-spring';
import Gold from '../../../app/images/dashboard/Gold.png';
import Silver from '../../../app/images/dashboard/Silver.png';
import Gem from '../../../app/images/dashboard/gems.png';
import Artifact from '../../../app/images/dashboard/Artifacts.png';
import Keys from '../../../app/images/dashboard/Keys.png';
import Land from '../../../app/images/dashboard/Land.png';
import { setError } from '../../../app/appActions';

const select = store => ({
  preSaleContract: store.app.presaleContractInstance,
});

class PlayerStats extends PureComponent {
  static propTypes = {
    gemCount: PropTypes.number.isRequired,
    getReferralPoints: PropTypes.func.isRequired,
    preSaleContract: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    match: PropTypes.shape({}),
    getPlotCount: PropTypes.func.isRequired,
  };

  static defaultProps = {
    match: {},
    preSaleContract: false,
  };

  state = {
    referralPoints: '',
    plots: '',
  };

  componentDidMount() {
    const {
      getReferralPoints, preSaleContract, match, getPlotCount,
    } = this.props;
    if (preSaleContract && match.params.userId !== 'false') {
      getReferralPoints(preSaleContract, match.params.userId)
        .then(referralPoints => this.setState({ referralPoints }))
        .catch(err => setError(err));
      getPlotCount(preSaleContract, match.params.userId)
        .then(plots => this.setState({ plots }))
        .catch(err => setError(err));
    }
  }

  componentDidUpdate(prevProps) {
    const {
      getReferralPoints, preSaleContract, match, getPlotCount,
    } = this.props;
    if (preSaleContract !== prevProps.preSaleContract && match.params.userId !== 'false') {
      getReferralPoints(preSaleContract, match.params.userId)
        .then(referralPoints => this.setState({ referralPoints }))
        .catch(err => setError(err));
      getPlotCount(preSaleContract, match.params.userId)
        .then(plots => this.setState({ plots }))
        .catch(err => setError(err));
    }
  }

  render() {
    const { gemCount } = this.props;
    const { referralPoints, plots } = this.state;
    return (
      <div className="dn db-l">
        <AuctionCategories gemCount={gemCount} plots={plots} />

        <Spring from={{ opacity: 0 }} to={{ opacity: 1 }} config={{ delay: 4000 }}>
          {props => (
            <div style={props}>
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
      </div>
    );
  }
}

export const TestPlayerStats = withRouter(PlayerStats);

const actions = { setError };

export default compose(
  connect(
    select,
    actions,
  ),
  withRouter,
)(PlayerStats);

const AuctionCategories = ({ gemCount, plots }) => (
  <div className="dn flex-l jca pa2 mb4 bg-dark-gray br2 pt4 pb3 shadow-1 br--bottom">
    <div className="flex aic w-auto">
      <img src={Gem} alt="" className="h3 w-auto" />
      <p className="pl3 mt2 f5">
        {`${gemCount || '0'} GEMS`}
        {' '}
      </p>
    </div>

    <div className="flex aic w-auto">
      <img src={Artifact} alt="" className="h3 w-auto" />
      <p className="pl3 mt2 f5">0 ARTIFACTS</p>
    </div>

    <div className="flex aic w-auto">
      <img src={Gold} alt="" className="h3 w-auto" />
      {' '}
      <p className="pl3 mt2 f5">0 GOLD</p>
    </div>

    <div className="flex aic w-auto">
      <img src={Silver} alt="" className="h3 w-auto" />
      {' '}
      <p className="pl3 mt2 f5">0 SILVER</p>
    </div>

    <div className="flex aic w-auto">
      <img src={Keys} alt="" className="h3 w-auto" />
      {' '}
      <p className="pl3 mt2 f5">0 KEYS</p>
    </div>

    <div className="flex aic w-auto">
      <img src={Land} alt="" className="h3 w-auto" />
      {' '}
      {/* <p className="pl3 mt2 f5">NO LAND</p> */}
      <p data-testid="plotsOfLand" className="pl3 mt2 f5">
        {`${plots || '0'} ${plots === 1 ? 'PLOT' : 'PLOTS'}`}
      </p>
    </div>
  </div>
);

AuctionCategories.propTypes = {
  gemCount: PropTypes.number.isRequired,
  plots: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
