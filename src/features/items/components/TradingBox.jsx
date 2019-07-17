import PropTypes from 'prop-types';
import styled from 'styled-components';
import React, {PureComponent} from 'react';
import Input from 'antd/lib/input';
import Icon from 'antd/lib/icon';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {compose} from 'redux';
import {daysToSeconds, ethToWei} from '../../mint/helpers';
import {createAuction, removeFromAuction, upgradeGem} from '../itemActions';
import ProgressMeter from './ProgressMeter';
import GiftGems from './GiftGems';
import button from '../../../app/images/pinkBuyNowButton.png';
import UpgradeComponent from "./UpgradeComponent";
import {getUserPlots, processBlocks, releaseGem} from "../../plots/plotActions";
import {AUCTION_END, AUCTION_START, GETTING_READY, GOING_HOME, IDLE} from "../itemConstants";
import {CutEdgesButton} from "../../../components/CutEdgesButton";
import {
    stateOutlineColors,
    statePaneColors,
    typePaneColors,
    typePaneOutlineColors
} from "../../plots/components/propertyPaneStyles";
import OwnerGradeRateEnergyGembox from "./OwnerGradeRateEnergyGembox";
import OwnerLevelGembox from "./OwnerLevelGembox";
import ViewerGembox from "./ViewerGembox";
import {getTimeLeftMinutes} from "../../../app/services/PlotService";
import MiningGembox from "./MiningGembox";
import Loading from "../../../components/Loading";
import {UpgradeWarningPopup} from "./UpgradeWarningPopup";

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

const NameBox = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
`;

const StateBox = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 10px 0;
`;

