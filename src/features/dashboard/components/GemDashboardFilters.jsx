import React, {Component} from "react";
import {
    acquiredOutlineColor,
    acquiredPaneColor,
    gradeConverter,
    gradeOutlineColor,
    gradePaneColors,
    levelOutlineColor,
    levelPaneColors,
    mrbOutlineColor,
    mrbPaneColor,
    restingEnergyOutlineColor,
    restingEnergyPaneColor,
    type,
    typePaneColors,
    typePaneOutlineColors
} from "./propertyPaneStyles";
import {CutEdgesButton} from "../../../components/CutEdgesButton";
import styled from "styled-components";

const transitionRules = {
    //transitionDelay: 'display 2s'
}

const GemFiltersContainer = styled.div`
      width: 100%;
      margin: 5px 0;
      
      @media(max-width: 800px) {
            position: fixed;
            z-index: 2;
            bottom: 0;
            left: 0;
            background-color: black;
            margin: 0;
            height: ${props => props.mobileFiltersDisplayed ? "auto" : "3px"}
            border-top: 1px solid white;
      }
`;

const GemFiltersFlexWrapper = styled.div`
    display: flex;
    color: white;
    padding: 5px 10px 0;
    justify-content: space-around;
    -webkit-clip-path: polygon(100.23% 96.54%, 95.12% 99.87%, 8.69% 100.01%, 1.21% 98.76%, -0.22% 92.82%, 0.03% 2.74%, 4.31% -0.23%, 92.22% -0.24%, 98.41% 1.33%, 100.1% 5.29%);
    clip-path: polygon(100.23% 96.54%, 95.12% 99.87%, 8.69% 100.01%, 1.21% 98.76%, -0.22% 92.82%, 0.03% 2.74%, 4.31% -0.23%, 92.22% -0.24%, 98.41% 1.33%, 100.1% 5.29%); 

    @media(max-width: 800px) {
        padding: 5px 0;
        float: left;
        overflow-x: scroll;
    }
    
    @media(min-width: 1520px) {
        font-size: .9vw;
      }
`;

const GradesTypesLevelsContainer = styled.div`
        align-items: center;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        flex-wrap: wrap;
        padding: 8px;
        background-color: #24292F;
        clip-path: polygon(1% 0, 99% 0, 100% 10%, 100% 90%,99% 100%,1% 100%, 0 90%, 0 10%);
        -webkit-clip-path: polygon(1% 0, 99% 0, 100% 10%, 100% 90%,99% 100%,1% 100%, 0 90%, 0 10%);
        
        @media(min-width: 801px and max-width: 1800px) {
            justify-content: center;
            max-width: 640px;
        }
        
        @media(max-width: 800px) {
            width: 1120px;
        }
        
`;

const GradeAndLevelBox = styled.div`

    @media(max-width: 599px) {
        font-size: 16px;
        margin: 2px 1px; 
    }
    
    @media(min-width: 1520px) {
        font-size: .8vw;
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
    margin: 3px 3px; 
    font-weight: normal
`;

const StateBox = styled.div`

    @media(max-width: 599px) {
        margin: 1px 3px;
        min-width: 50px;
        font-size: 12px;
    }
    
    @media(min-width: 1520px) {
        font-size: .8vw;
    }
    
    @media (min-width: 801px) and (max-width: 1100px) {
        font-size: 1.3vw;
    }
    
    min-width:210px;
    align-items: center;
    align-contents: center;   
    font-size: 16px;
    flex: 1;
    min-width: 70px; 
    margin: 3px 3px; 
    font-weight: normal
`;

const Types = styled.div`
    display: flex;
    order: 2;
    max-width: 500px;
    min-width: 276px;
    flex-wrap: wrap;
    margin: 0 10px
    
    @media(min-width: 801px and max-width: 1800px) {
        order: 3;
    }
    
    @media(max-width: 800px) {
        max-width: 390px;
    }
`;

const Levels = styled.div`
    display: flex;
    order: 1;
    
    @media(min-width: 801px and max-width: 1800px) {
        order: 1;
    }
`;

