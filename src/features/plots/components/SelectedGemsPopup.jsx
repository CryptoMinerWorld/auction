import React, {Component} from "react";
import styled from "styled-components";
import actionButtonImage from "../../../app/images/noTextGemButton.png";
import octagonImage from "../../../app/images/octagonOutline.png";
import gemImage from "../../../app/images/gemKid.png";


export class SelectedGemsPopup extends Component {

    state = {};

    componentDidMount() {
    }

    render() {

        const container = {
            display: "flex",
            width: "100%",
            padding: "0 10px",
            flexDirection: "column",
            fontSize: "14px"
        }

        const MinedBlocks = styled.div`
            width: 100%;
            display: flex;
            background-color: #24292F;
            padding: 12px 5px;
            z-index: 30;
            border-radius: 15px;
            justify-content: space-evenly;
            flex-wrap: wrap;
            height: 103px;
        `;

        const InfoSection = styled.div`
            display: flex;
            flex-direction: column;
            flex: 7;
            align-items: center;
            border-radius: 10px;
            margin-top: -18px;
            z-index: 30;
        `;

        const ActionButton = styled.div`
            background-image: url(${actionButtonImage});
            background-position: center center;
            text-align: center;
            background-size: cover;
            background-repeat: no-repeat;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            padding: 12px;
            cursor: pointer;
            color: white;
            font-size: 14px;
            margin-top: 10px;
        `;

        const PlotsInfo = styled.div`
            background-color: #24292F;
            padding: 10px 10px;
            border-radius: 10px;
            width: 100%;
            display: flex;
            margin: 6px 0;
            flex-wrap: wrap;
            height: 225px;
        `;

        const Col = styled.div`
            flex: ${props => props.flex}
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
        `;

        const PlotsNotMiningIndicator = styled.div`
            font-size: 28px;
            background-image: url(${octagonImage});
            background-position: center center;
            width: 64px;
            height: 64px;
            text-align: center;
            background-size: contain;
            background-repeat: no-repeat;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 12px;
            cursor: pointer;
            color: #969696;
            align-self: center;
            margin-bottom: 10px;
        `;

        const TierIndicator = styled.div`
            width: 47px;
            padding: 11px 0px;
            text-align: center;
            font-size: 14px;
            margin: 5px;
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
            border-radius: 10px;
        `;

        const ShowButton = styled.div`
            background-color: ${props => props.disabled ? "black" : "#2A3238"};
            border: 3px solid ${props => props.disabled ? "black" : "#62626B"};
            border-radius: 10px;
            font-weight: bold;
            padding: 5px;
            cursor: pointer;
            color: ${props => props.disabled ? "#2A3238" : "white"};
            font-size: 12px;
            text-align: center;
            margin: 5px;
        `;

        const LimitLine = styled.div`
            width: 55px;
            height: 3px;
            font-weight: bold;
            background-color: red;
            position: absolute;
            top: ${props =>
          330 * props.block / 100 + 30 + "px"
          };  
            
           
            &:before {
                display: block;
                content: "${props => props.block}%";
                position: absolute;
                left: 58px;
                top: -10px;
                color: red;
            };  
        `;

        const CurrentLevel = styled.div`
            width: 55px;
            height: ${props =>
          330 * props.block / 100 + "px"
          };  
            font-weight: bold;
            background-color: rgba(53, 53, 53, 0.72);
            position: absolute;
            top: 30px;
            border-bottom: 3px solid black;
         
            &:before {
                display: block;
                content: "${props => props.block}%";
                position: absolute;
                left: 58px;
                bottom: -10px;
                color: white;
            };        
        `;

        const GemMiningImageBlock = styled.div`
            text-align: center;
        `;

        const GemMiningImage = styled.img`
            max-width: 100%;
            max-height: 100%;
        `;

        const MiningStatus = styled.div`
            color: red;
            font-size: 14px;
        `;

        const ButtonsBlock = styled.div`
            background-color: #24292F;
            padding: 10px 10px;
            border-radius: 10px;
            width: 100%;
            min-width: 155px;
        `;

        return (
          <div style={container}>
              <PlotsInfo>
                  <Col flex={1}>
                      <GemMiningImageBlock>
                          <GemMiningImage src={gemImage}/>
                      </GemMiningImageBlock>
                  </Col>
                  <Col flex={1} style={{alignItems: "flex-start"}}>
                      <div>Sapphire #70486</div>
                      <MiningStatus>Status: Can't Mine Deeper</MiningStatus>
                      <div style={{color: "#B37DDC"}}>Mining Rate Bonus: 116.95%</div>
                      <div style={{color: "#8759AE"}}>MRB + Artifact: 136.95% (+20)</div>
                      <div style={{color: "#98C7FF"}}>Grade: AA</div>
                      <div style={{color: "#D02B35"}}>Level (Age): 3(Kid)</div>
                      <ActionButton>UPGRADE GEM</ActionButton>
                  </Col>
              </PlotsInfo>
              <div style={{display: "flex", flexWrap: "wrap"}}>
                  <Col flex={2} style={{marginRight: "10px"}}>
                      <MinedBlocks>
                          <div style={{width: "100%", textAlign: "center", color: "#AEAEB7"}}>
                              Total Blocks Gem has Mined
                          </div>
                          <TierIndicator tier={0}>0</TierIndicator>
                          <TierIndicator tier={1}>2</TierIndicator>
                          <TierIndicator tier={2}>10</TierIndicator>
                          <TierIndicator tier={3}>16</TierIndicator>
                          <TierIndicator tier={4}>0</TierIndicator>
                      </MinedBlocks>
                  </Col>
                  <Col flex={1}>
                      <ButtonsBlock>
                          <ShowButton>Stop Mining</ShowButton>
                          <ShowButton>Go to Gem's Page</ShowButton>
                      </ButtonsBlock>
                  </Col>
              </div>
          </div>
        );
    }
}

export default SelectedGemsPopup;