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
import {createAuction, removeFromAuction} from '../itemActions';
import Gembox from './Gembox';
import ProgressMeter from './ProgressMeter';
import GiftGems from './GiftGems';
import button from '../../../app/images/pinkBuyNowButton.png';
import UpgradeComponent from "./UpgradeComponent";

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
`;

const TopHighLight = styled.div`
  background: linear-gradient(to right, #e36d2d, #b91a78);
  height: 4px;
`;

const tophighlight = {
    background: 'linear-gradient(to right, #e36d2d, #b91a78)',
    height: '4px',
};

const OverlapOnDesktopView = styled.div`
  @media (min-width: 64em) {
    position: absolute;
    top: 2em;
    left: 5em;
    z-index: 2;
  }
`;

class TradingBox extends PureComponent {
    static propTypes = {
        tokenId: PropTypes.number.isRequired,
        handleCreateAuction: PropTypes.func.isRequired,
        handleRemoveGemFromAuction: PropTypes.func.isRequired,
        auctionIsLive: PropTypes.bool.isRequired,
        history: PropTypes.shape({}).isRequired,
        level: PropTypes.number.isRequired,
        grade: PropTypes.number.isRequired,
        rate: PropTypes.number.isRequired,
        restingEnergyMinutes: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
        currentPrice: PropTypes.number.isRequired,
        minPrice: PropTypes.number.isRequired,
        maxPrice: PropTypes.number.isRequired,
        sourceImage: PropTypes.string.isRequired,
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

    render() {
        const {
            handleCreateAuction,
            handleRemoveGemFromAuction,
            tokenId,
            auctionIsLive,
            history,
            level,
            grade,
            rate,
            restingEnergyMinutes,
            name,
            currentPrice,
            minPrice,
            maxPrice,
            sourceImage,
        } = this.props;
        const {
            duration, startPrice, endPrice, formSubmitted, showUpgrade, useMetal,
        } = this.state;

        return (
          <>

              {showUpgrade && useMetal && (
                <div style={{
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
                }}
                     onClick={() => this.setState({showUpgrade: false})}
                >
                    <UpgradeComponent level={level} grade={grade} metal={useMetal}/>
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
                    >X</div>
                </div>
              )}
              <OverlapOnDesktopView
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
                          <h1 className="tc pb3 b white" style={{wordBreak: 'break-all'}} data-testid="gemName">
                              {name}
                          </h1>
                          <div className="mt3"/>
                          <Gembox
                            level={level}
                            grade={grade}
                            rate={rate}
                            restingEnergyMinutes={restingEnergyMinutes}
                            handleUseMetals={(metalName) => {
                                this.setState({showUpgrade: true, useMetal: metalName});
                            }}
                          />

                          {auctionIsLive ? (
                            <div className="pa5 flex jcc col">
                                <div className="flex jcc">
                                    <div className="w-100 w5-ns h3 center mt4">
                                        <ColourButton
                                          type="danger"
                                          onClick={() => {
                                              this.setState({formSubmitted: true});
                                              handleRemoveGemFromAuction(Number(tokenId), history, this.turnLoaderOff);
                                          }}
                                          data-testid="removeGemButton"
                                          className="b"
                                        >
                                            {formSubmitted ? (
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
                                  currentPrice={currentPrice}
                                  minPrice={minPrice}
                                  maxPrice={maxPrice}
                                />
                            </div>
                          ) : (
                            <div className="pa5 flex jcc col">
                                <div>
                                    <Input
                                      type="number"
                                      placeholder="duration in days"
                                      className="db"
                                      value={duration}
                                      onChange={e => this.handleChange(Number(e.target.value), 'duration')}
                                      data-testid="durationInputField"
                                      required
                                    />
                                    <Input
                                      type="number"
                                      placeholder="Start price in ether"
                                      className="db"
                                      value={startPrice}
                                      onChange={e => this.handleChange(Number(e.target.value), 'startPrice')}
                                      data-testid="startPriceInputField"
                                      required
                                    />
                                    <Input
                                      type="number"
                                      placeholder="End price in ether"
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
                                                tokenId
                                                && duration
                                                && startPrice
                                                && startPrice > endPrice
                                                && startPrice !== endPrice
                                              )
                                          }
                                          onClick={() => {
                                              const payload = {
                                                  tokenId: Number(tokenId),
                                                  duration: daysToSeconds(duration),
                                                  startPrice: ethToWei(startPrice),
                                                  endPrice: ethToWei(endPrice),
                                              };
                                              this.setState({formSubmitted: true});
                                              handleCreateAuction(payload, this.turnLoaderOff, history);
                                          }}
                                          data-testid="createAuctionButton"
                                        >
                                            {formSubmitted ? (
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
                                <GiftGems gemName={name} sourceImage={sourceImage}/>
                            </div>
                          )}
                      </div>
                  </div>
              </OverlapOnDesktopView>
          </>
        );
    }
}

const actions = {
    handleCreateAuction: createAuction,
    handleRemoveGemFromAuction: removeFromAuction,
};

export default compose(
  connect(
    null,
    actions,
  ),
  withRouter,
)(TradingBox);
