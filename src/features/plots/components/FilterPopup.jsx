import React, {Component} from "react";
import styled from "styled-components";
import {CutEdgesButton} from "../../../components/CutEdgesButton";
import arrowUpActive from "./../../../app/images/arrowUpActive.png";
import arrowDownActive from "./../../../app/images/arrowDownActive.png";
import {CANT_MINE, MINED, MINING, NEW_PLOT, NO_GEM, NOT_MINING, PROCESSED, STUCK} from "./../plotConstants";

const container = {
    display: "flex",
    padding: "0 10px",
    fontSize: "14px",
    fontWeight: "bold",
    width: "350px",
}


const PlotsInfo = styled.div`
            background-color: #24292F;
            padding: 2px 15px;
            border-radius: 10px;
            width: 100%;
            display: flex;
            margin: 6px 0;
            flex-direction: column;
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

const Col = styled.div`
            flex: ${props => props.flex}
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            margin: 0 2%;
        `;

const plainText = {
    color: "#88898F",
    alignSelf: "center",
    fontSize: "20px",
    fontWeight: "normal"
}

const additionalText = {
    width: "100%",
    textAlign: "center",
    color: "#88898F",
    fontSize: "12px"
}

const ArrowButton = styled('a')`
            display: block;
            width: 60px;
            height: 60px;
            font-size: 28px;
            background-color: #24292F;
            color: ${props => props.selected ? "#eee" : "#4F565D"};
            border: 2px solid ${props => props.selected ? "#4F565D" : "transparent"};
            text-align: center;
            
            &:hover {
                color: #eee;
                background-color: #24292F;
                border: 2px solid #4F565D;
            }`;

const buttonBlockStyle = {
    display: "flex",
    justifyContent: "space-around"
}

const arrowButtonStyle = {
    width: "40px",
    height: "40px",
    top: "7px",
    position: "absolute",
    left: "0",
    right: "0",
    margin: "auto",
    zIndex: "40",
    cursor: "pointer"
}

export class FilterPopup extends Component {

    state = {};

    componentDidMount() {
    }

    render() {

        const {applyFilter, applySort, prevPage, nextPage, activeControls, filterDefault} = this.props;


        return (
          <div style={container}>
              <Col flex={1} style={{
                  marginTop: "-15px",
                  zIndex: "30"
              }}>
                  <PlotsInfo edgeSizes={[7, 20]}>
                      <CutEdgesButton outlineColor={"#2A8A91"}
                                      backgroundColor={"#174746"}
                                      edgeSizes={[7, 20]}
                                      outlineWidth={2}
                                      height={32}
                                      fontSize={18}
                                      content={"Defaults"}
                                      style={"margin: 5px 0"}
                                      onClick={() => filterDefault()}
                      />
                  </PlotsInfo>
                    {/*<PlotsInfo edgeSizes={[10, 15]}>*/}
                      {/*<CutEdgesButton outlineColor={"#FF6EE4"}*/}
                                      {/*backgroundColor={"#4C2742"}*/}
                                      {/*edgeSizes={[6, 20]}*/}
                                      {/*outlineWidth={2}*/}
                                      {/*height={32}*/}
                                      {/*fontSize={18}*/}
                                      {/*content={"Apply"}*/}
                                      {/*style={"margin: 10px 0 0"}*/}
                      {/*/>*/}
                      {/*<CutEdgesButton outlineColor={"#934A2A"}*/}
                                      {/*backgroundColor={"#492417"}*/}
                                      {/*edgeSizes={[6, 20]}*/}
                                      {/*outlineWidth={2}*/}
                                      {/*height={32}*/}
                                      {/*fontSize={18}*/}
                                      {/*content={"Cancel"}*/}
                                      {/*style={"margin: 10px 0"}*/}
                      {/*/>*/}
                  {/*</PlotsInfo>*/}
                  <PlotsInfo edgeSizes={[10, 4]}>
                      <div style={plainText}>Sort By</div>
                      <ShowButton selected={activeControls.includes("time_left")}
                                  onClick={() => applySort("time_left")}
                                  content={"Time Left"}/>
                      <ShowButton selected={activeControls.includes("mined")}
                                  onClick={() => applySort("mined")}
                                  content={"Blocks Mined"}/>
                      <ShowButton selected={activeControls.includes("dirt")}
                                  onClick={() => applySort("dirt")} content={"Dirt"}/>
                      <ShowButton selected={activeControls.includes("clay")}
                                  onClick={() => applySort("clay")} content={"Clay"}/>
                      <ShowButton selected={activeControls.includes("limestone")}
                                  onClick={() => applySort("limestone")} content={"Limestone"}/>
                      <ShowButton selected={activeControls.includes("marble")}
                                  onClick={() => applySort("marble")} content={"Marble"}/>
                      <ShowButton selected={activeControls.includes("obsidian")}
                                  onClick={() => applySort("obsidian")} content={"Obsidian"}/>
                      <div style={buttonBlockStyle}>
                          <div style={{width: "100%", position: "relative", margin: "5px 5px 5px 0px"}}
                               onClick={() => applySort("sort_btn_up")}
                          >
                              <img src={arrowUpActive}
                                   style={{...arrowButtonStyle, opacity: activeControls.includes("sort_btn_up") ? "1" : "0.35"}}/>
                              <CutEdgesButton
                                outlineColor={activeControls.includes("sort_btn_up") ? "#DADAE8" : "#62626B"}
                                backgroundColor={activeControls.includes("sort_btn_up") ? "#2A3238" : "#2A3238"}
                                edgeSizes={15}
                                outlineWidth={2}
                                height={55}
                                fontSize={30}
                                content={""}/>
                          </div>
                          <div style={{width: "100%", position: "relative", margin: "5px 0px 5px 5px"}}
                               onClick={() => applySort("sort_btn_down")}
                          >
                              <img src={arrowDownActive}
                                   style={{...arrowButtonStyle, opacity: activeControls.includes("sort_btn_down") ? "1" : "0.35"}}/>
                              <CutEdgesButton
                                outlineColor={activeControls.includes("sort_btn_down") ? "#DADAE8" : "#62626B"}
                                backgroundColor={activeControls.includes("sort_btn_down") ? "#2A3238" : "#2A3238"}
                                edgeSizes={15}
                                outlineWidth={2}
                                height={55}
                                fontSize={30}
                                content={""}/>
                          </div>
                      </div>
                  </PlotsInfo>
              </Col>
              <Col flex={1} style={{
                  marginTop: "-20px",
                  zIndex: "30"
              }}>
                  <PlotsInfo edgeSizes={[10, 4]}>
                      <div style={plainText}>Show</div>
                      <ShowButton selected={activeControls.includes(NEW_PLOT)}
                                  onClick={() => applyFilter(NEW_PLOT)} content={"New Plots"}/>
                      <ShowButton selected={activeControls.includes(MINING)}
                                  onClick={() => applyFilter(MINING)} content={"Gem Mining"}/>
                      <ShowButton selected={activeControls.includes(STUCK)}
                                  onClick={() => applyFilter(STUCK)} content={"Gem Stuck"}/>
                      <ShowButton selected={activeControls.includes(NO_GEM)}
                                  onClick={() => applyFilter(NO_GEM)} content={"No Gem"}/>
                      <ShowButton selected={activeControls.includes(PROCESSED)}
                                  onClick={() => applyFilter(PROCESSED)}
                                  fontSize={13}
                                  content={"Processed Plots"}/>
                      <div style={additionalText}>Current Tier</div>
                      <ShowButton selected={activeControls.includes("dirt_filter")}
                                  onClick={() => applyFilter("dirt_filter")} content={"Dirt"}/>
                      <ShowButton selected={activeControls.includes("clay_filter")}
                                  onClick={() => applyFilter("clay_filter")} content={"Clay"}/>
                      <ShowButton selected={activeControls.includes("limestone_filter")}
                                  onClick={() => applyFilter("limestone_filter")} content={"Limestone"}/>
                      <ShowButton selected={activeControls.includes("marble_filter")}
                                  onClick={() => applyFilter("marble_filter")} content={"Marble"}/>
                      <ShowButton selected={activeControls.includes("obsidian_filter")}
                                  onClick={() => applyFilter("obsidian_filter")} content={"Obsidian"}/>
                  </PlotsInfo>
              </Col>
          </div>
        );
    }
}

export default FilterPopup;

const ShowButton = ({content, selected, ...props}) => {
    return (
      <div style={{
          margin: "5px 0",
          width: "100%"
      }}>
          <CutEdgesButton outlineColor={selected ? "#DADAE8" : "#62626B"}
                          backgroundColor={selected ? "#2A3238" : "#2A3238"}
                          edgeSizes={[5, 20]}
                          outlineWidth={2}
                          height={32}
                          fontSize={16}
                          content={content}
                          {...props}/>
      </div>)
}