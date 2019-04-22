import React, {Component} from "react";
import styled from "styled-components";
import actionButtonImage from "../../../app/images/noTextGemButton.png";
import octagonImage from "../../../app/images/octagonOutline.png";

export class FilterPopup extends Component {

    state = {};

    componentDidMount() {
    }

    render() {
        
        const container = {
            display: "flex",
            width: "100%",
            padding: "0 10px",
            fontSize: "14px",
            fontWeight: "bold"
        }
        

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
            margin: 0 2%;
        `;
        

        const ShowButton = styled.div`
            background-color: #2A3238;
            border: 3px solid #62626B;
            border-radius: 10px;
            font-weight: bold;
            padding: 5px;
            cursor: pointer;
            color: white;
            color: ${props => props.selected ? "#eee" : "#4F565D"};
            border: 3px solid ${props => props.selected ? "#eee" : "#4F565D"};
            font-size: 12px;
            text-align: center;
            margin: 5px;
            
            &:hover {
                color: #eee;
                background-color: #24292F;
                border: 2px solid #4F565D;
            };
        `;
        

        const plainText = {
            color: "black",
            alignSelf: "center",
            fontWeight: "bold"
        }
        
        const filterStyle = {
            position: "absolute",
            top: "0",
            left: "0",
            display: "flex",
            flexDirection: "column",
            width: "150px",
            backgroundColor: "#2A3238",
            fontSize: "14px",
            padding: "5px",
            alignItems: "stretch"
        }
        
        const arrowButtonStyle = {
            display: "block",
            width: "60px",
            height: "60px",
            fontSize: "28px"
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

        const {applyFilter, applySort, prevPage, nextPage, activeControls} = this.props;


        return (
          <div style={container}>
              {/*<Col flex={1} style={{*/}
                  {/*marginTop: "-12px",*/}
                  {/*zIndex: "30"*/}
              {/*}}>*/}
                  {/*<PlotsInfo>*/}
                      {/*<ShowButton>Apply</ShowButton>*/}
                      {/*<ShowButton>Cancel</ShowButton>*/}
                  {/*</PlotsInfo>*/}
                  {/*<PlotsInfo>*/}
                      {/*<div style={plainText}>Sort By</div>*/}
                      {/*<ShowButton selected={activeControls.includes("time_left")}*/}
                                    {/*onClick={() => applySort("time_left")}>*/}
                          {/*Time Left*/}
                      {/*</ShowButton>*/}
                      {/*<ShowButton selected={activeControls.includes("mined")}*/}
                                    {/*onClick={() => applySort("mined")}>*/}
                          {/*% Mined</ShowButton>*/}
                      {/*<ShowButton selected={activeControls.includes("dirt")}*/}
                                    {/*underlined={activeControls.includes("dirt_filter")}*/}
                                    {/*onClick={() => applySort("dirt")}>Dirt</ShowButton>*/}
                      {/*<ShowButton selected={activeControls.includes("clay")}*/}
                                    {/*underlined={activeControls.includes("clay_filter")}*/}
                                    {/*onClick={() => applySort("clay")}>Clay</ShowButton>*/}
                      {/*<ShowButton selected={activeControls.includes("limestone")}*/}
                                    {/*underlined={activeControls.includes("limestone_filter")}*/}
                                    {/*onClick={() => applySort("limestone")}>Limestone</ShowButton>*/}
                      {/*<ShowButton selected={activeControls.includes("marble")}*/}
                                    {/*underlined={activeControls.includes("marble_filter")}*/}
                                    {/*onClick={() => applySort("marble")}>Marble</ShowButton>*/}
                      {/*<ShowButton selected={activeControls.includes("obsidian")}*/}
                                    {/*underlined={activeControls.includes("obsidian_filter")}*/}
                                    {/*onClick={() => applySort("obsidian")}>Obsidian</ShowButton>*/}
                      {/*<div style={buttonBlockStyle}>*/}
                          {/*<ArrowButton selected={activeControls.includes("sort_btn_up")}*/}
                                       {/*onClick={() => applySort("sort_btn_up")}>∧</ArrowButton>*/}
                          {/*<ArrowButton selected={activeControls.includes("sort_btn_down")}*/}
                                       {/*onClick={() => applySort("sort_btn_down")}>∨</ArrowButton></div>*/}
                  {/*</PlotsInfo>*/}
              {/*</Col>*/}
              {/*<Col flex={1} style={{*/}
                  {/*marginTop: "-15px",*/}
                  {/*zIndex: "30"*/}
              {/*}}>*/}
                  {/*<PlotsInfo>*/}
                      {/*<div style={plainText}>Show</div>*/}
                      {/*<ShowButton selected={activeControls.includes("show_gem_mining")}*/}
                                    {/*onClick={() => applyFilter("show_gem_mining")}>Gem Mining</ShowButton>*/}
                      {/*<ShowButton selected={activeControls.includes("show_not_mining")}*/}
                                    {/*onClick={() => applyFilter("show_not_mining")}>Not Mining</ShowButton>*/}
                      {/*<ShowButton selected={activeControls.includes("show_no_gem")}*/}
                                    {/*onClick={() => applyFilter("show_no_gem")}>No Gem</ShowButton>*/}
                      {/*<ShowButton selected={activeControls.includes("show_completed")}*/}
                                    {/*onClick={() => applyFilter("show_completed")}>Completed</ShowButton>*/}

                      {/*<ShowButton selected={activeControls.includes("dirt")}*/}
                                    {/*underlined={activeControls.includes("dirt_filter")}*/}
                                    {/*onClick={() => applySort("dirt")}>Dirt</ShowButton>*/}
                      {/*<ShowButton selected={activeControls.includes("clay")}*/}
                                    {/*underlined={activeControls.includes("clay_filter")}*/}
                                    {/*onClick={() => applySort("clay")}>Clay</ShowButton>*/}
                      {/*<ShowButton selected={activeControls.includes("limestone")}*/}
                                    {/*underlined={activeControls.includes("limestone_filter")}*/}
                                    {/*onClick={() => applySort("limestone")}>Limestone</ShowButton>*/}
                      {/*<ShowButton selected={activeControls.includes("marble")}*/}
                                    {/*underlined={activeControls.includes("marble_filter")}*/}
                                    {/*onClick={() => applySort("marble")}>Marble</ShowButton>*/}
                      {/*<ShowButton selected={activeControls.includes("obsidian")}*/}
                                    {/*underlined={activeControls.includes("obsidian_filter")}*/}
                                    {/*onClick={() => applySort("obsidian")}>Obsidian</ShowButton>*/}
                  {/*</PlotsInfo>*/}
                  {/*<PlotsInfo>*/}
                      {/*<ShowButton>Defaults</ShowButton>*/}
                  {/*</PlotsInfo>*/}
              {/*</Col>*/}
          </div>
        );
    }
}

export default FilterPopup;