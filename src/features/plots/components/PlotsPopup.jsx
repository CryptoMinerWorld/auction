import {Component} from "react";
import styled from "styled-components";
import React from "react";
import actionButtonImage from "../../../app/images/thickAndWidePinkButton.png";
// import actionButtonImage from "../../../app/images/noTextGemButton.png";
import octagonImage from "../../../app/images/octagonOutline.png";
import {CutEdgesButton} from "../../../components/CutEdgesButton";
import {CANT_MINE, MINING, NEW_PLOT, NO_GEM, NOT_MINING, PROCESSED, STUCK} from "../plotConstants";
import {countTotalUnprocessedBlocks} from "../plotActions";

const setNoGemsFilters = {
    plotFilterOptions: [NO_GEM],
    tierFilterOptions: ["dirt_filter", "clay_filter", "limestone_filter", "marble_filter", "obsidian_filter"],
};

const setStuckGemsFilters = {
    plotFilterOptions: [STUCK],
    tierFilterOptions: ["dirt_filter", "clay_filter", "limestone_filter", "marble_filter", "obsidian_filter"],
};

const setMiningFilters = {
    plotFilterOptions: [MINING],
    tierFilterOptions: ["dirt_filter", "clay_filter", "limestone_filter", "marble_filter", "obsidian_filter"],
};

const setNewPlotsFilters = {
    plotFilterOptions: [NEW_PLOT],
    tierFilterOptions: ["dirt_filter", "clay_filter", "limestone_filter", "marble_filter", "obsidian_filter"],
};

export class PlotsPopup extends Component {

    state = {

    };

    componentDidMount() {
    }

