import React, {Component} from "react";
import {
    gradeConverter,
    gradeOutlineColor,
    gradePaneColors,
    levelOutlineColor,
    levelPaneColors,
    type,
    typePaneColors,
    typePaneOutlineColors
} from "./propertyPaneStyles";
import {CutEdgesButton} from "../../../components/CutEdgesButton";
import styled from "styled-components";
import SortOptions from "./GemMarketFilters/SortOptions"
import Prices from "./GemMarketFilters/Prices"


const GemFiltersContainer = styled.div`
              margin-top: -10px;
              width: 100%;
              
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
    flex-direction: column;
    -webkit-clip-path: polygon(100.23% 96.54%, 95.12% 99.87%, 8.69% 100.01%, 1.21% 98.76%, -0.22% 92.82%, 0.03% 2.74%, 4.31% -0.23%, 92.22% -0.24%, 98.41% 1.33%, 100.1% 5.29%);
    clip-path: polygon(100.23% 96.54%, 95.12% 99.87%, 8.69% 100.01%, 1.21% 98.76%, -0.22% 92.82%, 0.03% 2.74%, 4.31% -0.23%, 92.22% -0.24%, 98.41% 1.33%, 100.1% 5.29%); 

    @media(max-width: 800px) {
        padding: 5px 0;
        float: left;
        overflow-x: scroll;
        flex-direction: row;
    }
`;


const GradeAndLevelBox = styled.div`

    @media(max-width: 599px) {
        margin: 2px 2px; 
    }

    font-size: 22px;
    width: 60px;
    margin: 7px 7px; 
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
    min-width: 55px; 
    margin: 3px 3px; 
    font-weight: normal;
`;

const FilterGroupsContainer = styled.div`
    padding: 8px;
    background-color: #383F45;
    display: flex;
    flex-direction: column;
    margin: 10px 0;
    clip-path: polygon(0 0,95% 0,100% 10%,100% 90%,95% 100%,0 100%);
    -webkit-clip-path: polygon(0 0,95% 0,100% 10%,100% 90%,95% 100%,0 100%);    
    
    @media(max-width: 800px) {
        margin: 0 10px;
    }
`;
const ActionsFilterGroupsContainer = styled.div`
    padding: 8px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: #383F45;
    margin: 10px 0;
    clip-path: polygon(0 0, 95% 0,100% 10%,100% 90%,95% 100%,0 100%);
    -webkit-clip-path: polygon(0 0,95% 0,100% 10%,100% 90%,95% 100%,0 100%);

    @media(max-width: 800px) {
        margin: 0 10px;
        flex-direction: column;
        width: 120px;
        justify-content: center;
    }
`;


const GradesLevelsTypesFilterGroupContainer = styled.div`
    padding: 8px;
    background-color: #383F45;
    display: flex;
    flex-direction: column;
    margin: 10px 0;
    clip-path: polygon(0 0,95% 0,100% 3%,100% 97%,95% 100%,0 100%);
    -webkit-clip-path: polygon(0 0,95% 0,100% 3%,100% 97%,95% 100%,0 100%);
    
    @media(max-width: 800px) {
        flex-direction: row;
        margin: 0 10px;
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

class GemMarketFilters extends Component {

    render() {
        const unselectedFilters = this.props.unselectedFilters || {};
        const {applyFilter, selectedSort, applySort, clearFilters, setDefaultFilters, minPrice, maxPrice, mobileFiltersDisplayed, toggleMobileFilters} = this.props;

        return (
          <GemFiltersContainer mobileFiltersDisplayed={mobileFiltersDisplayed}>
              <OpenCloseMobileFiltersButton mobileFiltersDisplayed={mobileFiltersDisplayed} onClick={() => toggleMobileFilters()}/>
              <GemFiltersFlexWrapper>
                  <FilterGroupsContainer>
                      <SortOptions selectedSort={selectedSort} toggleSort={applySort}/>
                  </FilterGroupsContainer>
                  <FilterGroupsContainer>
                      <Prices unselectedFilters={unselectedFilters} toggleFilter={applyFilter} maxPrice={maxPrice}
                              minPrice={minPrice}/>
                  </FilterGroupsContainer>
                  <GradesLevelsTypesFilterGroupContainer>
                      <Grades unselectedFilters={unselectedFilters} toggleFilter={applyFilter}/>
                      <Levels unselectedFilters={unselectedFilters} toggleFilter={applyFilter}/>
                      <Types unselectedFilters={unselectedFilters} toggleFilter={applyFilter}/>
                  </GradesLevelsTypesFilterGroupContainer>
                  <ActionsFilterGroupsContainer>
                      <div style={{margin: "3px 3px", fontWeight: "normal", width: "100px"}}>
                          <CutEdgesButton outlineColor={"orange"}
                                          backgroundColor={"black"}
                                          edgeSizes={[5, 15]}
                                          outlineWidth={2}
                                          height={32}
                                          fontSize={18}
                                          content={"Clear"}
                                          onClick={() => clearFilters()}/>
                      </div>
                      <div style={{margin: "3px 3px", fontWeight: "normal", width: "100px"}}>
                          <CutEdgesButton outlineColor={"aquamarine"}
                                          backgroundColor={"black"}
                                          edgeSizes={[5, 15]}
                                          outlineWidth={2}
                                          height={32}
                                          fontSize={18}
                                          content={"Default"}
                                          onClick={() => setDefaultFilters()}/>
                      </div>
                  </ActionsFilterGroupsContainer>
              </GemFiltersFlexWrapper>
          </GemFiltersContainer>
        )
    }
}

export default GemMarketFilters;

const GradesContainer = styled.div`
    display: flex;
    flex-wrap: wrap; 
    margin: 5px 0;
    
    @media(max-width: 800px) {
        width: 390px;
        order: 1;
        margin-right: 10px;
    }
