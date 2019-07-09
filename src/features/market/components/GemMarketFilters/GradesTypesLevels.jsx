import React from "react"
import styled from "styled-components";
import {
    gradeConverter,
    gradeOutlineColor,
    gradePaneColors,
    levelOutlineColor,
    levelPaneColors, type, typePaneColors, typePaneOutlineColors
} from "../propertyPaneStyles";
import {CutEdgesButton} from "../../../../components/CutEdgesButton";

const GradesTypesLevelsFilterGroupContainer = styled.div`
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

const GradeAndLevelBox = styled.div`

    @media(max-width: 599px) {
        margin: 2px 2px; 
    }

    font-size: 22px;
    width: 60px;
    margin: 7px 7px; 
    font-weight: normal;
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
        width: 445px;
        order: 2;
    }
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

const GradesTypesLevels = ({unselectedFilters, toggleFilter}) => {
    return (
        <GradesTypesLevelsFilterGroupContainer>
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
            <TypesContainer>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((typeColor) => {
                    const color = typePaneOutlineColors(typeColor);
                    const typeName = type(typeColor);
                    return (
                        <TypeBox key={typeColor}
                                 onClick={() => toggleFilter(typeName, "types")}>
                            <CutEdgesButton
                                outlineColor={() => !unselectedFilters.types.includes(typeName) ? color : "black"}
                                backgroundColor={() => !unselectedFilters.types.includes(typeName) ? typePaneColors(typeColor) : "black"}
                                fontColor={color}
                                edgeSizes={[5, 10]}
                                outlineWidth={2}
                                height={30}
                                content={typeName}/>
                        </TypeBox>)
                })}
            </TypesContainer>
        </GradesTypesLevelsFilterGroupContainer>
    );
};

export default GradesTypesLevels;
