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
import GemStates from "./GemDashboardFilters/GemStates"
import SortOptions from "./GemDashboardFilters/SortOptions"
import GradesTypesLevels from "./GemDashboardFilters/GradesTypesLevels"

const transitionRules = {
    //transitionDelay: 'display 2s'
};

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
                <OpenCloseMobileFiltersButton mobileFiltersDisplayed={mobileFiltersDisplayed}
                                              onClick={() => toggleMobileFilters()}/>
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