`;

const LevelsContainer = styled.div`
    display: flex;
    flex-wrap: wrap; 
    margin: 5px 0;
    
    @media(max-width: 800px) {
        width: 390px;
        order: 3;
        margin-left: 10px;
    }
`;

const TypesContainer = styled.div`
    display: flex;
    flex-wrap: wrap; 
    margin: 5px 0;
    
    @media(max-width: 800px) {
        width: 390px;
        order: 2;
    }
`;

const Grades = ({unselectedFilters, toggleFilter}) => (
  <GradesContainer>
      {[1, 2, 3, 4, 5, 6].map((grade) => {
            const gradeType = gradeConverter(grade);
            return (
              <GradeAndLevelBox key={grade}
                                onClick={() => toggleFilter(gradeType, "grades")}>
                  <CutEdgesButton
                    outlineColor={() => !unselectedFilters.grades.includes(gradeType) ? gradeOutlineColor : "transparent"}
                    backgroundColor={() => !unselectedFilters.grades.includes(gradeType) ? gradePaneColors(grade) : "black"}
                    fontColor={gradeOutlineColor}
                    edgeSizes={10}
                    outlineWidth={2}
                    height={55}
                    content={gradeType}/>
              </GradeAndLevelBox>)
        }
      )}
  </GradesContainer>
)

const Levels = ({unselectedFilters, toggleFilter}) => (
  <LevelsContainer>
      {[1, 2, 3, 4, 5].map((level =>
          <GradeAndLevelBox key={level}
                            onClick={() => toggleFilter("lvl_" + level, "levels")}>
              <CutEdgesButton
                outlineColor={() => !unselectedFilters.levels.includes("lvl_" + level) ? levelOutlineColor : "transparent"}
                backgroundColor={() => !unselectedFilters.levels.includes("lvl_" + level) ? levelPaneColors(level) : "black"}
                fontColor={levelOutlineColor}
                edgeSizes={10}
                outlineWidth={2}
                height={55}
                content={level}/>
          </GradeAndLevelBox>
      ))}
  </LevelsContainer>
)

const Types = ({unselectedFilters, toggleFilter}) => (
  <TypesContainer>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((typeColor) => {
          const color = typePaneOutlineColors(typeColor);
          const typeName = type(typeColor);
          return (
            <TypeBox key={typeColor}
                     onClick={() => toggleFilter(typeName, "types")}>
                <CutEdgesButton outlineColor={() => !unselectedFilters.types.includes(typeName) ? color : "black"}
                                backgroundColor={() => !unselectedFilters.types.includes(typeName) ? typePaneColors(typeColor) : "black"}
                                fontColor={color}
                                edgeSizes={[5, 10]}
                                outlineWidth={2}
                                height={30}
                                content={typeName}/>
            </TypeBox>)
      })}
  </TypesContainer>
)






