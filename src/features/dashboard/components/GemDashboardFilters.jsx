import React, {Component} from "react";
import {
    acquiredOutlineColor, acquiredPaneColor,
    gradeConverter,
    gradeOutlineColor,
    gradePaneColors,
    levelOutlineColor,
    levelPaneColors,
    mrbOutlineColor,
    mrbPaneColor, restingEnergyOutlineColor, restingEnergyPaneColor,
    type,
    typePaneColors,
    typePaneOutlineColors
} from "./propertyPaneStyles";
import {CutEdgesButton} from "./CutEdgesButton";
import styled from "styled-components";

const transitionRules = {
    //transitionDelay: 'display 2s'
}

const GemFiltersContainer = styled.div`
              bottom: -11px;
              background-color: rgb(42, 50, 56);
              z-index: 20;
              padding: 10px 0px 0;
             
`;

const GradeAndLevelBox = styled.div`

    media(max-width: 599px) {
        font-size: 16px;
        margin: 2px 1px; 
    }

    font-size: 20px;
    width: 50px;
    margin: 2px 2px; 
    font-weight: normal;
`;

const TypeBox = styled.div`
    
    @media(max-width: 599px) {
        margin: 1px 3px;
        min-width: 50px;
        font-size: 12px;
    }
    
    font-size: 16px;
    flex: 1;
    min-width: 70px; 
    margin: 5px 3px; 
    font-weight: normal
`;

const StateBox = styled.div`
    
    @media(max-width: 599px) {
        margin: 1px 3px;
        min-width: 50px;
        font-size: 12px;
    }
    
    font-size: 16px;
    flex: 1;
    min-width: 70px; 
    margin: 5px 3px; 
    font-weight: normal
`;


class GemDashboardFilters extends Component {

    render() {
        const unselectedFilters = this.props.unselectedFilters || {};
        const {toggleFilter, selectedSort, toggleSort, clearFilters, setDefaultFilters, toggleSortDirection} = this.props;

        return (
          <GemFiltersContainer>
              <div
                className="flex row white"
                style={{
                    padding: "5px 10px 0",
                    WebkitClipPath:
                      'polygon(100.23% 96.54%, 95.12% 99.87%, 8.69% 100.01%, 1.21% 98.76%, -0.22% 92.82%, 0.03% 2.74%, 4.31% -0.23%, 92.22% -0.24%, 98.41% 1.33%, 100.1% 5.29%)',
                    clipPath:
                      'polygon(100.23% 96.54%, 95.12% 99.87%, 8.69% 100.01%, 1.21% 98.76%, -0.22% 92.82%, 0.03% 2.74%, 4.31% -0.23%, 92.22% -0.24%, 98.41% 1.33%, 100.1% 5.29%)',
                }}>
                  <GemStates unselectedFilters={unselectedFilters} toggleFilter={toggleFilter}/>
                  <SortOptions selectedSort={selectedSort} toggleSort={toggleSort}/>
                  <GradesTypesLevels unselectedFilters={unselectedFilters} toggleFilter={toggleFilter}/>
                  <div style={{flex: "2", flexDirection: "column"}}>
                      {/*Actions*/}
                      <div style={{flex: 2, margin: "5px 3px", fontWeight: "normal"}}>
                          <CutEdgesButton outlineColor={"orange"}
                                          backgroundColor={"black"}
                                          edgeSizes={[7, 20]}
                                          outlineWidth={2}
                                          height={32}
                                          fontSize={16}
                                          content={"Clear"}
                                          onClick={() => clearFilters()}/>
                      </div>
                      <div style={{flex: 2, margin: "8px 3px", fontWeight: "normal"}}>
                          <CutEdgesButton outlineColor={"aquamarine"}
                                          backgroundColor={"black"}
                                          edgeSizes={[7, 20]}
                                          outlineWidth={2}
                                          height={32}
                                          fontSize={16}
                                          content={"Default"}
                                          onClick={() => setDefaultFilters()}/>
                      </div>
                  </div>
              </div>
          </GemFiltersContainer>
        )
    }
}

export default GemDashboardFilters;

