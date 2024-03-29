import React, {Component} from "react";
import styled from "styled-components";
import GemStates from "./GemDashboardFilters/GemStates"
import SortOptions from "./GemDashboardFilters/SortOptions"
import GradesTypesLevels from "./GemDashboardFilters/GradesTypesLevels"
import FilterActions from "./GemDashboardFilters/FilterActions"

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
            overflow-x: ${props => props.mobileFiltersDisplayed ? "auto" : "initial"}
      }
`;

const GemFiltersFlexWrapper = styled.div`
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
  
    color: white;
    padding: 5px 10px 0;
    justify-content: space-between;
    -webkit-clip-path: polygon(100.23% 96.54%, 95.12% 99.87%, 8.69% 100.01%, 1.21% 98.76%, -0.22% 92.82%, 0.03% 2.74%, 4.31% -0.23%, 92.22% -0.24%, 98.41% 1.33%, 100.1% 5.29%);
    clip-path: polygon(100.23% 96.54%, 95.12% 99.87%, 8.69% 100.01%, 1.21% 98.76%, -0.22% 92.82%, 0.03% 2.74%, 4.31% -0.23%, 92.22% -0.24%, 98.41% 1.33%, 100.1% 5.29%); 

    @media(max-width: 800px) {
        padding: 5px 0;
        float: left;
    }
    
    @media(min-width: 1520px) {
        font-size: .9vw;
    }
    
    @media(min-width: 801px) and (max-width: 1820px) {
        flex-wrap: wrap-reverse;
        justify-content: space-evenly;
    }
`;


const OpenCloseMobileFiltersButton = styled.div`
    
    @media(max-width: 800px) {
        position: absolute;
        z-index: 3;
        
        left:0;
        right:0;
        margin:0 auto;
        
        ${props => props.mobileFiltersDisplayed ?
    `
            height: 20px;
            width: 22px;
            &:after {
                display: block;
                position: fixed;
                width: 4vw;
                height: 19px;
                content: 'V';
                left: 48vw;
                bottom: 102px;
                color: white;
                border: 1px solid white;
                background-color: black;
                text-align: center;
                font-size: 14px;
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
                    border: 1px solid white;
                    background-color: black;
                    text-align: center;
                    font-size: 16px;
                }
        `
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
                    <FilterActions clearFilters={clearFilters} setDefaultFilters={setDefaultFilters} />
                </GemFiltersFlexWrapper>
            </GemFiltersContainer>
        )
    }
}

export default GemDashboardFilters;



