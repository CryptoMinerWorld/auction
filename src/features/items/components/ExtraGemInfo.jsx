import React from 'react';
import styled from 'styled-components';


const Container = styled.div`
    padding: 10px 20px;
    font-weight: bold;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    width: 100%;
    background-color: #383F45;
    -webkit-clip-path: polygon(100.23% 96.54%, 95.12% 99.87%, 8.69% 100.01%, 1.21% 98.76%, -0.22% 92.82%, 0.03% 2.74%, 4.31% -0.23%, 92.22% -0.24%, 98.41% 1.33%, 100.1% 5.29%);
    clip-path: polygon(100.23% 96.54%, 95.12% 99.87%, 8.69% 100.01%, 1.21% 98.76%, -0.22% 92.82%, 0.03% 2.74%, 4.31% -0.23%, 92.22% -0.24%, 98.41% 1.33%, 100.1% 5.29%);
`;

const Caption = styled.div`
    color: #808e97;
    font-size: 24px;
    text-align: center;
`;

const SmallCaption = styled.div`
    color: #808e97;
    font-size: 14px;
    text-align: center;
`;

const RowLabel = styled.div`
    color: #808e97;
    font-size: 14px;
    width: 250px;
    float: left;
`;

const RowValue = styled.div`
    color: #adbcc4;
    font-size: 14px;
    width: 60px;
    float: left;
`;

const TierIndicator = styled.div`
        
            @media(max-width: 420px) {
                width: 40px;
                padding: 6px 0;
                font-size: 12px;
            }
            
            width: 65px;
            padding: 14px 0px;
            text-align: center;
            font-size: 16px;
            margin: 0px 1%;
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

const ProcessedBlocks = styled.div`
            width: 100%;
            max-width: 480px;
            display: flex;
            padding: 1%;
            z-index: 30;
            border-radius: 15px;
            margin-top: 5px;
            justify-content: space-evenly;
        `;

const ExtraGemInfo = ({totalTimeMined, totalItemsMinedUp, creationTime, totalBlocksProcessed}) => {

    return (
      <Container className="measure-l">
          <Caption>Extra Gem Info</Caption>
          <div>
              <RowLabel>Total Time Mined (D-H-M)</RowLabel>
              <RowValue>{totalTimeMined}</RowValue>
          </div>
          <div>
              <RowLabel>Total Items Mined up</RowLabel>
              <RowValue>{totalItemsMinedUp}</RowValue>
          </div>
          <div>
              <RowLabel>Creation Date (D-M-Y)</RowLabel>
              <RowValue>{creationTime}</RowValue>
          </div>
          <div>
              <SmallCaption>Total Blocks Processed</SmallCaption>
              <ProcessedBlocks>
                  <TierIndicator tier={0}>{totalBlocksProcessed[0]}</TierIndicator>
                  <TierIndicator tier={1}>{totalBlocksProcessed[1]}</TierIndicator>
                  <TierIndicator tier={2}>{totalBlocksProcessed[2]}</TierIndicator>
                  <TierIndicator tier={3}>{totalBlocksProcessed[3]}</TierIndicator>
                  <TierIndicator tier={4}>{totalBlocksProcessed[4]}</TierIndicator>
              </ProcessedBlocks>
          </div>
      </Container>
    )
};

export default ExtraGemInfo;