const GemStates = ({unselectedFilters, toggleFilter}) => (
  <div style={{display: "flex", flexWrap: "wrap", maxWidth: "200px"}}>
      <StateBox onClick={() => toggleFilter("idle", "states")}>
          <CutEdgesButton outlineColor={() => !unselectedFilters.types.includes("idle") ? "#79D7B9" : "black"}
                          backgroundColor={() => !unselectedFilters.types.includes("idle") ? "#204F3E" : "black"}
                          fontColor={"#79D7B9"}
                          edgeSizes={[10, 20]}
                          outlineWidth={2}
                          height={30}
                          content={"Idle"}/>
      </StateBox>
      <StateBox onClick={() => toggleFilter("mining", "states")}>
          <CutEdgesButton outlineColor={() => !unselectedFilters.types.includes("mining") ? "#98C7FF" : "black"}
                          backgroundColor={() => !unselectedFilters.types.includes("mining") ? "#004056" : "black"}
                          fontColor={"#98C7FF"}
                          edgeSizes={[10, 20]}
                          outlineWidth={2}
                          height={30}
                          content={"Mining"}/>
      </StateBox>
      <StateBox onClick={() => toggleFilter("auction", "states")}>
          <CutEdgesButton outlineColor={() => !unselectedFilters.types.includes("auction") ? "#F0D978" : "black"}
                          backgroundColor={() => !unselectedFilters.types.includes("auction") ? "#443807" : "black"}
                          fontColor={"#F0D978"}
                          edgeSizes={[10, 20]}
                          outlineWidth={2}
                          height={30}
                          content={"In Auction"}/>
      </StateBox>
      <StateBox onClick={() => toggleFilter("stuck", "states")}>
          <CutEdgesButton outlineColor={() => !unselectedFilters.types.includes("stuck") ? "#EF6E7E" : "black"}
                          backgroundColor={() => !unselectedFilters.types.includes("stuck") ? "#700E23" : "black"}
                          fontColor={"#EF6E7E"}
                          edgeSizes={[10, 20]}
                          outlineWidth={2}
                          height={30}
                          content={"Stuck"}/>
      </StateBox>
  </div>
)



const GradesTypesLevels = ({unselectedFilters, toggleFilter}) => (
    <div style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        flexWrap: "wrap",
    }}>
        <div className="flex jcc" style={{flex: 6}}>
            {[1, 2, 3, 4, 5, 6].map((grade) => {
                  const gradeType = gradeConverter(grade);
                  return (
                    <GradeAndLevelBox key={grade}
                                      onClick={() => toggleFilter(gradeType, "grades")}>
                        <CutEdgesButton
                          outlineColor={() => !unselectedFilters.grades.includes(gradeType) ? gradeOutlineColor : "transparent"}
                          backgroundColor={() => !unselectedFilters.grades.includes(gradeType) ? gradePaneColors(grade) : "black"}
                          fontColor={gradeOutlineColor}
                          edgeSizes={20}
                          outlineWidth={1}
                          height={45}
                          content={gradeType}/>
                    </GradeAndLevelBox>)
              }
            )}
        </div>
        <div style={{display: "flex", flexWrap: "wrap", minWidth: "276px"}}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((typeColor) => {
                const color = typePaneOutlineColors(typeColor);
                const typeName = type(typeColor);
                return (
                  <TypeBox key={typeColor}
                           onClick={() => toggleFilter(typeName, "types")}>
                      <CutEdgesButton outlineColor={() => !unselectedFilters.types.includes(typeName) ? color : "black"}
                                      backgroundColor={() => !unselectedFilters.types.includes(typeName) ? typePaneColors(typeColor) : "black"}
                                      fontColor={color}
                                      edgeSizes={[10, 20]}
                                      outlineWidth={2}
                                      height={30}
                                      content={typeName}/>
                  </TypeBox>)
            })}
        </div>
        <div className="flex jcc" style={{flex: 5}}>
            {[1, 2, 3, 4, 5].map((level =>
                <GradeAndLevelBox key={level}
                                  onClick={() => toggleFilter("lvl_" + level, "levels")}>
                    <CutEdgesButton
                      outlineColor={() => !unselectedFilters.levels.includes("lvl_" + level) ? levelOutlineColor : "transparent"}
                      backgroundColor={() => !unselectedFilters.levels.includes("lvl_" + level) ? levelPaneColors(level) : "black"}
                      fontColor={levelOutlineColor}
                      edgeSizes={20}
                      outlineWidth={1}
                      height={45}
                      content={level}/>
                </GradeAndLevelBox>
            ))}
        </div>
    </div>
)

const Levels = ({unselectedFilters, toggleFilter}) => (
    <div style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        flexWrap: "wrap",
    }}>
        <div className="flex jcc" style={{flex: 5}}>
            {[1, 2, 3, 4, 5].map((level =>
                <GradeAndLevelBox key={level}
                                  onClick={() => toggleFilter("lvl_" + level, "levels")}>
                    <CutEdgesButton
                      outlineColor={() => !unselectedFilters.levels.includes("lvl_" + level) ? levelOutlineColor : "transparent"}
                      backgroundColor={() => !unselectedFilters.levels.includes("lvl_" + level) ? levelPaneColors(level) : "black"}
                      fontColor={levelOutlineColor}
                      edgeSizes={20}
                      outlineWidth={1}
                      height={45}
                      content={level}/>
                </GradeAndLevelBox>
            ))}
        </div>
    </div>
)

