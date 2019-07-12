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

class OwnerGradeRateEnergyGembox extends PureComponent {

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

        const unprocessed = gemMines && plotMined && (plotMined.processedBlocks < plotMined.currentPercentage);

        return (
          <div className={styling}>
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
                  {gem.txType && gem.txType === GEM_UPGRADE && <div style={{width: '200px'}}>Gem grade upgrading isn't finished</div>}
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
          </div>
        );
    }
}

export default OwnerGradeRateEnergyGembox;
