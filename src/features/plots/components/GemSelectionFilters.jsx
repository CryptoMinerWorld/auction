import React, {Component} from "react";
import {
    gradeConverter,
    gradeOutlineColor,
    gradePaneColors,
    levelOutlineColor,
    levelPaneColors,
    mrbOutlineColor,
    mrbPaneColor,
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
              bottom: -11px;
              background-color: rgb(42, 50, 56);
              position: absolute;
              z-index: 20;
              left: 10px;
              padding: 10px 0px 0;
              right: 14px;
              
              
              &:before {
                position: absolute;
                display: block;
                width: 100%;
                content: "";
                height: 10px;
                background-color: rgb(42, 50, 56);
                top: -17px;
                left: 0;
                right: 0;
              }
              
              &:after {
                position: absolute;
                display: block;
                width: 100%;
                content: "";
                height: 5px;
                background-color: rgb(42, 50, 56);
                top: -28px;
                left: 0;
                right: 0;
              }
            
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


class GemSelectionFilters extends Component {

    async componentDidMount() {
    }

    render() {

        const unselectedFilters = this.props.unselectedFilters || {};
        const {toggleFilter, selectedSort, toggleSort, clearFilters, setDefaultFilters,
             combineAsset, proceedCombine, selectedGems, changeCombineAsset} = this.props;

        return (
          <GemFiltersContainer>
              <div
                className="flex col ais bg-off-black shadow-3 white"
                style={{
                    padding: "5px 10px 0",
                    WebkitClipPath:
                      'polygon(100.23% 96.54%, 95.12% 99.87%, 8.69% 100.01%, 1.21% 98.76%, -0.22% 92.82%, 0.03% 2.74%, 4.31% -0.23%, 92.22% -0.24%, 98.41% 1.33%, 100.1% 5.29%)',
                    clipPath:
                      'polygon(100.23% 96.54%, 95.12% 99.87%, 8.69% 100.01%, 1.21% 98.76%, -0.22% 92.82%, 0.03% 2.74%, 4.31% -0.23%, 92.22% -0.24%, 98.41% 1.33%, 100.1% 5.29%)',
                }}>
                  <div style={{width: "100%", textAlign: "center"}}>Filtering and Sorting Section</div>
                  <GradesAndLevels unselectedFilters={unselectedFilters} toggleFilter={toggleFilter}/>
                  <div style={{width: "100%", display: "flex", flexWrap: "wrap"}}>
                      <div style={{flex: "9"}}>
                          <Types unselectedFilters={unselectedFilters} toggleFilter={toggleFilter}/>
                      </div>
                      <div style={{flex: "3", padding: "5px 5px"}}>
                          {combineAsset ?
                            <CombineGems combineAsset={combineAsset} proceedCombine={proceedCombine} 
                                selectedGems={selectedGems} changeCombineAsset={changeCombineAsset}/> :
                            <SortOptions selectedSort={selectedSort} toggleSort={toggleSort}/>
                          }
                      </div>
                      <div style={{flex: "2", flexDirection: "column"}}>
                          {/*Actions*/}

                          {combineAsset ? 
                            <div style={{flex: 2, margin: "5px 3px", fontWeight: "normal", display: "flex"}}>
                                {[0, 1, 2, 3].map(i => 
                                    <CutEdgesButton outlineColor={"#FF00CD"}
                                        key={i}
                                        backgroundColor={selectedGems.length > i ? "#FF00CD" : "black"}
                                        fontColor={selectedGems.length > i ? "black" : "#FF00CD"}
                                        edgeSizes={[15, 10]}
                                        outlineWidth={1}
                                        height={32}
                                        fontSize={16}
                                        content={i + 1}
                                        otherStyles={"margin: 0 1px;"}
                                    />
                                )}
                            </div> 
                          : ""}
                          <div style={{flex: 2, margin: "5px 3px", fontWeight: "normal"}}>
                              <CutEdgesButton outlineColor={"orange"}
                                              backgroundColor={"black"}
                                              edgeSizes={[7, 20]}
                                              outlineWidth={2}
                                              height={32}
                                              fontSize={16}
                                              content={"Clear"}
                                              onClick={() => !combineAsset ? clearFilters() : setDefaultFilters()}/>
                          </div>
                          {!combineAsset ? 
                          <div style={{flex: 2, margin: "8px 3px", fontWeight: "normal"}}>
                              <CutEdgesButton outlineColor={"aquamarine"}
                                              backgroundColor={"black"}
                                              edgeSizes={[7, 20]}
                                              outlineWidth={2}
                                              height={32}
                                              fontSize={16}
                                              content={"Default"}
                                              onClick={() => setDefaultFilters()}/>
                          </div> : ""}
                      </div>
                  </div>
              </div>
          </GemFiltersContainer>
        )
    }
}

export default GemSelectionFilters;

const GradesAndLevels = ({unselectedFilters, toggleFilter}) => {
    return (
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
}

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

const CombineGems = ({combineAsset, proceedCombine, selectedGems, changeCombineAsset}) => {

    return (
        <div style={{flex: "2", flexDirection: "column"}}>
                          {/*Actions*/}
                          <div style={{flex: 2, fontWeight: "normal"}}>
                              <CutEdgesButton outlineColor={combineAsset == "silver" ? "silver" : "transparent"}
                                              fontColor={"silver"}
                                              backgroundColor={"black"}
                                              edgeSizes={[7, 20]}
                                              outlineWidth={2}
                                              height={32}
                                              fontSize={16}
                                              content={"Create Silver"}
                                              onClick={() => combineAsset === "gold" && changeCombineAsset("silver")}/>
                          </div>
                          <div style={{flex: 2, margin: "5px 3px", fontWeight: "normal"}}>
                              <CutEdgesButton outlineColor={combineAsset == "gold" ? "gold" : "transparent"}
                                              fontColor={"gold"}
                                              backgroundColor={"black"}
                                              edgeSizes={[7, 20]}
                                              outlineWidth={2}
                                              height={32}
                                              fontSize={16}
                                              content={"Create Gold"}
                                              onClick={() => combineAsset === "silver" && changeCombineAsset("gold")}/>
                          </div>
                      </div>
    )
}

const SortOptions = ({selectedSort, toggleSort}) => {
    const mrbActive = ["mrb_up", "mrb_down"].includes(selectedSort);
    const levelActive = !mrbActive;
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
          <div className="flex col" style={{flex: 1, margin: "0 5px"}}>
              <CutEdgesButton outlineColor={mrbActive ? mrbOutlineColor : "transparent"}
                              backgroundColor={mrbActive ? mrbPaneColor : "black"}
                              fontColor={mrbOutlineColor}
                              edgeSizes={[10, 20]}
                              outlineWidth={1}
                              height={26}
                              fontSize={16}
                              content={"MRB"}
                              onClick={() => toggleSort("mrb_down")}/>
              <div className="flex row jce" style={{marginTop: "5px"}}>
                  <CutEdgesButton outlineColor={selectedSort === "mrb_up" ? mrbOutlineColor : "transparent"}
                                  backgroundColor={selectedSort === "mrb_up" ? mrbPaneColor : "black"}
                                  fontColor={mrbOutlineColor}
                                  edgeSizes={[10, 20]}
                                  outlineWidth={1}
                                  height={26}
                                  fontSize={16}
                                  content={"∧"}
                                  style={"margin: 0px 2px"}
                                  onClick={() => toggleSort("mrb_up")}
                  />
                  <CutEdgesButton outlineColor={selectedSort === "mrb_down" ? mrbOutlineColor : "transparent"}
                                  backgroundColor={selectedSort === "mrb_down" ? mrbPaneColor : "black"}
                                  fontColor={mrbOutlineColor}
                                  edgeSizes={[10, 20]}
                                  outlineWidth={1}
                                  height={26}
                                  fontSize={16}
                                  content={"∨"}
                                  style={"margin: 0px 2px"}
                                  onClick={() => toggleSort("mrb_down")}/>
              </div>
          </div>
          <div className="flex col" style={{flex: 1, margin: "0 5px"}}>
              <CutEdgesButton outlineColor={levelActive ? "yellow" : "transparent"}
                              backgroundColor={levelActive ? "#492106" : "black"}
                              fontColor={"yellow"}
                              edgeSizes={[10, 20]}
                              outlineWidth={1}
                              height={26}
                              fontSize={16}
                              content={"Level"}
                              onClick={() => toggleSort("level_up")}/>
              <div className="flex row jce" style={{marginTop: "5px",}}>
                  <CutEdgesButton outlineColor={() => selectedSort === "level_up" ? "yellow" : "transparent"}
                                  backgroundColor={() => selectedSort === "level_up" ? "#492106" : "black"}
                                  fontColor={"yellow"}
                                  edgeSizes={[10, 20]}
                                  outlineWidth={1}
                                  height={26}
                                  fontSize={16}
                                  content={"∧"}
                                  style={"margin: 0px 2px"}
                                  onClick={() => toggleSort("level_up")}/>
                  <CutEdgesButton outlineColor={() => selectedSort === "level_down" ? "yellow" : "transparent"}
                                  backgroundColor={() => selectedSort === "level_down" ? "#492106" : "black"}
                                  fontColor={"yellow"}
                                  edgeSizes={[10, 20]}
                                  outlineWidth={1}
                                  height={26}
                                  fontSize={16}
                                  content={"∨"}
                                  style={"margin: 0px 2px"}
                                  onClick={() => toggleSort("level_down")}/>
              </div>
          </div>
      </div>
    )
}