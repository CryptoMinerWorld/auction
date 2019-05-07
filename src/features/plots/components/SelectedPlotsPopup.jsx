import {Component} from "react";
import styled from "styled-components";
import React from "react";
import actionButtonImage from "../../../app/images/noTextGemButton.png";
import octagonImage from "../../../app/images/octagonOutline.png";
import gemImage from "../../../app/images/gemKid.png";
import indiaImage from "../../../app/images/flags/in.png";
import {CutEdgesButton} from "./CutEdgesButton";


const PopupContainer = styled.div`
            display: flex;
            width: 100%;
            padding: 0 2%;
            flex-wrap: wrap;
            max-width: 520px;
        `;

const UnprocessedBlocks = styled.div`
            width: 100%;
            display: flex;
            background-color: #24292F;
            padding: 1%;
            z-index: 30;
            border-radius: 15px;
            margin-top: 5px;
            justify-content: space-evenly;
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
        `;

const PlotsInfo = styled.div`
            background-color: #24292F;
            padding: 5px 10px;
            border-radius: 10px;
            width: 100%;
            display: flex;
            margin: 6px 0 0;
            flex-wrap: wrap;
            
        `;

const Col = styled.div`
            flex: ${props => props.flex}
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
        `;

const Row = styled.div`
            flex: ${props => props.flex}
            display: flex;
            justify-content: space-evenly;
            flex-wrap: wrap;
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
        
            @media(max-width: 420px) {
                width: 40px;
                padding: 6px 0;
                font-size: 12px;
            }
        
            width: 50px;
            padding: 11px 0px;
            text-align: center;
            font-size: 14px;
            margin: 5px 1%;
            clip-path: polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%);
            -webkit-clip-path: polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%);
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
        `;

// const ShowButton = styled.div`
//     background-color: ${props => props.disabled? "black" : "#2A3238"};
//     border: 3px solid ${props => props.disabled? "black" : "#62626B"};
//     border-radius: 10px;
//     font-weight: bold;
//     padding: 5px;
//     cursor: pointer;
//     color: ${props => props.disabled? "#2A3238" : "white"};
//     font-size: 12px;
//     text-align: center;
//     margin: 5px;
// `;

const LimitLine = styled.div`
            width: 55px;
            height: 3px;
            font-weight: bold;
            background-color: red;
            position: absolute;
            top: ${props =>
  330*props.block/100+30+"px"
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
  330*props.block/100+"px"
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

            @media(max-width: 420px) {
                width: 79px;
                height: 79px;
            }
        
            width: 100px;
            height: 100px;
            background-color: #AEAEB7;
            border: 2px solid #525256;
            text-align: center;
        `;

const GemMiningImage = styled.img`
            max-width: 100%;
            max-height: 100%;
        `;

const CountryImageBlock = styled.div`
            
            @media(max-width: 420px) {
                width: 79px;
                height: 79px;
            }
        
            width: 100px;
            height: 100px;
            text-align: center;
        `;

const CountryImage = styled.img`
            max-width: 100%;
            max-height: 100%;
        `;

const ProgressStats = styled.div`
            @media(max-width: 420px) {
                font-size: 11px;
            }
        
            font-size: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: #24292F;
            padding: 5px;
            margin-top: -12px;
            z-index: 30;
            border-radius: 10px;
            margin-right: 15px;
            flex: 3;
            position: relative;
        `;

const TierLevel = styled.div`
            width: 55px;
            position: relative;
            font-size: 14px;
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
            height: ${props =>
  330*props.blocks/100+"px"
  };  
            
            &:before {
                display: block;
                content: "${props => props.blocks}";
                position: absolute;
                left: -26px;
                top: ${props =>
  165*props.blocks/100-10+"px"
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
            }
        `;

export class PlotsPopup extends Component {

    state = {

    };

    componentDidMount() {
    }

    render() {

        return (
          <PopupContainer>
              <ProgressStats>
                  <div style={{fontWeight: "bold", marginBottom: "7px"}}>Progress Stats</div>
                  <TierLevel tier={0} blocks={22}/>
                  <TierLevel tier={1} blocks={28}/>
                  <TierLevel tier={2} blocks={10}/>
                  <TierLevel tier={3} blocks={31}/>
                  <TierLevel tier={4} blocks={9}/>
                  <LimitLine block={91}/>
                  <CurrentLevel block={63}/>
              </ProgressStats>
              <InfoSection>
                  <PlotsInfo>
                      <Col flex={4} style={{minWidth: "150px"}}>
                          <div>Plot #052163</div>
                          <div style={{color: "#AEAEB7"}}>Blocks Not Mined: 24</div>
                          <div>Gem Mining: Yes</div>
                          <div style={{color: "#AEAEB7"}}>Gem Can Mine: 15 More Blocks</div>
                          <div>Time Gem Can Mine: 2 days 15 hours</div>
                          <div style={{color: "#AEAEB7"}}>Can Gem Finish: No</div>
                          <div>Blocks Processed: 48</div>
                          <div style={{color: "#AEAEB7"}}>Located in Country: India</div>
                      </Col>
                      <Row flex={3} style={{alignItems: "center"}}>
                          <GemMiningImageBlock>
                              <GemMiningImage src={gemImage}/>
                          </GemMiningImageBlock>
                          <CountryImageBlock>
                              <CountryImage src={indiaImage}/>
                          </CountryImageBlock>
                      </Row>
                  </PlotsInfo>
                  <PlotsInfo>
                      <Col flex={1}>
                          <ShowButton disabled={true} content={"Start"}/>
                          <ShowButton disabled={true} content={"Sell"}/>
                      </Col>
                      <Col flex={1}>
                          <ShowButton disabled={false} content={"Stop"}/>
                          <ShowButton disabled={true} contnet={"Gift"}/>
                      </Col>
                  </PlotsInfo>
                  <PlotsInfo>
                      <Col flex={1} style={{color: "#AEAEB7"}}>Items Found: 6</Col>
                      <Col flex={1}><ShowButton content={"Show Items"}/></Col>
                  </PlotsInfo>
              </InfoSection>
              <UnprocessedBlocks>
                  <TierIndicator tier={0}>0</TierIndicator>
                  <TierIndicator tier={1}>2</TierIndicator>
                  <TierIndicator tier={2}>10</TierIndicator>
                  <TierIndicator tier={3}>16</TierIndicator>
                  <TierIndicator tier={4}>0</TierIndicator>
                  <div style={{flex: 1, padding: "1px 0", maxWidth: "160px"}}>
                        <ShowButton height={40} edgeSizes={[5, 15]} content={"Process 28 Blocks"}/>
                  </div>
              </UnprocessedBlocks>
          </PopupContainer>
        );
    }
}

const ShowButtonWrapper = styled.div`
    @media(max-width: 420px) {
        padding: 2px;
        line-height: 1;
    }
    padding: 5px;
    width: 100%;
`;

const ShowButton = ({content, disabled, ...props}) => {
    return (
      <ShowButtonWrapper>
          <CutEdgesButton outlineColor={disabled ? "black" : "#62626B"}
                          backgroundColor={disabled ? "black" : "#2A3238"}
                          edgeSizes={[5, 20]}
                          outlineWidth={2}
                          fontColor={disabled ? "#2A3238" : "white"}
                          height={32}
                          fontSize={12}
                          content={content}
                          {...props}/>
      </ShowButtonWrapper>)
}

export default PlotsPopup;