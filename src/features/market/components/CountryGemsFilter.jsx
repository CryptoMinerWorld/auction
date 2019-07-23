import React, {Component} from "react";
import styled from "styled-components";
import SortOptions from "./GemMarketFilters/SortOptions"
import Prices from "./GemMarketFilters/Prices"
import GradesTypesLevels from "./GemMarketFilters/GradesTypesLevels"
import FilterActions from "./GemMarketFilters/FilterActions"
import searchIcon from "../../../app/images/search.png";


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
            overflow-x: ${props => props.mobileFiltersDisplayed ? "auto" : "initial"}
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
}
`;

class GemMarketFilters extends Component {

    render() {
        const {countryData, handleClick, searchCountry, searchCountryValue,
            selectedCountry, mobileFiltersDisplayed, toggleMobileFilters} = this.props;

        return (
          <GemFiltersContainer mobileFiltersDisplayed={mobileFiltersDisplayed}>
              <OpenCloseMobileFiltersButton mobileFiltersDisplayed={mobileFiltersDisplayed}
                                            onClick={() => toggleMobileFilters()}/>
              <GemFiltersFlexWrapper>
                  <CountryList countries={countryData}
                               selectCountry={(country) => {
                                   handleClick(country);
                               }}
                               selectedCountry={selectedCountry}
                               searchCountry={searchCountry}
                               searchCountryValue={searchCountryValue}
                  />
              </GemFiltersFlexWrapper>
          </GemFiltersContainer>
        )
    }
}

export default GemMarketFilters;




const CountryList = ({countries, selectedCountry, selectCountry, selectHoveredId, searchCountry, searchCountryValue}) => {

    return (
      <CountryFilter>
          <CountryTableHeader>
              <CountrySearch selectedCountry={selectedCountry} searchCountry={searchCountry}
                             searchValue={searchCountryValue}/>
              {/*selectedCountry &&
              <CountryInfo>
                  Plots Available:
                  <span style={{
                      color: numberOfPlots > selectedCountry.availablePlots ? "red" : "pink",
                      margin: "0 10px 0 5px"
                  }}>{selectedCountry && selectedCountry.availablePlots}</span>
                  Total Plots:
                  <span style={{
                      color: "white",
                      margin: "0 10px 0 5px"
                  }}>{selectedCountry && selectedCountry.plots}</span>
              </CountryInfo>
              */}
          </CountryTableHeader>
          <CountriesTable>
              {countries && countries.map(country => (
                <CountryLine key={country.mapIndex}
                             selected={selectedCountry && country.name === selectedCountry.name}
                             onClick={() => selectCountry(country)}
                             >
                    {country.name}
                </CountryLine>
              ))}
          </CountriesTable>
      </CountryFilter>
    )
};

const SearchIcon = styled.img`
    width: 12px;
    margin-right: 5px;
`;

const SearchField = styled.input`
    border: 0;
    border-bottom: 1px solid white;
    color: white;
    width: 80px;
    background-color: #5e676d;
`;

const CountrySearch = ({selectedCountry, searchCountryValue, searchCountry}) => {
    return (
      <div style={{width: "160px"}}>
          <label style={{cursor: "pointer"}} htmlFor={"country-search"}><SearchIcon src={searchIcon}/>
              <span>Selected: </span></label>
          <SearchField type={"text"}
                       id={"country-search"}
                       value={searchCountryValue}
                       onChange={(e) => searchCountry(e.target.value)}
                       placeholder={selectedCountry && selectedCountry.name}/>
      </div>
    )
};