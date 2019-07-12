import React, {Component} from "react";
import styled from "styled-components";
import actionButtonImage from "../../../app/images/noTextGemButton.png";
import octagonImage from "../../../app/images/octagonOutline.png";
import indiaImage from "../../../app/images/flags/in.png";
import {CutEdgesButton} from "../../../components/CutEdgesButton";
import {MINED, MINING, NEW_PLOT, NO_GEM, NOT_MINING, STUCK} from "../plotConstants";
import {getCountryData} from "../plotActions";
import buyNowImage from "../../../app/images/thickAndWidePinkButton.png";
import {blocksToMinutes, convertMinutesToTimeString, getTimeLeftMinutes} from "../../../app/services/PlotService";

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
            height: 4px;
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
                left: 16px;
                top: 5px;
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
            border-bottom: 4px solid black;
         
            &:before {
                display: block;
                content: "${props => props.block}%";
                position: absolute;
                left: 16px;
                bottom: -22px;
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
            cursor: pointer;
            display: flex;
            font-size: 22px;
            align-items: center;
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
            display: flex;
            align-items: center;
            justify-content: center;
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
            z-index: 31;
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
            height: ${props =>
  330 * props.blocks / 100 + "px"
  };  
            
            &:before {
                display: block;
                content: "${props => props.blocks}";
                position: absolute;
                left: -26px;
                top: ${props =>
  165 * props.blocks / 100 - 10 + "px"
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
            }
            
            &:after {
                display: block;
                content: "${props => props.time}";
                position: absolute;
                right: -35px;
                line-height: 10px;
                width: 30px;
                top: ${props =>
  165 * props.blocks / 100 - 10 + "px"
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
            }
        `;

export class PlotsPopup extends Component {

    state = {
        plotCountryData: null,
    };

    async componentDidMount() {
        const country = await getCountryData(this.props.plot.countryId);
        console.log("COUNTRY:", country);
        this.setState({plotCountryData: country});
    }

    render() {
        const {plotCountryData} = this.state;
        const {plot, processBlocks} = this.props;
        const limitLine = plot.gemMines ? plot.layerEndPercentages[plot.gemMines.level - 1] : 100;
        let totalUnprocessedBlocks = [0, 0, 0, 0, 0];
        let totalUnprocessedSum = 0;
        if (plot.currentPercentage !== plot.processedBlocks) {
            totalUnprocessedBlocks[0] = Math.max(Math.min(plot.currentPercentage, plot.layerEndPercentages[0]) - Math.max(0, plot.processedBlocks),0);
            totalUnprocessedSum = totalUnprocessedBlocks[0];
            for (let i = 1; i < 5; i++) {
                totalUnprocessedBlocks[i] = Math.max(Math.min(plot.currentPercentage, plot.layerEndPercentages[i])
                  - Math.max(plot.layerEndPercentages[i - 1], plot.processedBlocks), 0);
                totalUnprocessedSum += totalUnprocessedBlocks[i];
            }
        }
        const countryId = plot.countryId;
        console.log("SELECTED PLOT:", plot);
        const timePerTier = plot.gemMines ? blocksToMinutes(plot) : ["", "", "", "", ""];

        return (
          <PopupContainer>
              <ProgressStats>
                  <div style={{fontWeight: "bold", marginBottom: "7px"}}>Progress Stats</div>
                  <TierLevel tier={0} blocks={plot.layerPercentages[0]} time={timePerTier[0]}/>
                  <TierLevel tier={1} blocks={plot.layerPercentages[1]} time={timePerTier[1]}/>
                  <TierLevel tier={2} blocks={plot.layerPercentages[2]} time={timePerTier[2]}/>
                  <TierLevel tier={3} blocks={plot.layerPercentages[3]} time={timePerTier[3]}/>
                  <TierLevel tier={4} blocks={plot.layerPercentages[4]} time={timePerTier[4]}/>
                  {plot.gemMines && <LimitLine block={limitLine}/>}
                  <CurrentLevel block={plot.currentPercentage}/>
              </ProgressStats>
              <InfoSection>
                  <PlotsInfo>
                      <Col flex={4} style={{minWidth: "150px"}}>
                          <div>Plot #{plot.id}</div>
                          <div style={{color: "#AEAEB7"}}>Blocks Not Mined: {100 - plot.currentPercentage}</div>
                          <div>Gem Mining: {plot.gemMines ? "Yes" : "No"}</div>
                          {plot.gemMines &&
                          <div style={{color: "#AEAEB7"}}>Gem Can Mine: {limitLine - plot.currentPercentage} More
                              Blocks</div>}
                          {plot.gemMines && false && <div>Time Gem Can Mine: {convertMinutesToTimeString(getTimeLeftMinutes(plot, plot.gemMines)/60)} hours</div>}
                          {plot.gemMines &&
                          <div style={{color: "#AEAEB7"}}>Can Gem Finish: {limitLine === 100 ? "Yes" : "No"}</div>}
                          <div>Blocks Processed: {plot.processedBlocks}</div>
                          <div style={{color: "#AEAEB7"}}>Located in Country: {plotCountryData && plotCountryData.name}</div>
                      </Col>
                      <Row flex={3} style={{alignItems: "center"}}>
                          <GemMiningImageBlock onClick={() => {
                              plot.gemMines ? this.props.showAnotherPopup("gems-selected") :
                              (plot.miningState === NO_GEM || plot.miningState === NEW_PLOT) && this.props.showAnotherPopup("plot-action-start")}}>
                              {plot.gemMines ?
                              <GemMiningImage src={plot.gemMines.image}/> : <span>Select a gem</span>}
                          </GemMiningImageBlock>
                          <CountryImageBlock>
                              <CountryImage src={plotCountryData && plotCountryData.imageLinkSmall}
                                            alt={"Image loading"}/>
                          </CountryImageBlock>
                      </Row>
                  </PlotsInfo>
                  <PlotsInfo>
                      <Col flex={1}>
                          <ShowButton disabled={plot.miningState !== NEW_PLOT && plot.miningState !== NO_GEM} content={"Start"}
                          onClick={() => !plot.gemMines && this.props.showAnotherPopup("plot-action-start")}/>
                          <ShowButton disabled={true} content={"Sell"}/>
                      </Col>
                      <Col flex={1}>
                          <ShowButton disabled={plot.miningState !== MINED && plot.miningState !== MINING && plot.miningState !== STUCK}
                                      content={"Stop"}
                          onClick={() => this.props.stopMining(plot)}/>
                          {/*plot.gemMines &&*/}
                          <ShowButton disabled={true} content={"Gift"}/>
                      </Col>
                  </PlotsInfo>
                  {/*<PlotsInfo>*/}
                      {/*<Col flex={1} style={{color: "#AEAEB7"}}>Items Found: 6</Col>*/}
                      {/*<Col flex={1}><ShowButton content={"Show Items"}/></Col>*/}
                  {/*</PlotsInfo>*/}
              </InfoSection>
              <UnprocessedBlocks>
                  <TierIndicator tier={0}>{totalUnprocessedBlocks[0]}</TierIndicator>
                  <TierIndicator tier={1}>{totalUnprocessedBlocks[1]}</TierIndicator>
                  <TierIndicator tier={2}>{totalUnprocessedBlocks[2]}</TierIndicator>
                  <TierIndicator tier={3}>{totalUnprocessedBlocks[3]}</TierIndicator>
                  <TierIndicator tier={4}>{totalUnprocessedBlocks[4]}</TierIndicator>
                  <div style={{flex: 1, padding: "1px 0", maxWidth: "160px"}}>
                      <ProcessButton disabled={totalUnprocessedSum === 0}
                                     onClick={() => totalUnprocessedSum > 0 && processBlocks(plot)}>
                          Process {totalUnprocessedSum} Blocks</ProcessButton>
                      {/*<ShowButton disabled={totalUnprocessedSum === 0} height={40} edgeSizes={[5, 15]} content={`Process ${totalUnprocessedSum} Blocks`}*/}
                      {/*onClick={() => totalUnprocessedSum > 0 && processBlocks(plot.id)}/>*/}
                  </div>
              </UnprocessedBlocks>
          </PopupContainer>
        );
    }
}

const ProcessButton = styled.div`
    opacity: ${props => props.disabled ? "0.5" : "1"}
    background-image: url(${buyNowImage});
    background-position: center center;
    width: 100%;
    height: 100%;
    text-align: center;
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    cursor: pointer;
    color: white;
    font-size: 15px
`;

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
          <CutEdgesButton outlineColor={disabled ? "#191D21" : "#62626B"}
                          backgroundColor={disabled ? "#191D21" : "#2A3238"}
                          edgeSizes={[5, 20]}
                          outlineWidth={2}
                          fontColor={disabled ? "#293137" : "#D4D4E2"}
                          height={42}
                          fontSize={20}
                          content={content}
                          {...props}/>
      </ShowButtonWrapper>)
};

export default PlotsPopup;