const select = store => ({
    userPlots: store.plots.userPlots,
    gemMiningIds: store.plots.gemMiningIds,
    plotService: store.app.plotService,
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
        useMetal: '',
        showUpgradeWarning: true,
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
            duration, startPrice, endPrice, formSubmitted, showUpgrade, useMetal, showUpgradeWarning,
        } = this.state;

        //let gemMines, plotMined;
        const unprocessed = gem.plotMined && (gem.plotMined.processedBlocks < gem.plotMined.currentPercentage);
        let unprocessedBlocks = [0, 0, 0, 0, 0];
        let totalUnprocessedBlocks = 0;
        let minutesGemCanMine = 0;
        if (gem && gem.plotMined) {
            minutesGemCanMine = getTimeLeftMinutes(gem.plotMined, gem);
            if (gem.plotMined.currentPercentage !== gem.plotMined.processedBlocks) {
                unprocessedBlocks[0] = Math.max(Math.min(gem.plotMined.currentPercentage, gem.plotMined.layerEndPercentages[0]) - Math.max(0, gem.plotMined.processedBlocks), 0);
                totalUnprocessedBlocks = unprocessedBlocks[0];
                for (let i = 1; i < 5; i++) {
                    unprocessedBlocks[i] = Math.max(Math.min(gem.plotMined.currentPercentage, gem.plotMined.layerEndPercentages[i])
                      - Math.max(gem.plotMined.layerEndPercentages[i - 1], gem.plotMined.processedBlocks), 0);
                    totalUnprocessedBlocks += unprocessedBlocks[i];
                }
            }
        }
        return (
          <>
              {showUpgrade && useMetal && (
                <div style={fixedOverlayStyle}
                     onClick={() => this.setState({showUpgrade: false, showUpgradeWarning: true})}
                >
                    {!unprocessed && !(showUpgradeWarning && useMetal === 'gold' && gem.gradeType >= 4 && gem.restingEnergy > 0) &&
                    <UpgradeComponent metal={useMetal}
                                      metalAvailable={useMetal === 'silver' ? +userBalance.silverAvailable : +userBalance.goldAvailable}
                                      hidePopup={() =>
                                        this.setState({showUpgrade: false, showUpgradeWarning: true})
                                      }
                                      {...this.props}
                    />
                    }
                    {showUpgradeWarning && (useMetal === 'gold') && gem.gradeType >= 4 && gem.restingEnergy >= 60 &&
                    <UpgradeWarningPopup
                      useEnergyCallback={() => this.setState({showUpgrade: false})}
                      upgradeCallback={() => this.setState({showUpgradeWarning: false})}
                    />
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
                          <NameBox>
                              <CutEdgesButton outlineColor={typePaneOutlineColors(gem.color)}
                                              backgroundColor={typePaneColors(gem.color)}
                                              fontColor={typePaneOutlineColors(gem.color)}
                                              edgeSizes={[3, 20]}
                                              fontSize={20}
                                              outlineWidth={3}
                                              height={38}
                                              content={gem.name}
                                              otherStyles={"width: 220px; font-weight: bold"}
                              />
                          </NameBox>
                          {gem.stateName ?
                            <StateBox>
                                <CutEdgesButton outlineColor={stateOutlineColors(gem.stateName)}
                                                backgroundColor={statePaneColors(gem.stateName)}
                                                fontColor={stateOutlineColors(gem.stateName)}
                                                edgeSizes={[5, 20]}
                                                fontSize={20}
                                                outlineWidth={3}
                                                height={34}
                                                content={gem.stateName}
                                                otherStyles={"width: 220px; font-weight: bold"}
                                />
                            </StateBox> :
                            <div style={{position: 'relative', height: '35px'}}>
                                <Loading/>
                            </div>
                          }

                          {gem.auctionIsLive &&
                          <div className="flex jcc col" style={{padding: "10px 20px"}}>
                              <div className="flex jcc">
                                  <div className="w-100 w5-ns h3 center">
                                      <ColourButton
                                        type="danger"
                                        onClick={() => {
                                            this.setState({formSubmitted: true});
                                            handleRemoveGemFromAuction(Number(gem.id), history, this.turnLoaderOff);
                                        }}
                                        data-testid="removeGemButton"
                                        className="b"
                                      >
                                          {gem.txType && gem.txType === AUCTION_END ? (
                                            <span>
                                                    <Icon type="loading" theme="outlined"/>
                                                {' '}Removing...
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
                          }

                          {/*//todo: Unprocessed Blocks and Time Till Gem gets Stuck IF NOT STUCK (i.e. MINING)*/}
                          {gem.plotMined &&
                          <MiningGembox
                            stateName={gem.stateName}
                            plotMined={gem.plotMined}
                            totalUnprocessedBlocks={totalUnprocessedBlocks}
                            unprocessedBlocks={unprocessedBlocks}
                            minutesGemCanMine={minutesGemCanMine}
                            handleProcessBlocks={() => handleProcessBlocks(gem.plotMined)}
                            handleReleaseGem={() => handleReleaseGem(gem.plotMined)}
                          />
                          }

                          {gem.stateName === IDLE && <OwnerLevelGembox
                            gem={gem}
                            handleUseMetals={(metalName) => {
                                this.setState({showUpgrade: true, useMetal: metalName});
                            }}
                            plotMined={gem.plotMined}
                            gemMines={gem.plotMined}
                          />}

                          {gem.stateName === IDLE && <OwnerGradeRateEnergyGembox
                            gem={gem}
                            handleUseMetals={(metalName) => {
                                this.setState({showUpgrade: true, useMetal: metalName});
                            }}
                            plotMined={gem.plotMined}
                            gemMines={gem.gemMines}
                          />}


                          {gem.plotMined &&
                          <div style={{fontSize: "18px", textAlign: 'center'}}>
                              Stop mining to allow you to, upgrade your gem, sell it on the market, or gift it to a
                              friend
                          </div>
                          }

                          {(gem.auctionIsLive || gem.plotMined || gem.stateName === GETTING_READY || gem.stateName === GOING_HOME) &&
                          <ViewerGembox gem={gem}/>
                          }

                          {gem.stateName === IDLE && (
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
                                <GiftGems gemName={gem.name} sourceImage={gem.image}/>
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