const Types = ({unselectedFilters, toggleFilter}) => {
    return (
      <div style={{display: "flex", flexWrap: "wrap", minWidth: "276px"}}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((typeColor) => {
              const color = typePaneOutlineColors(typeColor);
              const typeName = type(typeColor);
              return (
                <TypeBox key={typeColor}
                         onClick={() => toggleFilter(typeName, "types")}>
                    <CutEdgesButton outlineColor={() => !unselectedFilters.types.includes(typeName) ? color : "black"}
                                    backgroundColor={() => !unselectedFilters.types.includes(typeName) ? typePaneColors(typeColor) : "black"}
                                    fontColor={color}
                                    edgeSizes={[10, 20]}
                                    outlineWidth={2}
                                    height={30}
                                    content={typeName}/>
                </TypeBox>)
          })}
      </div>
    )
}

const SortOptions = ({selectedSort, selectedSortDirection, toggleSort}) => {

    return (
      <div style={{
          width: "100%",
          backgroundColor: "#2A3238",
          display: "flex",
          padding: "5px",
          fontWeight: "normal",
          borderRadius: "5px",
          minWidth: "140px"
      }}>
          <div className="flex col" style={{flex: 2, margin: "0 5px"}}>
              <CutEdgesButton outlineColor={selectedSort === "acq" ? acquiredOutlineColor : "transparent"}
                              backgroundColor={selectedSort === "acq" ? acquiredPaneColor : "black"}
                              fontColor={acquiredOutlineColor}
                              edgeSizes={[10, 20]}
                              outlineWidth={1}
                              height={26}
                              fontSize={16}
                              content={"Acquired"}
                              onClick={() => toggleSort("acq", selectedSortDirection)}/>
              <CutEdgesButton outlineColor={selectedSort === "mrb" ? mrbOutlineColor : "transparent"}
                              backgroundColor={selectedSort === "mrb" ? mrbPaneColor : "black"}
                              fontColor={mrbOutlineColor}
                              edgeSizes={[10, 20]}
                              outlineWidth={1}
                              height={26}
                              fontSize={16}
                              content={"MRB"}
                              onClick={() => toggleSort("mrb", selectedSortDirection)}/>
          </div>
          <div className="flex col" style={{flex: 2, margin: "0 5px"}}>
              <CutEdgesButton outlineColor={selectedSort === "REA" ? restingEnergyOutlineColor : "transparent"}
                              backgroundColor={selectedSort === "REA" ? restingEnergyPaneColor : "black"}
                              fontColor={restingEnergyOutlineColor}
                              edgeSizes={[10, 20]}
                              outlineWidth={1}
                              height={26}
                              fontSize={16}
                              content={"REA"}
                              onClick={() => toggleSort("REA", selectedSortDirection)}/>
              <CutEdgesButton outlineColor={selectedSort === "level" ? "yellow" : "transparent"}
                              backgroundColor={selectedSort === "level" ? "#492106" : "black"}
                              fontColor={"yellow"}
                              edgeSizes={[10, 20]}
                              outlineWidth={1}
                              height={26}
                              fontSize={16}
                              content={"Level"}
                              onClick={() => toggleSort("level", selectedSortDirection)}/>
          </div>
          <div className="flex col" style={{flex:1}}>
              <div className="flex row jce" style={{marginTop: "5px"}}>
                  <CutEdgesButton outlineColor={() => selectedSortDirection === "up" ? "#E8848E" : "transparent"}
                                  backgroundColor={() => selectedSortDirection === "up" ? "#542329" : "black"}
                                  fontColor={"#E8848E"}
                                  edgeSizes={[10, 20]}
                                  outlineWidth={1}
                                  height={26}
                                  fontSize={16}
                                  content={"∧"}
                                  style={"margin: 0px 2px"}
                                  onClick={() => toggleSort(selectedSort, "up")}/>
                  <CutEdgesButton outlineColor={() => selectedSortDirection === "down" ? "#E8848E" : "transparent"}
                                  backgroundColor={() => selectedSortDirection === "down" ? "#542329" : "black"}
                                  fontColor={"#E8848E"}
                                  edgeSizes={[10, 20]}
                                  outlineWidth={1}
                                  height={26}
                                  fontSize={16}
                                  content={"∨"}
                                  style={"margin: 0px 2px"}
                                  onClick={() => toggleSort(selectedSort, "down")}/>
              </div>
          </div>
      </div>
    )
}