    render() {
        let plotsFullyMined = 0;
        let plotsWithNoGem = 0;
        let blocksNotMined = 0;
        let plotsNotMining = 0;
        let totalProcessedBlocks = [0, 0, 0, 0, 0];

        const {plots, setFilterOptions} = this.props;
        let {totalUnprocessedSum, totalUnprocessedBlocks} = countTotalUnprocessedBlocks(plots);
        plots.forEach((plot) => {
            if (plot.currentPercentage >= 100) {
                plotsFullyMined++;
            }
            if (!plot.gemMines && plot.currentPercentage < 100) {
                plotsWithNoGem++;
            }
            if (plot.miningState === NO_GEM || plot.miningState === NEW_PLOT || plot.miningState === STUCK) {
                plotsNotMining++;
            }
            if (plot.processedBlocks > 0) {
                totalProcessedBlocks[0] += Math.max(Math.min(plot.layerPercentages[0], plot.processedBlocks), 0);
                for (let i = 1; i < 5; i++) {
                    totalProcessedBlocks[i] += Math.max(Math.min(plot.layerPercentages[i], plot.processedBlocks - plot.layerEndPercentages[i - 1]), 0)
                }
            }
            blocksNotMined += Math.max(100 - plot.currentPercentage, 0);
        });


        return (
          <div style={container}>
              <UnprocessedBlocks>
                  <div style={{fontSize: "12px", fontWeight: "bold", textAlign: "center"}}>Unprocessed Blocks</div>
                  <TierIndicator tier={0}>{totalUnprocessedBlocks[0]}</TierIndicator>
                  <TierIndicator tier={1}>{totalUnprocessedBlocks[1]}</TierIndicator>
                  <TierIndicator tier={2}>{totalUnprocessedBlocks[2]}</TierIndicator>
                  <TierIndicator tier={3}>{totalUnprocessedBlocks[3]}</TierIndicator>
                  <TierIndicator tier={4}>{totalUnprocessedBlocks[4]}</TierIndicator>
                  {/*<ActionButton>PROCESS</ActionButton>*/}
              </UnprocessedBlocks>
              <InfoSection>
                  <a href={"/plots"}><ActionButton>BUY PLOTS OF LAND</ActionButton></a>
                  <PlotsInfo>
                      <Col flex={3} style={{minWidth: "150px"}}>
                          <div>Plots Owned: {plots.length}</div>
                          <div style={{color: "#AEAEB7"}}>Processed Plots: {plotsFullyMined}</div>
                          <div>Plots With No Gem: {plotsWithNoGem}</div>
                          <div style={{color: "#AEAEB7"}}>Blocks Not Mined: {blocksNotMined}</div>
                      </Col>
                      <Col flex={2} style={{alignItems: "center"}}>
                          <PlotsNotMiningIndicator>
                              {plotsNotMining}
                          </PlotsNotMiningIndicator>
                          <span style={{color: "#AEAEB7"}}>Plots Not Mining</span>
                      </Col>
                  </PlotsInfo>
                  <PlotsInfo>
                      <div style={{width: "100%", textAlign: "center", color: "#AEAEB7"}}>Total Processed Blocks</div>
                      <Col flex={1} style={{color: "#fff776", minWidth: "140px"}}>
                          <div>Tier 1 (Dirt, Snow): {totalProcessedBlocks[0]}</div>
                          <div>Tier 3 (Limestone): {totalProcessedBlocks[2]}</div>
                          <div>Tier 5 (Obsidian): {totalProcessedBlocks[4]}</div>
                      </Col>
                      <Col flex={1} style={{color: "#fff776", minWidth: "140px"}}>
                          <div>Tier 2 (Clay, Ice): {totalProcessedBlocks[1]}</div>
                          <div>Tier 4 (Marble): {totalProcessedBlocks[3]}</div>
                          <div>BoP Geodes: {plotsFullyMined}</div>
                      </Col>
                  </PlotsInfo>
                  {/*<PlotsInfo>*/}
                      {/*<Col flex={1}>Items Found: 1234</Col>*/}
                      {/*<Col flex={1}><ShowButton content={"Show Items"}/></Col>*/}
                  {/*</PlotsInfo>*/}
                  <PlotsInfo>
                      <div style={{width: "100%", textAlign: "center", color: "#AEAEB7"}}>Show only:</div>
                      <Col flex={"1 0 50%"}>
                          <ShowButton content={"Plots w/ No Gem"}
                          onClick={() => {setFilterOptions(setNoGemsFilters)}}/>
                          <ShowButton content={"New Plots"}
                                      onClick={() => {setFilterOptions(setNewPlotsFilters)}}/>
                      </Col>
                      <Col flex={"1 0 50%"}>
                          <ShowButton content={"Plots w/ Stuck Gem"} onClick={() => {setFilterOptions(setStuckGemsFilters)}}/>
                          <ShowButton content={"Mining Plots"} onClick={() => {setFilterOptions(setMiningFilters)}}/>
                      </Col>
                      <div style={{width: "100%", textAlign: "center", color: "#AEAEB7", fontSize:"8px"}}>
                          Make more changes in "Sort/Filter"</div>
                  </PlotsInfo>
              </InfoSection>
          </div>
        );
    }
}

const container = {
    display: "flex",
    maxWidth: "520px",
    padding: "0 10px",
    overflowY: "auto",
    maxHeight: "520px",
};

const UnprocessedBlocks = styled.div`
            display: flex;
            flex-direction: column;
            flex: 3;
            align-items: stretch;
            margin-right: 2%;
            background-color: #24292F;
            padding: 5px;
            z-index: 30;
            border-radius: 15px;
        `;

const InfoSection = styled.div`
            display: flex;
            flex-direction: column;
            flex: 7;
            align-items: center;
            border-radius: 10px;
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
            padding: 20px 25px;
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
            @media (max-width: 600px) {
                font-size: 36px;  
                line-height: 52px; 
            }
        
            padding: 0px 0;
            text-align: center;
            font-size: 44px;
            line-height: 64px;
            margin: 5px;
            clip-path: polygon(9% 0%, 91% 0%, 100% 18%, 100% 82%, 91% 100%, 9% 100%, 0% 82%, 0% 18%);
            -webkit-clip-path: polygon(9% 0%, 91% 0%, 100% 18%, 100% 82%, 91% 100%, 9% 100%, 0% 82%, 0% 18%);
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
};

export default PlotsPopup;