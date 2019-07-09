import React, {Component} from "react";
import styled from "styled-components";
import SortOptions from "./GemMarketFilters/SortOptions"
import Prices from "./GemMarketFilters/Prices"
import GradesTypesLevels from "./GemMarketFilters/GradesTypesLevels"
import FilterActions from "./GemMarketFilters/FilterActions"


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
                <OpenCloseMobileFiltersButton mobileFiltersDisplayed={mobileFiltersDisplayed}
                                              onClick={() => toggleMobileFilters()}/>
                <GemFiltersFlexWrapper>
                    <FilterGroupsContainer>
                        <SortOptions selectedSort={selectedSort} toggleSort={applySort}/>
                    </FilterGroupsContainer>
                    <FilterGroupsContainer>
                        <Prices unselectedFilters={unselectedFilters} toggleFilter={applyFilter} maxPrice={maxPrice}
                                minPrice={minPrice}/>
                    </FilterGroupsContainer>
                    <GradesTypesLevels unselectedFilters={unselectedFilters} toggleFilter={applyFilter}/>

                    <FilterActions clearFilters={clearFilters} setDefaultFilters={setDefaultFilters}/>
                </GemFiltersFlexWrapper>
            </GemFiltersContainer>
        )
    }
}

export default GemMarketFilters;






