import {Component} from "react";
import styled from "styled-components";
import React from "react";
import actionButtonImage from "../../../app/images/noTextGemButton.png";
import octagonImage from "../../../app/images/octagonOutline.png";

export class PlotsPopup extends Component {

    state = {

    };

    componentDidMount() {
    }

    render() {

        const container = {
            display: "flex",
            width: "100%",
            padding: "0 10px"
        }

        const UnprocessedBlocks = styled.div`
            display: flex;
            flex-direction: column;
            flex: 3;
            align-items: stretch;
            margin-right: 20px;
            background-color: #24292F;
            padding: 5px;
            margin-top: -12px;
            z-index: 30;
            border-radius: 15px;
        `;

        const InfoSection = styled.div`
            display: flex;
            flex-direction: column;
            flex: 7;
            align-items: center;
            border-radius: 10px;
            margin-top: -12px;
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
        `;

        const PlotsInfo = styled.div`
            background-color: #24292F;
            padding: 5px 10px;
            border-radius: 10px;
            width: 100%;
            display: flex;
            margin: 6px 0;
            flex-wrap: wrap;
            
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
            padding: 0px 0;
            text-align: center;
            font-size: 44px;
            line-height: 64px;
            margin: 5px;
            background-color: ${props => {
                switch(props.tier) {
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
                }}
            };
            color: ${props => {
                switch(props.tier) {
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
                }}
            };
            border-radius: 10px;
        `;

        const ShowButton = styled.div`
            background-color: #2A3238;
            border: 3px solid #62626B;
            border-radius: 10px;
            font-weight: bold;
            padding: 5px;
            cursor: pointer;
            color: white;
            font-size: 12px;
            text-align: center;
            margin: 5px;
        `;

        return (
          <div style={container}>
              <UnprocessedBlocks>
                  <div style={{fontSize: "12px", fontWeight: "bold"}}>Unprocessed Blocks</div>
                  <TierIndicator tier={0}>53</TierIndicator>
                  <TierIndicator tier={1}>46</TierIndicator>
                  <TierIndicator tier={2}>23</TierIndicator>
                  <TierIndicator tier={3}>17</TierIndicator>
                  <TierIndicator tier={4}>6</TierIndicator>
                  <ActionButton>PROCESS</ActionButton>
              </UnprocessedBlocks>
              <InfoSection>
                  <ActionButton>BUY PLOTS OF LAND</ActionButton>
                  <PlotsInfo>
                      <Col flex={3}>
                          <div>Plots Owned: 22222</div>
                          <div style={{color: "#AEAEB7"}}>Plots 100% Mined: 22222</div>
                          <div>Plots With No Gem: 22222</div>
                          <div style={{color: "#AEAEB7"}}>Blocks Not Mined: 22222</div>
                      </Col>
                      <Col flex={2} style={{alignItems: "center"}}>
                          <PlotsNotMiningIndicator>
                              282
                          </PlotsNotMiningIndicator>
                          <span style={{color: "#AEAEB7"}}>Plots Not Mining</span>
                      </Col>
                  </PlotsInfo>
                  <PlotsInfo>
                      <div style={{width: "100%", textAlign: "center", color: "#AEAEB7"}}>Total Processed Blocks</div>
                      <Col flex={1} style={{color: "#fff776"}}>
                          <div>Tier 1 (Dirt, Snow): 222</div>
                          <div>Tier 3 (Limestone): 222</div>
                          <div>Tier 5 (Obsidian): 333</div>
                      </Col>
                      <Col flex={1} style={{color: "#fff776"}}>
                          <div>Tier 2 (Clay, Ice): 333</div>
                          <div>Tier 4 (Marble): 333</div>
                          <div>BoP Geodes: 233</div>
                      </Col>
                  </PlotsInfo>
                  <PlotsInfo>
                      <Col flex={1}>Items Found: 1234</Col>
                      <Col flex={1}><ShowButton>Show Items</ShowButton></Col>
                  </PlotsInfo>
                  <PlotsInfo>
                      <div style={{width: "100%", textAlign: "center", color: "#AEAEB7"}}>Show only Plots with:</div>
                      <Col flex={1}>
                          <ShowButton>No Gems</ShowButton>
                          <ShowButton>100 Blocks</ShowButton>
                      </Col>
                      <Col flex={1}>
                          <ShowButton>Stuck Gems</ShowButton>
                          <ShowButton>0 Blocks</ShowButton>
                      </Col>
                  </PlotsInfo>
              </InfoSection>
          </div>
        );
    }
}

export default PlotsPopup;