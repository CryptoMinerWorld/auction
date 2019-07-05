import PropTypes from 'prop-types';
import styled from 'styled-components';
import React, {PureComponent} from 'react';
import Input from 'antd/lib/input';
import Icon from 'antd/lib/icon';
// import Button from 'antd/lib/button';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {compose} from 'redux';
import {daysToSeconds, ethToWei} from '../../mint/helpers';
import {createAuction, removeFromAuction, upgradeGem} from '../itemActions';
import Gembox from './Gembox';
import ProgressMeter from './ProgressMeter';
import GiftGems from './GiftGems';
import button from '../../../app/images/pinkBuyNowButton.png';
import UpgradeComponent from "./UpgradeComponent";
import {getUserPlots, processBlocks, releaseGem} from "../../plots/plotActions";
import {AUCTION_END, AUCTION_START} from "../itemConstants";
import ExtraGemInfo from "./ExtraGemInfo";
import OwnerGembox from "./OwnerGembox";

const ColourButton = styled.button`
  background-image: url(${button});
  background-position: center;
  width: 100%;
  height: 100%;
  text-align: center;
  background-size: contain;
  background-repeat: no-repeat;
  background-color: transparent;
  border: none;
  color: white;
  text-transform: uppercase;
  cursor: pointer;
  opacity: ${props => props.disabled ? "0.5" : "1"};
`;

const TopHighLight = styled.div`
  background: linear-gradient(to right, #e36d2d, #b91a78);
  height: 4px;
`;

const tophighlight = {
    background: 'linear-gradient(to right, #e36d2d, #b91a78)',
    height: '4px',
};

const fixedOverlayStyle = {
    position: 'fixed',
    //width: '35%',
    //maxWidth: '50rem',
    //height: '20rem',
    //backgroundColor: '#dedede',
    margin: 'auto',
    left: '0',
    right: '0',
    top: '0rem',
    bottom: '0',
    zIndex: '10',
    display: 'flex',
    cursor: 'pointer',
    backgroundColor: 'rgba(0,0,0,0.5)'
};

const select = store => ({
    userPlots: store.plots.userPlots,
    gemMiningIds: store.plots.gemMiningIds,
    plotService: store.app.plotServiceInstance,
    userBalance: store.sale.balance
});


class TradingBox extends PureComponent {
    static propTypes = {
        handleCreateAuction: PropTypes.func.isRequired,
        handleRemoveGemFromAuction: PropTypes.func.isRequired,
        history: PropTypes.shape({}).isRequired,
        silverAvailable: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        goldAvailable: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    };

    state = {
        duration: '',
        startPrice: '',
        endPrice: '',
        formSubmitted: false,
        showUpgrade: false,
        useMetal: ''
    };

    handleChange = (value, field) => this.setState({[field]: value});

    turnLoaderOff = () => this.setState({formSubmitted: false});


    // componentDidMount() {
    //     if (this.props.plotService) {
    //         console.log('GET USER PLOTS:');
    //         //todo: remove this
    //         console.log("EFFECTIVE RESTING ENERGY OF:", this.props.plotService.getEffectiveRestingEnergyOf(this.props.gem.id));
    //         this.props.handleGetUserPlots(this.props.currentAccount);
    //     }
    // }
    //
    // componentDidUpdate(prevProps) {
    //     if (this.props.plotService && (this.props.plotService !== prevProps.plotService) || (this.props.gem.state !== prevProps.gem.state)) {
    //         //todo: remove this
    //         console.log("EFFECTIVE RESTING ENERGY OF:", this.props.plotService.getEffectiveRestingEnergyOf(this.props.gem.id));
    //         this.props.role === 'owner' && this.props.handleGetUserPlots(this.props.currentAccount);
    //     }
    // }