const Grades = styled.div`
    display: flex;
    order: 3;
   
    @media(min-width: 801px and max-width: 1800px) {
        order: 2;
    }
`;

const OpenCloseMobileFiltersButton = styled.div`
    
    @media(max-width: 800px) {
        position: absolute;
        z-index: 3;
        
        left:0;
        right:0;
        margin:0 auto;
        
        border: 1px solid white;
        ${props => props.mobileFiltersDisplayed ?
        `
            top: -20px;
            height: 20px;
            width: 22px;
            &:after {
                display: block;
                position: absolute;
                width: 20px;
                height: 19px;
                content: 'v';
                left: 0;
                right: 0;
                color: white;
                background-color: black;
                text-align: center;
                font-size: 16px;
            }
        `
        :
        `
            top: -25px;
            height: 25px;
            width: 100px;
            &:after {
                    display: block
                    position: absolute;
                    width: 98px;
                    height: 24px;
                    content: 'Filter/Sort';
                    left: 0;
                    right: 0;
                    color: white;
                    background-color: black;
                    text-align: center;
                    font-size: 16px;
                }
        `
        }
    }
}
`;

class GemDashboardFilters extends Component {

    render() {
        const unselectedFilters = this.props.unselectedFilters || {};
        const {applyFilter, selectedSort, applySort, clearFilters, setDefaultFilters, mobileFiltersDisplayed, toggleMobileFilters} = this.props;

        return (
          <GemFiltersContainer mobileFiltersDisplayed={mobileFiltersDisplayed}>
              <OpenCloseMobileFiltersButton mobileFiltersDisplayed={mobileFiltersDisplayed} onClick={() => toggleMobileFilters()}/>
              <GemFiltersFlexWrapper>
                  <GemStates unselectedFilters={unselectedFilters} toggleFilter={applyFilter}/>
                  <SortOptions selectedSort={selectedSort} toggleSort={applySort}/>
                  <GradesTypesLevels unselectedFilters={unselectedFilters} toggleFilter={applyFilter}/>
                  <FilterActions>
                      <div style={{margin: "3px 3px", fontWeight: "normal"}}>
                          <CutEdgesButton outlineColor={"orange"}
                                          backgroundColor={"black"}
                                          edgeSizes={[7, 20]}
                                          outlineWidth={2}
                                          height={32}
                                          content={"Clear"}
                                          onClick={() => clearFilters()}/>
                      </div>
                      <div style={{margin: "3px 3px", fontWeight: "normal"}}>
                          <CutEdgesButton outlineColor={"aquamarine"}
                                          backgroundColor={"black"}
                                          edgeSizes={[7, 20]}
                                          outlineWidth={2}
                                          height={32}
                                          content={"Default"}
                                          onClick={() => setDefaultFilters()}/>
                      </div>
                  </FilterActions>
              </GemFiltersFlexWrapper>
          </GemFiltersContainer>
        )
    }
}

export default GemDashboardFilters;

const FilterActions = styled.div`
    display: flex;
    flex-direction: column; 
    justify-content: center;
    width: 110px;
    padding: 8px;
    background-color: #24292F;
    clip-path: polygon(10% 0, 90% 0, 100% 10%, 100% 90%,90% 100%, 10% 100%, 0 90%, 0% 10%);
    -webkit-clip-path: polygon(10% 0, 90% 0, 100% 10%, 100% 90%,90% 100%, 10% 100%, 0 90%, 0% 10%);
    font-size: 16px;
    
    @media(max-width: 800px) {
        width: 100px;
        font-size: 14px;
        margin: 0 10px;
    }
`;

