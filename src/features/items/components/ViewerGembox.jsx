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

        const color = typePaneOutlineColors(gem.color);

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
                    content={gem.rate + "%"}
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
