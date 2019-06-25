import React, {PureComponent} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import formatDistance from 'date-fns/formatDistance';
import subMinutes from 'date-fns/subMinutes';
import moment from 'moment-timezone';
import momentDurationFormatSetup from 'moment-duration-format';
import gemBlue from '../../../app/images/icons/gem1.png';
import gemOrange from '../../../app/images/icons/gem2.png';
import gemPurple from '../../../app/images/icons/gem3.png';
import restingEnergy from '../../../app/images/icons/EnergySymbolDull.png';
import goldButton from '../../../app/images/sale/goldButtonWithoutText.png';
import useGoldButton from '../../../app/images/sale/goldButtonWithText.png';
import useSilverButton from '../../../app/images/sale/silverButtonWithText.png';
import silverButton from '../../../app/images/sale/silverButtonNoText.png';
//import levelBackground from '../../../app/images/sale/Level upgrade BG shape.png';
import levelBackground from '../../../app/images/sale/levelUpgradeBG.png';
import gradeMiningBackground from '../../../app/images/sale/gradeMiningUpgradeBG.png';
import energyBackground from '../../../app/images/sale/energyBG.png';
import buyNowImage from "../../../app/images/thickAndWidePinkButton.png";
import {PROCESSING, UNBINDING_GEM} from "../../plots/plotConstants";
import {GEM_LEVEL_UP, GEM_UPGRADE} from "../itemConstants";

momentDurationFormatSetup(moment);

class Gembox extends PureComponent {
    static propTypes = {
        styling: PropTypes.string,
        mobileHeader: PropTypes.bool,
    };

    static defaultProps = {
        styling: '',
        mobileHeader: false,
    };

    gradeConverter = gradeValue => ({
        1: 'D',
        2: 'C',
        3: 'B',
        4: 'A',
        5: 'AA',
        6: 'AAA',
    }[gradeValue]);

    restingEnergyConverter = (restingEnergyMinutes) => {
        const now = Date.now();
        const nowMinusMinutes = subMinutes(now, restingEnergyMinutes);
        const differenceInWords = formatDistance(nowMinusMinutes, now, {
            includeSeconds: true,
        });
        return differenceInWords;
    };

