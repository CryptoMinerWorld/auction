import {CutEdgesButton} from "../../../components/CutEdgesButton";
import {
    gradeOutlineColor,
    gradePaneColors,
    levelOutlineColor,
    levelPaneColors,
    mrbOutlineColor,
    mrbPaneColor,
    stateOutlineColors,
    statePaneColors,
    typePaneColors,
    typePaneOutlineColors
} from "../../plots/components/propertyPaneStyles";
import React, {PureComponent} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import momentDurationFormatSetup from 'moment-duration-format';
import restingEnergy from '../../../app/images/icons/EnergySymbolDull.png';
import goldButton from '../../../app/images/sale/goldButtonWithoutText.png';
import useGoldButton from '../../../app/images/sale/goldButtonWithText.png';
import useSilverButton from '../../../app/images/sale/silverButtonWithText.png';
import silverButton from '../../../app/images/sale/silverButtonNoText.png';
//import levelBackground from '../../../app/images/sale/Level upgrade BG shape.png';
import buyNowImage from "../../../app/images/thickAndWidePinkButton.png";
import {GEM_LEVEL_UP, GEM_UPGRADE} from "../itemConstants";

momentDurationFormatSetup(moment);

const PropertyContainer = styled.div`
    margin: 10px 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: #2A3035;
    padding: 5px;
    clip-path: ${props => {
    const lowerVerticals = (props.edgeSizes[1] || props.edgeSizes) + "%";
    const lowerHorizontals = (props.edgeSizes[0] || props.edgeSizes) + "%";
    const higherVerticals = 100 - (props.edgeSizes[1] || props.edgeSizes) + "%";
    const higherHorizontals = 100 - (props.edgeSizes[0] || props.edgeSizes) + "%";
    return 'polygon(' + lowerHorizontals + ' 0, ' + higherHorizontals + ' 0, 100% ' +
      lowerVerticals + ', 100% ' + higherVerticals + ', ' + higherHorizontals + ' 100%, ' +
      lowerHorizontals + ' 100%, 0% ' + higherVerticals + ', 0 ' + lowerVerticals + ')';
}};
    -webkit-clip-path: ${props => {
    const lowerVerticals = (props.edgeSizes[1] || props.edgeSizes) + "%";
    const lowerHorizontals = (props.edgeSizes[0] || props.edgeSizes) + "%";
    const higherVerticals = 100 - (props.edgeSizes[1] || props.edgeSizes) + "%";
    const higherHorizontals = 100 - (props.edgeSizes[0] || props.edgeSizes) + "%";
    return 'polygon(' + lowerHorizontals + ' 0, ' + higherHorizontals + ' 0, 100% ' +
      lowerVerticals + ', 100% ' + higherVerticals + ', ' + higherHorizontals + ' 100%, ' +
      lowerHorizontals + ' 100%, 0% ' + higherVerticals + ', 0 ' + lowerVerticals + ')';
}};
`;

const UpgradeColumn = styled.div`
    
`;

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

class OwnerGembox extends PureComponent {
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

