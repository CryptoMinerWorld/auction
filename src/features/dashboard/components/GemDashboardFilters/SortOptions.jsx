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
`;

const SortOptionsContainer = styled.div`
      display: flex;
      font-weight: normal;
      border-radius: 5px;
      
      
      align-items: center;
      padding: 8px;
      background-color: #24292F;
      clip-path: polygon(5% 0, 95% 0, 100% 10%, 100% 90%,95% 100%, 5% 100%, 0 90%, 0% 10%);
      -webkit-clip-path: polygon(5% 0, 95% 0, 100% 10%, 100% 90%,95% 100%, 5% 100%, 0 90%, 0% 10%);
      font-size: 16px;
      
      @media(max-width: 800px) {
        
        font-size: 14px;
        margin: 0 10px;
      }
      
      @media(min-width: 1520px) {
        font-size: .8vw;
      }
      
      width: 100%;
`;


const SortOptions = ({selectedSort, toggleSort}) => {
    return (
        <AdjustContainer>
            <SortOptionsContainer>
                <div className="flex col" style={{flex: "2 1 150px", margin: "0px 2px", minWidth: "100px"}}>
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
                </div>
                <div className="flex col" style={{flex: "2 1 150px", margin: "0px 2px"}}>
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
                </div>
                <div className="flex col" style={{margin: "1px 2px", width: "32px"}}>
                    <CutEdgesButton outlineColor={() => selectedSort.sortDirection === "up" ? "#E8848E" : "transparent"}
                                    backgroundColor={() => selectedSort.sortDirection === "up" ? "#542329" : "black"}
                                    fontColor={"#E8848E"}
                                    edgeSizes={[10, 20]}
                                    outlineWidth={1}
                                    height={30}
                                    content={"∧"}
                                    style={"margin: 0px 2px"}
                                    onClick={() => toggleSort(selectedSort.sortOption, "up")}/>
                    <CutEdgesButton
                        outlineColor={() => selectedSort.sortDirection === "down" ? "#E8848E" : "transparent"}
                        backgroundColor={() => selectedSort.sortDirection === "down" ? "#542329" : "black"}
                        fontColor={"#E8848E"}
                        edgeSizes={[10, 20]}
                        outlineWidth={1}
                        height={30}
                        content={"∨"}
                        style={"margin: 0px 2px"}
                        onClick={() => toggleSort(selectedSort.sortOption, "down")}/>
                </div>
            </SortOptionsContainer>
        </AdjustContainer>
    )
};

export default SortOptions;