    render() {
        const {
            gem, styling, mobileHeader, handleUseMetals, currentAccount, role, plotMined, handleReleaseGem, gemMines,
        } = this.props;

        console.log('CURRENT ACCOUNT:', currentAccount);

        const unprocessed = gemMines && plotMined && (plotMined.processedBlocks < plotMined.currentPercentage);

        return (
          (gem.state && !plotMined) ? <LoadingText></LoadingText> :
            <div className={styling}>
              <div className="flex tc row" style={{alignItems: 'center', justifyContent: 'space-around'}}>
                  {(!gem.auctionIsLive && role === 'owner') ?
                    <div style={{
                        //backgroundColor: 'rgb(200, 173, 142)',
                        //backgroundImage: 'url('+levelBackground +')',
                        //display: 'flex',
                        alignItems: 'center',
                        maxWidth: '20rem',
                        padding: '18px 5px',
                        backgroundImage: 'url(' + levelBackground + ')',
                        backgroundPosition: 'center center',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        width: '50%',
                        height: '12rem'
                    }}
                    >
                        <Nugget quality="level" value={gem.level} gemImage={gemOrange}/>

                        {gem.txType && gem.txType === GEM_LEVEL_UP &&
                        <div style={{marginTop: '25px'}}>Gem level upgrading isn't finished</div>}
                        {handleUseMetals && !(gem.txType && gem.txType === GEM_LEVEL_UP) && gem.level < 5 && !unprocessed && Number(gem.state) === 0 && (
                          <div
                            style={{
                                backgroundImage: `url(${useSilverButton})`,
                                padding: '10px',
                                cursor: 'pointer',
                                width: '95%',
                                margin: '16px auto',
                                height: '4.5rem',
                                backgroundSize: 'cover',
                            }}
                            onClick={() => {
                                handleUseMetals('silver');
                            }}
                          ></div>)}
                        {(gem.level === 5 || Number(gem.state) !== 0) &&
                        <div
                          style={{
                              backgroundImage: `url(${silverButton})`,
                              padding: '13px 10px 10px 10px',
                              width: '95%',
                              margin: '16px auto',
                              height: '4.5rem',
                              backgroundSize: 'cover',
                              fontSize: '25px',
                              fontWeight: 'bold',
                              color: '#5d5d5d'
                          }}>
                            {gem.level === 5 ? "MAX LEVEL" : "MINING"}
                        </div>}
                    </div> : <Nugget quality="level" value={gem.level} gemImage={gemOrange}/>}

                  {(!gem.auctionIsLive && role === "owner") ?
                    <div style={{
                        //backgroundColor: 'rgb(173, 146, 194)',
                        backgroundImage: 'url(' + gradeMiningBackground + ')',
                        //display: 'flex',
                        alignItems: 'center',
                        maxWidth: '25rem',
                        padding: '18px 10px 4px 10px',
                        margin: '20px 0px 10px',
                        width: '50%',
                        backgroundPosition: 'center center',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        height: '12rem',
                    }}
                    >
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <Nugget quality="grade" value={this.gradeConverter(gem.gradeType)} gemImage={gemBlue}/>
                            <Nugget quality="rate" value={gem.rate} gemImage={gemPurple}/>
                        </div>
                        {gem.txType && gem.txType === GEM_UPGRADE && <div>Gem grade upgrading isn't finished</div>}
                        {handleUseMetals && !(gem.txType && gem.txType === GEM_UPGRADE) && !unprocessed && Number(gem.state) === 0 && (
                          <div
                            style={{
                                backgroundImage: `url(${useGoldButton})`,
                                width: '93%',
                                padding: '0px',
                                margin: '9px 4px',
                                cursor: 'pointer',
                                backgroundSize: 'cover',
                                height: '5rem',
                            }}
                            onClick={() => {
                                handleUseMetals('gold');
                            }}
                          ></div>)}
                        {(unprocessed || Number(gem.state) !== 0) &&
                        <div
                          style={{
                              backgroundImage: `url(${goldButton})`,
                              padding: '13px 10px 10px 10px',
                              width: '95%',
                              margin: '16px auto',
                              height: '5rem',
                              backgroundSize: 'cover',
                              fontSize: '25px',
                              fontWeight: 'bold',
                              color: '#5d5d5d'
                          }}>
                            MINING
                        </div>}
                    </div> : <React.Fragment>
                        <Nugget quality="grade" value={this.gradeConverter(gem.gradeType)} gemImage={gemBlue}/>
                        <Nugget quality="rate" value={gem.rate} gemImage={gemPurple}/>
                    </React.Fragment>
                  }
              </div>
              {Number(gem.state) !== 0 && role === "owner" &&
              <div>
                  <div style={{fontSize: "18px", textAlign: 'center'}}>
                      Stop mining to allow you to, upgrade your gem, sell it on the market, or gift it to a friend
                  </div>
                  {plotMined && plotMined.miningState === UNBINDING_GEM ?
                    <div style={{textAlign: 'center'}}>Going home...</div> :
                    <ProcessButton onClick={() => handleReleaseGem(plotMined)}>
                        Stop
                    </ProcessButton>
                  }
              </div>
              }
              {/*{unprocessed && role === "owner" &&*/}
              {/*<div>*/}
                  {/*<div style={{fontSize: "18px", textAlign: 'center'}}>*/}
                      {/*Gem has mined blocks that are still unprocessed. To upgrade gem please process mined blocks first.*/}
                  {/*</div>*/}
                  {/*{plotMined.miningState === PROCESSING ?*/}
                    {/*<div style={{textAlign: 'center'}}>Processing...</div> :*/}
                    {/*<ProcessButton onClick={() => handleProcessBlocks(plotMined)}>*/}
                        {/*Process*/}
                    {/*</ProcessButton>*/}
                  {/*}*/}
              {/*</div>*/}
              {/*}*/}
              {!mobileHeader
              && !gemMines
              && gem.gradeType >= 4
              && gem.restingEnergy > 0 && (
                <div
                  className="w-100"
                  style={{
                      backgroundImage: `url(${energyBackground})`,
                      backgroundSize: 'cover',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '10px 5px',
                      height: '7rem',
                  }}
                >
                    <div className="flex jcc aic w100">
                        <img src={restingEnergy} alt="Resting Energy" className="h3"/>
                        <p
                          className="ttu f5 mt2 o-50 white tc pt1 b pr2 measure"
                          data-testid="restingEnergy"
                          style={{width: '25rem'}}
                        >
                            {moment
                              .duration(gem.restingEnergy, 'minutes')
                              .format('w [weeks], d [days], h [hours], m [minutes]')}
                        </p>
                    </div>
                </div>
              )}
          </div>
        );
    }
}

export default Gembox;

const ProcessButton = styled.div`
    opacity: ${props => props.disabled ? "0.5" : "1"}
    background-image: url(${buyNowImage});
    background-position: center center;
    text-align: center;
    background-size: contain;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    cursor: pointer;
    color: white;
    font-size: 18px;
    padding: 10px;
`;

const LoadingText = styled.div`
    text-align: center;
    font-size: 26px;
    font-weight: bold;
`;

const Feature = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  grid-template-rows: 1fr;
  align-items: center;
`;

export const Gem = ({quality, image, amount}) => (
  <Feature>
      <img
        src={image}
        alt={quality}
        style={{gridColumn: '1 / -1', gridRow: '2'}}
        className="w-auto center h3"
      />
      <p
        style={{gridRow: 2, gridColumn: 2}}
        className={`ttu f5 mt2 o-50 black tc pt1 b ${quality === 'grade' && 'pr2'}`}
      >
          {quality === 'rate' ? `+${amount}%` : amount}
      </p>
  </Feature>
);

Gem.propTypes = {
    quality: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    image: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Gem.defaultProps = {
    quality: 1,
    image: 1,
    amount: 1,
};

const Nugget = ({quality, value, gemImage}) => (
  <div>
      <small className="ttu white dn-ns">{quality}</small>
      <Gem quality={quality} image={gemImage} amount={value}/>
  </div>
);

Nugget.propTypes = {
    quality: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    gemImage: PropTypes.string.isRequired,
};

Nugget.defaultProps = {
    value: 1,
};
