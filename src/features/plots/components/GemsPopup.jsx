import React, {Component} from "react";
import styled from "styled-components";
import actionButtonImage from "../../../app/images/noTextGemButton.png";
import octagonImage from "../../../app/images/octagonOutline.png";
import {CutEdgesButton} from "./CutEdgesButton";
import {CANT_MINE, FINISHED, MINING, STUCK} from "../plotConstants";

const setMiningFilters = {
    plotFilterOptions: [MINING],
    tierFilterOptions: ["dirt_filter", "clay_filter", "limestone_filter", "marble_filter", "obsidian_filter"],
}

const setStuckFilters = {
    plotFilterOptions: [STUCK],
    tierFilterOptions: ["dirt_filter", "clay_filter", "limestone_filter", "marble_filter", "obsidian_filter"],
}

const setFinishedFilters = {
    plotFilterOptions: [FINISHED],
    tierFilterOptions: ["obsidian_filter"],
}

export class GemsPopup extends Component {

    state = {};

    componentDidMount() {
    }

    render() {
        const {gems, plots, goToGemWorkshop, setFilterOptions} = this.props;

        const ownedNumber = gems.length;
        let miningNumber = 0;
        let stuckNumber = 0;
        let onAuctionNumber = 0;
        let gemTypesNumber = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //12 types
        let gemLevelsNumber = [0, 0, 0, 0, 0]; //5 levels
        let gemGradesNumber = [0, 0, 0, 0, 0, 0]; //6 grades
        plots.forEach(plot => {
            if (plot.miningState === MINING) {
                miningNumber++;
            }
            if (plot.miningState === STUCK) {
                stuckNumber++;
            }
        });
        gems.forEach(gem => {
            if (gem.auctionIsLive) onAuctionNumber++;
            gemTypesNumber[gem.color - 1]++;
            gemLevelsNumber[gem.level - 1]++;
            gemGradesNumber[gem.gradeType - 1]++;
        });
        const restingNumber = ownedNumber - miningNumber - stuckNumber - onAuctionNumber;
        return (
          <PopupContainer>
              <Col flex={5} style={{
                  marginTop: "-12px",
                  zIndex: "30"
              }}>
                  <PlotsInfo>
                      <div style={{width: "100%", textAlign: "center", color: "#AEAEB7"}}>
                          Total Number of Gems that are:
                      </div>
                      <Col flex={1}>
                          <div style={{color: "#D199DE"}}>Owned: {ownedNumber}</div>
                          <div style={{color: "#94BED9"}}>Mining: {miningNumber}</div>
                      </Col>
                      <Col flex={1}>
                          <div style={{color: "#DBA6AC"}}>Stuck: {stuckNumber}</div>
                          <div style={{color: "#98E5D6"}}>Idle: {restingNumber}</div>
                      </Col>
                  </PlotsInfo>
                  {/*<ActionButton>BUY SAME NUMBER OF PLOTS AS RESTING GEMS</ActionButton>*/}
                  <PlotsInfo>
                      <div style={{width: "100%", textAlign: "center", color: "#AEAEB7"}}>
                          Type of Gems:
                      </div>
                      <Col flex={1}>
                          <div style={{color: "#DF523F"}}>Gar: {gemTypesNumber[0]}</div>
                          <div style={{color: "#9963A8"}}>Ame: {gemTypesNumber[1]}</div>
                          <div style={{color: "#91D7F0"}}>Aqu: {gemTypesNumber[2]}</div>
                          <div style={{color: "#F4F3E4"}}>Dia: {gemTypesNumber[3]}</div>
                          <div style={{color: "#99CE99"}}>Eme: {gemTypesNumber[4]}</div>
                          <div style={{color: "#F2CCE2"}}>Pea: {gemTypesNumber[5]}</div>
                      </Col>
                      <Col flex={1}>
                          <div style={{color: "#F4567B"}}>Rub: {gemTypesNumber[6]}</div>
                          <div style={{color: "#E4FF80"}}>Per: {gemTypesNumber[7]}</div>
                          <div style={{color: "#9997FF"}}>Sap: {gemTypesNumber[8]}</div>
                          <div style={{color: "#76E1C4"}}>Opa: {gemTypesNumber[9]}</div>
                          <div style={{color: "#F7E289"}}>Top: {gemTypesNumber[10]}</div>
                          <div style={{color: "#6FCECC"}}>Tur: {gemTypesNumber[11]}</div>
                      </Col>
                  </PlotsInfo>
                  <PlotsInfo>
                      <Col flex={1}>
                          <ShowButton content={"Go to Gem Workshop"} edgeSizes={[3, 20]} onClick={goToGemWorkshop}/>
                          <a href={"/market"}><ShowButton content={"Go to Gem Market"} edgeSizes={[3, 20]}/></a>
                      </Col>
                  </PlotsInfo>
              </Col>
              <Col flex={3} style={{
                  marginTop: "-15px",
                  zIndex: "30"
              }}>
                  <PlotsInfo>
                      <Col flex={1} style={{alignItems: "center"}}>
                          <div style={{color: "#DEAD77"}}>Level 1: {gemLevelsNumber[0]}</div>
                          <div style={{color: "#D89E5C"}}>Level 2: {gemLevelsNumber[1]}</div>
                          <div style={{color: "#D0924C"}}>Level 3: {gemLevelsNumber[2]}</div>
                          <div style={{color: "#B97D42"}}>Level 4: {gemLevelsNumber[3]}</div>
                          <div style={{color: "#9C5729"}}>Level 5: {gemLevelsNumber[4]}</div>
                          <div style={{color: "#AEC8E7"}}>Grade D: {gemGradesNumber[0]}</div>
                          <div style={{color: "#A3CCFE"}}>Grade C: {gemGradesNumber[1]}</div>
                          <div style={{color: "#98C7FF"}}>Grade B: {gemGradesNumber[2]}</div>
                          <div style={{color: "#69A1E7"}}>Grade A: {gemGradesNumber[3]}</div>
                          <div style={{color: "#5396D3"}}>Grade AA: {gemGradesNumber[4]}</div>
                          <div style={{color: "#2977A7"}}>Grade AAA: {gemGradesNumber[5]}</div>
                      </Col>
                  </PlotsInfo>
                  <PlotsInfo>
                      <div style={{width: "100%", textAlign: "center", color: "#AEAEB7"}}>
                          Show Gems on Plots that are:
                      </div>
                      <Col flex={1} style={{alignItems: "stretch"}}>
                          <ShowButton fontColor={"#94BED9"} content = {"Mining"}
                                      onClick={() => {setFilterOptions(setMiningFilters)}}/>
                          <ShowButton fontColor={"#DBA6AC"} content = {"Stuck"}
                                      onClick={() => {setFilterOptions(setStuckFilters)}}/>
                          <ShowButton fontColor={"#D199DE"} content = {"Mined"}
                                      onClick={() => {setFilterOptions(setFinishedFilters)}}/>
                      </Col>
                  </PlotsInfo>
              </Col>
          </PopupContainer>
        );
    }
}

const ShowButton = ({content, ...props}) => {
    return (
      <div style={{
          padding: "5px",
          width: "100%"
      }}>
          <CutEdgesButton outlineColor={"#DADAE8"}
                          backgroundColor={"#2A3238"}
                          edgeSizes={[5, 20]}
                          outlineWidth={2}
                          height={32}
                          fontSize={12}
                          content={content}
                          {...props}/>
      </div>)
}

const PopupContainer = styled.div`
            @media (max-width: 600px) {
                font-size: 12px;
            }
        
            display: flex;
            width: 100%;
            padding: 0 1%;
            font-size: 14px;
            font-weight: bold;
            max-width: 520px;
        `;


const UnprocessedBlocks = styled.div`
            display: flex;
            flex-direction: column;
            flex: 3;
            align-items: stretch;
            margin-right: 2%;
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
        
            @media (max-width: 600px) {
                font-size: 11px;
            }
            
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
            margin: 10px 0;
        `;

const PlotsInfo = styled.div`
            background-color: #24292F;
            padding: 5px 1%;
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
            margin: 0 1%;
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

export default GemsPopup;