import React, {PureComponent} from 'react';
import {CutEdgesButton} from "../../../components/CutEdgesButton";
import {
    energyOutlineColor,
    energyPaneColor,
    gradeOutlineColor,
    gradePaneColors,
    levelOutlineColor,
    levelPaneColors,
    mrbOutlineColor,
    mrbPaneColor,
    stateOutlineColors,
    statePaneColors,
    type,
    typePaneColors,
    typePaneOutlineColors
} from "../../plots/components/propertyPaneStyles";
import {formatRestingEnergy} from "../../../app/services/GemService";
import styled from "styled-components";


const Stats = styled.div`
    display: flex;
    justify-content: space-evenly;
    width: 100%;
    margin: 5px 0;
`;


class ViewerGembox extends PureComponent {

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

        const rateBoxContent = '' + gem.baseRate + '%' + (gem.rate > gem.baseRate ? (' \\a' + ' ' + gem.rate + '%') : "");
        return (
          <div className={styling}>
              <Stats>
                  <CutEdgesButton
                    outlineColor={levelOutlineColor}
                    backgroundColor={levelPaneColors(gem.level)}
                    fontColor={levelOutlineColor}
                    edgeSizes={12}
                    outlineWidth={2}
                    fontSize={20}
                    height={51}
                    content={gem.level}
                    otherStyles={"width: 53px; font-weight: bold;"}/>
                  <CutEdgesButton
                    outlineColor={gradeOutlineColor}
                    backgroundColor={gradePaneColors(gem.gradeType)}
                    fontColor={gradeOutlineColor}
                    edgeSizes={12}
                    outlineWidth={2}
                    fontSize={20}
                    height={51}
                    content={this.gradeConverter(gem.gradeType)}
                    otherStyles={"width: 53px; font-weight: bold;"}/>
                  <CutEdgesButton
                    outlineColor={mrbOutlineColor}
                    backgroundColor={mrbPaneColor}
                    fontColor={mrbOutlineColor}
                    edgeSizes={[5, 12]}
                    outlineWidth={2}
                    fontSize={16}
                    height={51}
                    content={rateBoxContent}
                    otherStyles={"width: 85px; font-weight: bold;"}/>
                  {Number(gem.state) === 0 && gem.restingEnergy && gem.restingEnergy > 0 ?
                    <CutEdgesButton
                      outlineColor={energyOutlineColor}
                      backgroundColor={energyPaneColor}
                      fontColor={energyOutlineColor}
                      edgeSizes={[5, 12]}
                      outlineWidth={2}
                      fontSize={14}
                      height={51}
                      content={formatRestingEnergy(gem.restingEnergy)}
                      otherStyles={"width: 85px; font-weight: bold;"}/> : ''
                  }
              </Stats>
          </div>
        );
    }
}

export default ViewerGembox;