    render() {
        const {
            gem, styling, mobileHeader, handleUseMetals, currentAccount, role, plotMined, handleReleaseGem, gemMines,
        } = this.props;

        const color = typePaneOutlineColors(gem.color);
        const unprocessed = gemMines && plotMined && (plotMined.processedBlocks < plotMined.currentPercentage);

        return (
          <div className={styling}>
              <NameBox>
                  <CutEdgesButton outlineColor={color}
                                  backgroundColor={typePaneColors(gem.color)}
                                  fontColor={color}
                                  edgeSizes={[3, 20]}
                                  fontSize={20}
                                  outlineWidth={3}
                                  height={38}
                                  content={gem.name}
                                  otherStyles={"width: 220px; font-weight: bold"}
                  />
              </NameBox>
              <StateBox>
                  <CutEdgesButton outlineColor={stateOutlineColors("idle")}
                                  backgroundColor={statePaneColors("idle")}
                                  fontColor={stateOutlineColors("idle")}
                                  edgeSizes={[5, 20]}
                                  fontSize={20}
                                  outlineWidth={3}
                                  height={34}
                                  content={"Idle"}
                                  otherStyles={"width: 220px; font-weight: bold"}
                  />
              </StateBox>
              <PropertyContainer edgeSizes={[5, 10]}>
                  <div style={{display: "flex", marginBottom: "5px", alignItems: "center"}}>
                      <div style={{
                          fontSize: "18px",
                          color: "#808e97",
                          fontWeight: "bold",
                          width: "73px"
                      }}>
                          <div>Level</div>
                          <div>Age</div>
                      </div>

                      <CutEdgesButton
                        outlineColor={levelOutlineColor}
                        backgroundColor={levelPaneColors(gem.level)}
                        fontColor={levelOutlineColor}
                        edgeSizes={12}
                        outlineWidth={2}
                        fontSize={20}
                        height={73}
                        content={gem.level + " Baby"}
                        otherStyles={"width: 76px; font-weight: bold;"}/>
                  </div>
                  <UpgradeColumn>
                      {gem.txType && gem.txType === GEM_LEVEL_UP && (
                        <div style={{marginTop: '25px'}}>Gem level upgrading isn't finished</div>)}
                      {handleUseMetals && !(gem.txType && gem.txType === GEM_LEVEL_UP) && gem.level < 5 && !unprocessed && Number(gem.state) === 0 && !gemMines && (
                        <div style={{
                            backgroundImage: `url(${useSilverButton})`,
                            padding: '10px',
                            cursor: 'pointer',
                            width: '200px',
                            height: '72px',
                            textAlign: 'center',
                            backgroundSize: 'cover'
                        }}
                             onClick={() => {
                                 handleUseMetals('silver');
                             }}
                        />)}
                      {(gem.level === 5 || Number(gem.state) !== 0 || gemMines) && (
                        <div style={{
                            backgroundImage: `url(${silverButton})`,
                            padding: '13px 10px 10px 10px',
                            width: '200px',
                            height: '72px',
                            textAlign: 'center',
                            backgroundSize: 'cover',
                            fontSize: '25px',
                            fontWeight: 'bold',
                            color: '#5d5d5d'
                        }}>
                            {gem.level === 5 ? "MAX LEVEL" : "MINING"}
                        </div>)}
                  </UpgradeColumn>
              </PropertyContainer>


              <PropertyContainer edgeSizes={[5, 10]}>
                  <div>
                      <div style={{display: "flex", marginBottom: "5px", alignItems: "center"}}>
                          <div style={{
                              fontSize: "18px",
                              color: "#808e97",
                              fontWeight: "bold",
                              width: "73px"
                          }}>Grade</div>
                          <CutEdgesButton
                            outlineColor={gradeOutlineColor}
                            backgroundColor={gradePaneColors(gem.gradeType)}
                            fontColor={gradeOutlineColor}
                            edgeSizes={[10, 20]}
                            outlineWidth={2}
                            fontSize={20}
                            height={35}
                            content={this.gradeConverter(gem.gradeType)}
                            otherStyles={"width: 76px; font-weight: bold;"}/>
                      </div>

                      <div style={{display: "flex", marginTop: "5px", alignItems: "center"}}>
                          <div style={{
                              fontSize: "18px",
                              color: "#808e97",
                              fontWeight: "bold",
                              width: "73px"
                          }}>MRB</div>
                          <CutEdgesButton
                            outlineColor={mrbOutlineColor}
                            backgroundColor={mrbPaneColor}
                            fontColor={mrbOutlineColor}
                            edgeSizes={[10, 20]}
                            outlineWidth={2}
                            fontSize={16}
                            height={35}
                            content={gem.rate + "%"}
                            otherStyles={"width: 76px; font-weight: bold;"}/>
                      </div>
                  </div>
                  {gem.txType && gem.txType === GEM_UPGRADE && <div>Gem grade upgrading isn't finished</div>}
                  {handleUseMetals && !(gem.txType && gem.txType === GEM_UPGRADE) && !unprocessed && Number(gem.state) === 0 && !gemMines && (
                    <div
                      style={{
                          backgroundImage: `url(${useGoldButton})`,
                          width: '200px',
                          padding: '0px',
                          margin: '9px 4px',
                          cursor: 'pointer',
                          backgroundSize: 'cover',
                          height: '80px',
                      }}
                      onClick={() => {
                          handleUseMetals('gold');
                      }}
                    />)}
                  {(unprocessed || Number(gem.state) !== 0 || gemMines) &&
                  <div
                    style={{
                        backgroundImage: `url(${goldButton})`,
                        padding: '20px 0px 20px',
                        width: '200px',
                        margin: '9px 4px',
                        height: '80px',
                        backgroundSize: 'cover',
                        fontSize: '25px',
                        fontWeight: 'bold',
                        color: '#5d5d5d',
                        textAlign: 'center'
                    }}>
                      MINING
                  </div>}
              </PropertyContainer>


              {!mobileHeader
              && !gemMines
              && gem.gradeType >= 4
              && gem.restingEnergy > 0 && (
                <PropertyContainer edgeSizes={[5, 10]}>
                    <div style={{
                        fontSize: "18px",
                        color: "#235a46",
                        fontWeight: "bold",
                        width: "80px"
                    }}>
                        Resting Energy
                    </div>
                    <img src={restingEnergy} alt="Resting Energy" className="h3"/>
                    <p
                      className="ttu f5 mt2 tc pt1 b pr2 measure"
                      data-testid="restingEnergy"
                      style={{color: "#81ccb4"}}
                    >
                        {moment
                          .duration(gem.restingEnergy, 'minutes')
                          .format('w [weeks], d [days], h [hours], m [minutes]')}
                    </p>
                </PropertyContainer>
              )}


              {/*{Number(gem.state) !== 0 &&*/}
              {/*<div>*/}
              {/*<div style={{fontSize: "18px", textAlign: 'center'}}>*/}
              {/*Stop mining to allow you to, upgrade your gem, sell it on the market, or gift it to a friend*/}
              {/*</div>*/}
              {/*{plotMined && plotMined.miningState === UNBINDING_GEM ?*/}
              {/*<div style={{textAlign: 'center'}}>Going home...</div> :*/}
              {/*<ProcessButton onClick={() => handleReleaseGem(plotMined, () => {*/}
              {/*}, () => {*/}
              {/*})}>*/}
              {/*Stop Mining*/}
              {/*</ProcessButton>*/}
              {/*}*/}
              {/*</div>*/}
              {/*}*/}

          </div>
        );
    }
}

export default OwnerGembox;

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