const GemStates = ({unselectedFilters, toggleFilter}) => (
  <GemStatesContainer>
      <StateBox onClick={() => toggleFilter("idle", "states")}>
          <CutEdgesButton outlineColor={() => !unselectedFilters.states.includes("idle") ? "#79D7B9" : "black"}
                          backgroundColor={() => !unselectedFilters.states.includes("idle") ? "#204F3E" : "black"}
                          fontColor={"#79D7B9"}
                          edgeSizes={[10, 20]}
                          outlineWidth={2}
                          height={30}
                          content={"Idle"}/>
      </StateBox>
      <StateBox onClick={() => toggleFilter("mining", "states")}>
          <CutEdgesButton outlineColor={() => !unselectedFilters.states.includes("mining") ? "#98C7FF" : "black"}
                          backgroundColor={() => !unselectedFilters.states.includes("mining") ? "#004056" : "black"}
                          fontColor={"#98C7FF"}
                          edgeSizes={[10, 20]}
                          outlineWidth={2}
                          height={30}
                          content={"Mining"}/>
      </StateBox>
      <StateBox onClick={() => toggleFilter("auction", "states")}>
          <CutEdgesButton outlineColor={() => !unselectedFilters.states.includes("auction") ? "#F0D978" : "black"}
                          backgroundColor={() => !unselectedFilters.states.includes("auction") ? "#443807" : "black"}
                          fontColor={"#F0D978"}
                          edgeSizes={[10, 20]}
                          outlineWidth={2}
                          height={30}
                          content={"In Auction"}/>
      </StateBox>
      <StateBox onClick={() => toggleFilter("stuck", "states")}>
          <CutEdgesButton outlineColor={() => !unselectedFilters.states.includes("stuck") ? "#EF6E7E" : "black"}
                          backgroundColor={() => !unselectedFilters.states.includes("stuck") ? "#700E23" : "black"}
                          fontColor={"#EF6E7E"}
                          edgeSizes={[10, 20]}
                          outlineWidth={2}
                          height={30}
                          content={"Stuck"}/>
      </StateBox>
  </GemStatesContainer>
)

const GemStatesContainer = styled.div`
    display: flex;
    flex-wrap: wrap; 
    max-width: 200px;
    align-items: center;
    align-content: center;
    padding: 8px;
    background-color: #24292F;
    clip-path: polygon(8% 0, 92% 0, 100% 10%, 100% 90%,92% 100%, 8% 100%, 0 90%, 0% 10%);
    -webkit-clip-path: polygon(8% 0, 92% 0, 100% 10%, 100% 90%,92% 100%, 8% 100%, 0 90%, 0% 10%);
    
    @media(max-width: 800px) {
        width: 175px;
        margin: 0 10px;
    }
    
    @media(min-width: 1520px) {
        font-size: .8vw;
    }
`;

const GradesTypesLevels = ({unselectedFilters, toggleFilter}) => (
  <GradesTypesLevelsContainer>
      <Grades>
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
      </Grades>
      <Types>
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
      </Types>
      <Levels>
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
      </Levels>
  </GradesTypesLevelsContainer>
)

const SortOptionsContainer = styled.div`
      display: flex;
      font-weight: normal;
      border-radius: 5px;
      min-width: 270px;
      align-items: center;
      width: 270px;
      padding: 8px;
      background-color: #24292F;
      clip-path: polygon(5% 0, 95% 0, 100% 10%, 100% 90%,95% 100%, 5% 100%, 0 90%, 0% 10%);
      -webkit-clip-path: polygon(5% 0, 95% 0, 100% 10%, 100% 90%,95% 100%, 5% 100%, 0 90%, 0% 10%);
      font-size: 16px;
      
      @media(max-width: 800px) {
        min-width: 220px;
        width: 215px;
        font-size: 14px;
        margin: 0 10px;
      }
      
      @media(min-width: 1520px) {
        font-size: .8vw;
      }
`;

const SortOptions = ({selectedSort, toggleSort}) => {
    return (
      <SortOptionsContainer>
          <div className="flex col" style={{flex: 2, margin: "0px 2px"}}>
              <CutEdgesButton outlineColor={selectedSort.sortOption === "acq" ? acquiredOutlineColor : "transparent"}
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
          <div className="flex col" style={{flex: 2, margin: "0px 2px"}}>
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
              <CutEdgesButton outlineColor={() => selectedSort.sortDirection === "down" ? "#E8848E" : "transparent"}
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
    )
}
