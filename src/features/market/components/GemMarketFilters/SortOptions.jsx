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

const SortOptionsContainer = styled.div`
      display: flex;
      font-weight: bold;
      font-size: 18px;
      align-items: center;
      width: 224px;
      
      @media(max-width: 800px) {
        width: 215px;
        font-size: 14px;
      }
`;

const SortOptions = ({selectedSort, toggleSort}) => {
    return (
        <SortOptionsContainer>
            <div className="flex col" style={{flex: 2, margin: "0px 4px"}}>
                <CutEdgesButton
                    outlineColor={selectedSort.sortOption === "price" ? acquiredOutlineColor : "transparent"}
                    backgroundColor={selectedSort.sortOption === "price" ? acquiredPaneColor : "black"}
                    fontColor={acquiredOutlineColor}
                    edgeSizes={[5, 10]}
                    outlineWidth={2}
                    height={32}
                    content={"Price"}
                    onClick={() => toggleSort("price", selectedSort.sortDirection)}
                    otherStyles={"margin: 2px 0;"}/>
                <CutEdgesButton outlineColor={selectedSort.sortOption === "mrb" ? mrbOutlineColor : "transparent"}
                                backgroundColor={selectedSort.sortOption === "mrb" ? mrbPaneColor : "black"}
                                fontColor={mrbOutlineColor}
                                edgeSizes={[5, 10]}
                                outlineWidth={2}
                                height={32}
                                content={"MRB"}
                                onClick={() => toggleSort("mrb", selectedSort.sortDirection)}
                                otherStyles={"margin: 2px 0;"}/>
            </div>
            <div className="flex col" style={{flex: 2, margin: "0px 4px"}}>
                <CutEdgesButton
                    outlineColor={selectedSort.sortOption === "REA" ? restingEnergyOutlineColor : "transparent"}
                    backgroundColor={selectedSort.sortOption === "REA" ? restingEnergyPaneColor : "black"}
                    fontColor={restingEnergyOutlineColor}
                    edgeSizes={[5, 10]}
                    outlineWidth={2}
                    height={32}
                    content={"REA"}
                    onClick={() => toggleSort("REA", selectedSort.sortDirection)}
                    otherStyles={"margin: 2px 0;"}/>
                <CutEdgesButton outlineColor={selectedSort.sortOption === "level" ? "yellow" : "transparent"}
                                backgroundColor={selectedSort.sortOption === "level" ? "#492106" : "black"}
                                fontColor={"yellow"}
                                edgeSizes={[5, 10]}
                                outlineWidth={2}
                                height={32}
                                content={"Level"}
                                onClick={() => toggleSort("level", selectedSort.sortDirection)}
                                otherStyles={"margin: 2px 0;"}/>
            </div>
            <div className="flex col" style={{margin: "0px 5px", width: "32px"}}>
                <CutEdgesButton outlineColor={() => selectedSort.sortDirection === "up" ? "#E8848E" : "transparent"}
                                backgroundColor={() => selectedSort.sortDirection === "up" ? "#542329" : "black"}
                                fontColor={"#E8848E"}
                                edgeSizes={15}
                                outlineWidth={1}
                                height={30}
                                content={"∧"}
                                style={"margin: 2px 0px"}
                                onClick={() => toggleSort(selectedSort.sortOption, "up")}/>
                <CutEdgesButton outlineColor={() => selectedSort.sortDirection === "down" ? "#E8848E" : "transparent"}
                                backgroundColor={() => selectedSort.sortDirection === "down" ? "#542329" : "black"}
                                fontColor={"#E8848E"}
                                edgeSizes={15}
                                outlineWidth={1}
                                height={30}
                                content={"∨"}
                                style={"margin: 2px 0px"}
                                onClick={() => toggleSort(selectedSort.sortOption, "down")}/>
            </div>
        </SortOptionsContainer>
    )
}

export default SortOptions