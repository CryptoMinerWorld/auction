import {CutEdgesButton} from "../../../components/CutEdgesButton";
import {levelOutlineColor, levelPaneColors} from "../../plots/components/propertyPaneStyles";
import React, {PureComponent} from 'react';
import styled from 'styled-components';
import moment from 'moment-timezone';
import momentDurationFormatSetup from 'moment-duration-format';
import useSilverButton from '../../../app/images/sale/silverButtonWithText.png';
import silverButton from '../../../app/images/sale/silverButtonNoText.png';
import {GEM_LEVEL_UP} from "../itemConstants";

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


const levelToGemAge = (level) => (
  {
      1: "Baby",
      2: "Toddler",
      3: "Child",
      4: "Teen",
      5: "Adult"
  }[level]);

class OwnerLevelGembox extends PureComponent {

    render() {
        const {
            gem, styling, mobileHeader, handleUseMetals, currentAccount, role, plotMined, handleReleaseGem, gemMines,
        } = this.props;

        const unprocessed = gemMines && plotMined && (plotMined.processedBlocks < plotMined.currentPercentage);

        return (
          <div className={styling}>
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
                        content={gem.level + " " + levelToGemAge(gem.level)}
                        otherStyles={"width: 76px; font-weight: bold;"}/>
                  </div>
                  <UpgradeColumn>
                      {gem.txType && gem.txType === GEM_LEVEL_UP && (
                        <div style={{width: '200px'}}>Gem level upgrading isn't finished</div>)}
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
          </div>
        );
    }
}

export default OwnerLevelGembox;
