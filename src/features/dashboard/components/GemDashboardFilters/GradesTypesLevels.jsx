import {
    gradeConverter,
    gradeOutlineColor,
    gradePaneColors, levelOutlineColor, levelPaneColors,
    type,
    typePaneColors,
    typePaneOutlineColors
} from "../propertyPaneStyles";
import {CutEdgesButton} from "../../../../components/CutEdgesButton";
import React from "react";
import styled from "styled-components";

const AdjustContainer = styled.div`
    display: flex;
    flex-wrap: wrap; 
    justify-content: space-between;
    margin-right: .3vw;
    margin-left: .3vw;
    flex: 15;
       
    @media(min-width: 801px) and (max-width: 1820px) {
        order: -1;
        min-width: 800px;
        flex: 1;
       
    }
`;

const GradesTypesLevelsContainer = styled.div`
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: space-evenly;
        flex-wrap: wrap;
        padding: 8px;
        background-color: #24292F;
        clip-path: polygon(1% 0, 99% 0, 100% 10%, 100% 90%,99% 100%,1% 100%, 0 90%, 0 10%);
        -webkit-clip-path: polygon(1% 0, 99% 0, 100% 10%, 100% 90%,99% 100%,1% 100%, 0 90%, 0 10%);
        width: 100%;
        
        @media(min-width: 801px) and (max-width: 1800px) {
            justify-content: center;
        }
        
        @media(max-width: 800px) {
            width: 1120px;
        }
        
`;

const Grades = styled.div`
    display: flex;
    order: 3;
   
    @media(min-width: 801px) and (max-width: 1800px) {
        order: 2;
    }
`;

const Types = styled.div`
    display: flex;
    order: 2;
    max-width: 500px;
    min-width: 276px;
    flex-wrap: wrap;
    margin: 0 10px
    
    @media(min-width: 801px) and (max-width: 1800px) {
        flex-wrap: nowrap;
        max-width: 800px;
    }
    
    @media(max-width: 800px) {
        max-width: 390px;
    }
`;

const TypeBox = styled.div`
    @media(max-width: 599px) {
        margin: 1px 3px;
        min-width: 50px;
        font-size: 12px;
    }
    
    @media(min-width: 801px) and (max-width: 1800px) {
        min-width: 50px;
        
    }
   
    font-size: 16px;
    flex: 1;
    min-width: 70px; 
    margin: 3px 3px; 
    font-weight: normal
`;


const Levels = styled.div`
    display: flex;
    order: 1;
    
    @media(min-width: 801px) and (max-width: 1800px) {
        order: 1;
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


const GradesTypesLevels = ({unselectedFilters, toggleFilter}) => (
    <AdjustContainer>
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
                            <CutEdgesButton
                                outlineColor={() => !unselectedFilters.types.includes(typeName) ? color : "black"}
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
    </AdjustContainer>
);

export default GradesTypesLevels;