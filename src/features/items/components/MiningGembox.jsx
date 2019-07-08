import {CutEdgesButton} from "../../../components/CutEdgesButton";
import React, {PureComponent} from 'react';
import styled from 'styled-components';
import moment from 'moment-timezone';
import momentDurationFormatSetup from 'moment-duration-format';
import {STUCK} from "../itemConstants";
import squaredPinkButton from "../../../app/images/squaredPinkButton.png";

momentDurationFormatSetup(moment);

class MiningGembox extends PureComponent {

    render() {
        const {
            gem, unprocessedBlocks, minutesGemCanMine, handleProcessBlocks, handleReleaseGem, totalUnprocessedBlocks, stateName
        } = this.props;

        return (
          <div>
              <PropertyContainer edgeSizes={[5, 10]}>
                  <UnprocessedBlocksContainer>
                      <SmallCaption>Unprocessed Blocks</SmallCaption>
                      <UnprocessedBlocks>
                          <TierIndicator tier={0}>{unprocessedBlocks[0]}</TierIndicator>
                          <TierIndicator tier={1}>{unprocessedBlocks[1]}</TierIndicator>
                          <TierIndicator tier={2}>{unprocessedBlocks[2]}</TierIndicator>
                          <TierIndicator tier={3}>{unprocessedBlocks[3]}</TierIndicator>
                          <TierIndicator tier={4}>{unprocessedBlocks[4]}</TierIndicator>
                          <ProcessButton disabled={totalUnprocessedBlocks === 0}
                                         onClick={() => totalUnprocessedBlocks > 0 && handleProcessBlocks()}>
                              Process {totalUnprocessedBlocks} Blocks
                          </ProcessButton>
                      </UnprocessedBlocks>
                  </UnprocessedBlocksContainer>
                  {stateName !== STUCK &&
                  <FlexColumnContainer>
                      <SmallCaption>Time Till Gem gets Stuck</SmallCaption>
                      <TimeCanMineContainer>
                          {moment.duration(minutesGemCanMine, 'minutes')
                            .format('w [weeks], d [days], h [hours], m [minutes]')}
                      </TimeCanMineContainer>
                  </FlexColumnContainer>
                  }
                  <FlexColumnCenteredContainer>
                      <CutEdgesButton
                        outlineColor={'#F29886'}
                        backgroundColor={'#EF2318'}
                        fontColor={'#F29886'}
                        edgeSizes={12}
                        outlineWidth={2}
                        fontSize={12}
                        height={50}
                        content={"Stop Mining"}
                        otherStyles={"width: 53px; font-weight: bold;"}
                        onClick={() => handleReleaseGem()}
                      />
                  </FlexColumnCenteredContainer>
              </PropertyContainer>
          </div>
        );
    }
}

export default MiningGembox;

const UnprocessedBlocksContainer = styled.div`
    flex: 3 0 180px;
`;

const TimeCanMineContainer = styled.div`
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
`;

const FlexColumnContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 3 1 180px;
    align-items: center;
`;

const FlexColumnCenteredContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 20px 5px 0;
`;

const ProcessButton = styled.div`
    opacity: ${props => props.disabled ? "0.5" : "1"}
    background-image: url(${squaredPinkButton});
    background-position: center center;
    max-width: 50px;
    height: 50px;
    text-align: center;
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    cursor: pointer;
    color: white;
    font-size: 10px
    flex: 1 1 50px;
`;

const PropertyContainer = styled.div`
    margin: 10px 0;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    align-items: stretch;
    align-content: stretch;
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

const TierIndicator = styled.div`
            flex: 1 1 50px;
            max-width: 50px;
            height: 48px;
            padding: 11px 0px;
            text-align: center;
            font-size: 16px;
            margin: 2px;
            clip-path: polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%);
            -webkit-clip-path: polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%);
            background-color: ${props => {
    switch (props.tier) {
        case 0:
            return "#563621";
        case 1:
            return "#592E21";
        case 2:
            return "#525256";
        case 3:
            return "#E2DED3";
        case 4:
            return "#281E1E";
    }
}
  };
            color: ${props => {
    switch (props.tier) {
        case 0:
            return "#C99E85";
        case 1:
            return "#BA8D83";
        case 2:
            return "#AEAEB7";
        case 3:
            return "#7A766C";
        case 4:
            return "#968181";
    }
}
  };
        `;

const UnprocessedBlocks = styled.div`
            width: 100%;
            min-height: 100px;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            padding: 1%;
            z-index: 30;
            border-radius: 15px;
            justify-content: flex-start;
        `;

const SmallCaption = styled.div`
    color: #808e97;
    font-size: 12px;
    text-align: center;
`;