import React, {Component} from "react";
import styled from "styled-components";
import searchIcon from "../../../app/images/search.png";
import {CutEdgesButton} from "../../../components/CutEdgesButton";


const GemFiltersContainer = styled.div`
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
    -webkit-clip-path: polygon(100.23% 96.54%,95.12% 99.87%,0% 100.01%,0% 0%,92.22% -0.24%,98.41% 1.33%,100.1% 5.29%);
    clip-path: polygon(100.23% 96.54%,95.12% 99.87%,0% 100.01%,0% 0%,92.22% -0.24%,98.41% 1.33%,100.1% 5.29%); 

    @media(max-width: 800px) {
        padding: 5px 0;
        float: left;
        flex-direction: row;
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

const ActionsFilterGroupsContainer = styled.div`
    padding: 5px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    background-color: #5E676D;
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

class GemMarketFilters extends Component {

    render() {
        const {
            countries, selectCountry, searchCountry, searchCountryValue, clearFilter,
            selectedCountry, mobileFiltersDisplayed, toggleMobileFilters
        } = this.props;

        const searchedCountries = searchCountryValue ?
          countries.filter(country => country.name.toLowerCase().includes(searchCountryValue.toLowerCase())) : countries;

        return (
          <GemFiltersContainer mobileFiltersDisplayed={mobileFiltersDisplayed}>
              <OpenCloseMobileFiltersButton mobileFiltersDisplayed={mobileFiltersDisplayed}
                                            onClick={() => toggleMobileFilters()}/>
              <GemFiltersFlexWrapper>
                  <CountryList countries={searchedCountries}
                               selectCountry={selectCountry}
                               selectedCountry={selectedCountry}
                               searchCountry={searchCountry}
                               searchCountryValue={searchCountryValue}
                  />
                  <ActionsFilterGroupsContainer>
                      <div style={{margin: "3px 3px", fontWeight: "normal", width: "140px"}}>
                          <CutEdgesButton outlineColor={"orange"}
                                          backgroundColor={"black"}
                                          edgeSizes={[5, 15]}
                                          outlineWidth={2}
                                          height={32}
                                          fontSize={18}
                                          content={"Clear"}
                                          onClick={() => clearFilter()}/>
                      </div>
                  </ActionsFilterGroupsContainer>
              </GemFiltersFlexWrapper>
          </GemFiltersContainer>
        )
    }
}

export default GemMarketFilters;


const CountryList = ({countries, selectedCountry, selectCountry, searchCountry, searchCountryValue}) => {
    return (
      <CountryFilter>
          <CountryTableHeader>
              <CountrySearch selectedCountry={selectedCountry} searchCountry={searchCountry}
                             searchValue={searchCountryValue}/>
          </CountryTableHeader>
          <CountriesTable>
              {countries && countries.map(country => (
                <CountryLine key={country.countryId}
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

const CountryFilter = styled.div`
    border-bottom: 2px solid #5e676d;
`;

const CountriesTable = styled.div`
    display: flex;
    flex-wrap: wrap;
    height: 450px;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #24292F;
    padding: 5px;
    align-content: flex-start;
    align-items: flex-start;    
`;

const CountryLine = styled.div`
    width: 100px;
    font-size: 12px;
    color: ${props => props.selected ? "white" : "#525B61"};
    
    &:hover {
        color: white;
        cursor: pointer;
    }
`;

const CountryTableHeader = styled.div`
    background-color: #5E676D;
    font-size: 12px;
    font-weight: normal;
    padding: 7px 5px;
    color: black;
    display: flex;
    justify-content: space-between;
`;

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