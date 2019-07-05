import {CutEdgesButton} from "../../../../components/CutEdgesButton";
import {
    acquiredOutlineColor,
    acquiredPaneColor,
    mrbOutlineColor,
    mrbPaneColor,
    restingEnergyOutlineColor, restingEnergyPaneColor
} from "../propertyPaneStyles";
import React from "react";
import styled from "styled-components";

const AdjustContainer = styled.div`
    display: flex;
    flex-wrap: wrap; 
    justify-content: center;
    margin-right: .3vw;
    margin-left: .3vw;
    flex: 3 3;
    @media(min-width: 801px) and (max-width: 1494px) {
        flex: 0
    }
`;

const SortOptionsContainer = styled.div`
      display: flex;
      font-weight: normal;
      border-radius: 5px;
      justify-content: center;
      
      
      padding: 8px;
      background-color: #24292F;
      clip-path: polygon(5% 0, 95% 0, 100% 10%, 100% 90%,95% 100%, 5% 100%, 0 90%, 0% 10%);
      -webkit-clip-path: polygon(5% 0, 95% 0, 100% 10%, 100% 90%,95% 100%, 5% 100%, 0 90%, 0% 10%);
      font-size: 16px;
     
      
      width: 100%;
`;

const SortOption = styled.div`
      display: -ms-flexbox;
      display: -webkit-box;
      display: flex;
      
      -webkit-box-orient: vertical;
      -webkit-box-direction: normal;
      -ms-flex-direction: column;
      flex-direction: column;
      grid-auto-flow: row;
      align-self: center;
      padding-left: 5px;
          
      @media (max-width: 1499px) {
        font-size: 16px;
        width: 6em;    
      }
       
        
      @media (min-width: 1500px) {
        font-size: 1em;
        width: 6em;    
      }
      
`;

const SortArrow = styled.div`
      display: -ms-flexbox;
      display: -webkit-box;
      display: flex;
      
      -webkit-box-orient: vertical;
      -webkit-box-direction: normal;
      -ms-flex-direction: column;
      flex-direction: column;
      grid-auto-flow: row;
      align-self: center;
      padding-left: 5px;
      margin: 0px 2px; 
      width: 3.5em;
      
      @media(max-width: 800px) {
        
        font-size: 14px;
      }
      
      @media(min-width: 1520px) {
        font-size: .8vw; 
      }
      
      @media (max-width: 1499px) {
        font-size: 0.8em;
        width: 3em;    
      }
      
      
`;

const SortOptions = ({selectedSort, toggleSort}) => {
    return (
        <AdjustContainer>
            <SortOptionsContainer>
                <SortOption>
                    <CutEdgesButton
                        outlineColor={selectedSort.sortOption === "acq" ? acquiredOutlineColor : "transparent"}
                        backgroundColor={selectedSort.sortOption === "acq" ? acquiredPaneColor : "black"}
                        fontColor={acquiredOutlineColor}
                        edgeSizes={[10, 20]}
                        outlineWidth={1}
                        height={32}
                        content={"Acquired"}
                        onClick={() => toggleSort("acq", selectedSort.sortDirection)}
                        otherStyles={"margin: 2px 0;"}/>
                    <CutEdgesButton outlineColor={selectedSort.sortOption === "mrb" ? mrbOutlineColor : "transparent"}
                                    backgroundColor={selectedSort.sortOption === "mrb" ? mrbPaneColor : "black"}
                                    fontColor={mrbOutlineColor}
                                    edgeSizes={[10, 20]}
                                    outlineWidth={1}
                                    height={32}
                                    content={"MRB"}
                                    onClick={() => toggleSort("mrb", selectedSort.sortDirection)}
                                    otherStyles={"margin: 2px 0;"}/>
                </SortOption>
                <SortOption >
                    <CutEdgesButton
                        outlineColor={selectedSort.sortOption === "REA" ? restingEnergyOutlineColor : "transparent"}
                        backgroundColor={selectedSort.sortOption === "REA" ? restingEnergyPaneColor : "black"}
                        fontColor={restingEnergyOutlineColor}
                        edgeSizes={[10, 20]}
                        outlineWidth={1}
                        height={32}
                        content={"REA"}
                        onClick={() => toggleSort("REA", selectedSort.sortDirection)}
                        otherStyles={"margin: 2px 0;"}/>
                    <CutEdgesButton outlineColor={selectedSort.sortOption === "level" ? "yellow" : "transparent"}
                                    backgroundColor={selectedSort.sortOption === "level" ? "#492106" : "black"}
                                    fontColor={"yellow"}
                                    edgeSizes={[10, 20]}
                                    outlineWidth={1}
                                    height={32}
                                    content={"Level"}
                                    onClick={() => toggleSort("level", selectedSort.sortDirection)}
                                    otherStyles={"margin: 2px 0;"}/>
                </SortOption>
                <SortArrow>
                    <CutEdgesButton outlineColor={() => selectedSort.sortDirection === "up" ? "#E8848E" : "transparent"}
                                    backgroundColor={() => selectedSort.sortDirection === "up" ? "#542329" : "black"}
                                    fontColor={"#E8848E"}
                                    edgeSizes={[10, 20]}
                                    outlineWidth={1}
                                    height={30}
                                    content={"∧"}
                                    style={"margin: 3px 2px;"}
                                    onClick={() => toggleSort(selectedSort.sortOption, "up")}/>
                    <CutEdgesButton
                        outlineColor={() => selectedSort.sortDirection === "down" ? "#E8848E" : "transparent"}
                        backgroundColor={() => selectedSort.sortDirection === "down" ? "#542329" : "black"}
                        fontColor={"#E8848E"}
                        edgeSizes={[10, 20]}
                        outlineWidth={1}
                        height={30}
                        content={"∨"}
                        style={"margin: 3px 2px;"}
                        onClick={() => toggleSort(selectedSort.sortOption, "down")}/>
                </SortArrow>
            </SortOptionsContainer>
        </AdjustContainer>
    )
};

export default SortOptions;