    render() {
        const {
            gem,
            handleCreateAuction,
            handleRemoveGemFromAuction,
            handleProcessBlocks,
          handleReleaseGem,
          handleGetUserPlots,
            history,
            userBalance,
            currentAccount,
            role
        } = this.props;
        const {
            duration, startPrice, endPrice, formSubmitted, showUpgrade, useMetal
        } = this.state;

        //let gemMines, plotMined;
        const unprocessed = gem.plotMined && (gem.plotMined.processedBlocks < gem.plotMined.currentPercentage);
        let unprocessedBlocks = [0, 0, 0, 0, 0];
        let totalUnprocessedBlocks = 0;
        let minutesGemCanMine = 0;
        if (gem && gem.plotMined && gem.plotMined.currentPercentage !== gem.plotMined.processedBlocks) {
            unprocessedBlocks[0] = Math.max(Math.min(gem.plotMined.currentPercentage, gem.plotMined.layerEndPercentages[0]) - Math.max(0, gem.plotMined.processedBlocks),0);
            totalUnprocessedBlocks = unprocessedBlocks[0];
            for (let i = 1; i < 5; i++) {
                unprocessedBlocks[i] = Math.max(Math.min(gem.plotMined.currentPercentage, gem.plotMined.layerEndPercentages[i])
                  - Math.max(gem.plotMined.layerEndPercentages[i - 1], gem.plotMined.processedBlocks), 0);
                totalUnprocessedBlocks += unprocessedBlocks[i];
            }
            minutesGemCanMine = getTimeLeftMinutes(gem.plotMined, gem)/60;
        }
        return (
          <>
              {showUpgrade && useMetal && (
                <div style={fixedOverlayStyle}
                     onClick={() => this.setState({showUpgrade: false})}
                >
                    {!unprocessed && <UpgradeComponent metal={useMetal}
                                                    metalAvailable={useMetal === 'silver' ? +userBalance.silverAvailable : +userBalance.goldAvailable}
                                                    hidePopup={() =>
                                                      this.setState({showUpgrade: false})
                                                    }
                                                    {...this.props}/>
                    }
                    <div
                      // style={position: absolute
                      //     top: 0;
                      //     bottom: 20rem;
                      //     right: 0;
                      //     left: 34%;
                      //     margin: auto;
                      //     width: 10px;
                      //     height: 10px;}
                      //
                    >X
                    </div>
                </div>
              )}
              <div
                className="bg-dark-gray measure-l w-100 shadow-3"
                style={{
                    WebkitClipPath:
                      'polygon(100.23% 96.54%, 95.12% 99.87%, 8.69% 100.01%, 1.21% 98.76%, -0.22% 92.82%, 0.03% 2.74%, 4.31% -0.23%, 92.22% -0.24%, 98.41% 1.33%, 100.1% 5.29%)',
                    clipPath:
                      'polygon(100.23% 96.54%, 95.12% 99.87%, 8.69% 100.01%, 1.21% 98.76%, -0.22% 92.82%, 0.03% 2.74%, 4.31% -0.23%, 92.22% -0.24%, 98.41% 1.33%, 100.1% 5.29%)',
                }}
              >
                  <TopHighLight style={tophighlight}/>
                  <div className="white pa3">
                      <div className="flex col jcc ">
                          <OwnerGembox
                            gem={gem}
                            role={role}
                            handleUseMetals={(metalName) => {
                                this.setState({showUpgrade: true, useMetal: metalName});
                            }}
                            plotMined={plotMined}
                            gemMines={gemMines}
                            handleProcessBlocks={(plot) => handleProcessBlocks(plot, () => handleGetUserPlots(currentAccount))}
                            handleReleaseGem={(plot) => handleReleaseGem(plot)}
                          />
                          {gemMines && plotMined && <div style={{textAlign: "center", fontWeight: "bold", fontSize: "16px"}}>{`Gem is mining plot #${plotMined.id}`}</div>}
                          {gem.auctionIsLive ? (
                            <div className="pa5 flex jcc col">
                                <div className="flex jcc">
                                    <div className="w-100 w5-ns h3 center mt4">
                                        <ColourButton
                                          type="danger"
                                          onClick={() => {
                                              this.setState({formSubmitted: true});
                                              handleRemoveGemFromAuction(Number(gem.id), history, this.turnLoaderOff);
                                          }}
                                          data-testid="removeGemButton"
                                          className="b"
                                        >
                                            {gem.txType && gem.txType === AUCTION_END  ? (
                                              <span>
                          <Icon type="loading" theme="outlined"/>
                                                  {' '}
                                                  Removing...
                        </span>
                                            ) : (
                                              '  End Auction'
                                            )}
                                        </ColourButton>
                                    </div>
                                </div>

                                <ProgressMeter
                                  currentPrice={gem.currentPrice}
                                  minPrice={gem.minPrice}
                                  maxPrice={gem.maxPrice}
                                />
                            </div>
                          ) : (!gemMines && Number(gem.state) === 0) && (
                            <div className="pa5 flex jcc col">
                                <div>
                                    <div>Auction duration:</div>
                                    <Input
                                      type="number"
                                      placeholder="From 0 to 1000 days"
                                      className="db"
                                      value={duration}
                                      onChange={e => this.handleChange(Number(e.target.value), 'duration')}
                                      data-testid="durationInputField"
                                      required
                                    />
                                    <div>Start (max) price:</div>
                                    <Input
                                      type="number"
                                      lang="en-150"
                                      step="0.001"
                                      placeholder="From 0 to 1000 ETH (0.001 ETH step)"
                                      className="db"
                                      value={startPrice}
                                      onChange={e => this.handleChange(Number(e.target.value), 'startPrice')}
                                      data-testid="startPriceInputField"
                                      required
                                    />
                                    <div>End (min) price:</div>
                                    <Input
                                      type="number"
                                      lang="en-150"
                                      step="0.001"
                                      placeholder="Less than start price (0.001 ETH step)"
                                      className="db"
                                      value={endPrice}
                                      onChange={e => this.handleChange(Number(e.target.value), 'endPrice')}
                                      data-testid="endPriceInputField"
                                      required
                                    />
                                    <div className="w-100 w5-ns h3 center mt4">
                                        <ColourButton
                                          type="submit"
                                          className="b"
                                          disabled={
                                              !(
                                                gem.id
                                                && duration
                                                && duration < 1000
                                                && startPrice
                                                && startPrice >= endPrice
                                                && startPrice < 1001
                                                && endPrice > 0
                                              )
                                          }
                                          onClick={() => {
                                              const payload = {
                                                  tokenId: Number(gem.id),
                                                  duration: daysToSeconds(duration),
                                                  startPrice: ethToWei(startPrice),
                                                  endPrice: ethToWei(endPrice),
                                              };
                                              this.setState({formSubmitted: true});
                                              handleCreateAuction(payload, this.turnLoaderOff, history);
                                          }}
                                          data-testid="createAuctionButton"
                                        >
                                            {gem.txType && gem.txType === AUCTION_START ? (
                                              <span>
                          <Icon type="loading" theme="outlined"/>
                                                  {' '}
                                                  Creating...
                        </span>
                                            ) : (
                                              <span>
                          <span className="dn-ns">Create</span>
                          <span className="dn db-ns">Create Auction</span>
                        </span>
                                            )}
                                        </ColourButton>
                                    </div>
                                </div>
                                {!gemMines && Number(gem.state) === 0 && <GiftGems gemName={gem.name} sourceImage={gem.image}/>}
                            </div>
                          )}
                      </div>
                  </div>
              </div>
          </>
        );
    }
}

const actions = {
    handleCreateAuction: createAuction,
    handleRemoveGemFromAuction: removeFromAuction,
    handleUpgradeGem: upgradeGem,
    handleGetUserPlots: getUserPlots,
    handleProcessBlocks: processBlocks,
    handleReleaseGem: releaseGem,
};

export default compose(
  connect(
    select,
    actions,
  ),
  withRouter,
)(TradingBox);
