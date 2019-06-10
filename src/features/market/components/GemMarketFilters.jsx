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


const GemFiltersContainer = styled.div`
              margin-top: -10px;
              width: 100%;
              
      @media(max-width: 800px) {
            position: fixed;
            z-index: 2;
            bottom: 0;
            left: 0;
            background-color: black;
            overflow-x: scroll;
            margin: 0;
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

class GemMarketFilters extends Component {

    render() {
        const unselectedFilters = this.props.unselectedFilters || {};
        const {applyFilter, selectedSort, applySort, clearFilters, setDefaultFilters, minPrice, maxPrice} = this.props;

        return (
          <GemFiltersContainer>
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

const PricesContainer = styled.div`
    display: flex;
    justify-content: space-between;
    
    @media(max-width: 800px) {
        width: 240px;
    }
`;

const Prices = ({unselectedFilters, toggleFilter, maxPrice, minPrice}) => (
  <PricesContainer>
      <Arrows>
          <CutEdgesButton outlineColor={"#E8848E"}
                          backgroundColor={"#542329"}
                          fontColor={"#E8848E"}
                          edgeSizes={15}
                          outlineWidth={1}
                          height={30}
                          fontSize={18}
                          content={"∧"}
                          style={"margin: 2px 0px"}
                          onClick={() => {
                              const newLowPrice = ((isNaN(unselectedFilters.prices[0]) || Number(unselectedFilters.prices[0]) < minPrice) ?
                                +minPrice + 0.01 : Number(unselectedFilters.prices[0]) + 0.01).toFixed(2);
                              if (isNaN(unselectedFilters.prices[1])) {
                                  console.log("new low, price high:", newLowPrice, unselectedFilters.prices[1]);
                                  toggleFilter(newLowPrice < maxPrice ? newLowPrice : maxPrice, 'min-price')
                              } else {
                                  toggleFilter(newLowPrice < Number(unselectedFilters.prices[1]) ? newLowPrice : unselectedFilters.prices[1], 'min-price')
                              }
                          }}
          />
          <CutEdgesButton outlineColor={"#E8848E"}
                          backgroundColor={"#542329"}
                          fontColor={"#E8848E"}
                          edgeSizes={15}
                          outlineWidth={1}
                          height={30}
                          fontSize={18}
                          content={"∨"}
                          style={"margin: 2px 0px"}
                          onClick={() => {
                              const newLowPrice = (isNaN(unselectedFilters.prices[0]) ? minPrice : Number(unselectedFilters.prices[0]) - 0.01).toFixed(2);
                              toggleFilter(newLowPrice > minPrice ? newLowPrice : minPrice, 'min-price')
                          }}
          />
      </Arrows>
      <Price>
          <span>Low</span>
          <PriceInput
            id={"low-price-input"}
            type="text"
            placeholder="0"
            className="db"
            style={{color: "#F06F7F"}}
            value={document.activeElement.id === "low-price-input" ?
              unselectedFilters.prices[0] :
              (isNaN(unselectedFilters.prices[0]) || unselectedFilters.prices[0] < minPrice) ? minPrice : unselectedFilters.prices[0]}
            onChange={e => {
                toggleFilter(e.target.value, 'min-price')
            }}
          />
      </Price>
      <span style={{fontSize: "12px", marginTop: "25px", color: "black"}}>
            ETH
        </span>
      <Price>
          <span>High</span>
          <PriceInput
            id={"high-price-input"}
            type="text"
            className="db"
            style={{color: "#9AE791"}}
            value={document.activeElement.id === "high-price-input" ?
              unselectedFilters.prices[1] :
              (isNaN(unselectedFilters.prices[1]) || unselectedFilters.prices[1] > maxPrice) ? maxPrice : unselectedFilters.prices[1]}
            onChange={e => {
                toggleFilter(e.target.value, 'max-price')
            }}
          />
      </Price>
      <Arrows>
          <CutEdgesButton outlineColor={"#9AE791"}
                          backgroundColor={"#25511F"}
                          fontColor={"#9AE791"}
                          edgeSizes={15}
                          outlineWidth={1}
                          height={30}
                          fontSize={18}
                          content={"∧"}
                          style={"margin: 2px 0px"}
                          onClick={() => {
                              const newHighPrice = (isNaN(unselectedFilters.prices[1]) ? maxPrice : Number(unselectedFilters.prices[1]) + 0.01).toFixed(2);
                              toggleFilter(newHighPrice < maxPrice ? newHighPrice : maxPrice, 'max-price')
                          }}
          />
          <CutEdgesButton outlineColor={"#9AE791"}
                          backgroundColor={"#25511F"}
                          fontColor={"#9AE791"}
                          edgeSizes={15}
                          outlineWidth={1}
                          height={30}
                          fontSize={18}
                          content={"∨"}
                          style={"margin: 2px 0px"}
                          onClick={() => {
                              const newHighPrice = ((isNaN(unselectedFilters.prices[1]) || Number(unselectedFilters.prices[1]) > maxPrice)
                                ? +maxPrice - 0.01 : Number(unselectedFilters.prices[1]) - 0.01).toFixed(2);
                              if (isNaN(unselectedFilters.prices[0])) {
                                  toggleFilter(newHighPrice > minPrice ? newHighPrice : minPrice, 'max-price')
                              } else {
                                  console.log("new high", newHighPrice);
                                  toggleFilter(newHighPrice > Number(unselectedFilters.prices[0]) ? newHighPrice : unselectedFilters.prices[0], 'max-price')
                              }
                          }}
          />
      </Arrows>
  </PricesContainer>
)


const Arrows = styled.div`
    display: flex;
    flex-direction: column;
    width: 32px;
`;

const Price = styled.div`
    display: flex;
    flex-direction: column;
    font-size: 12px;
    color: black;
    padding-top: 5px;
    align-items: center;
`;

const PriceInput = styled.input`
    width: 55px;
    background-color: #24292F;
    border-width: 0;
    border-radius: 3px;
    padding: 2px;
    font-size: 18px;
    text-align: right;
`;

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
              <CutEdgesButton outlineColor={selectedSort.sortOption === "price" ? acquiredOutlineColor : "transparent"}
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