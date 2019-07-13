import React, {Component} from 'react';
import styled from 'styled-components';
import Slider, {createSliderWithTooltip} from 'rc-slider';
import 'rc-slider/assets/index.css';
import actionButtonImage from "../../../app/images/noTextGemButton.png";
import searchIcon from "../../../app/images/search.png";
import Icon from "antd/lib/icon";


const BuyFormContainer = styled.div`
    width: 100%;
    min-width: 320px;
    max-width: 550px;
    background-color: #383F45;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    border: 3px solid #4D5454;
    border-radius: 10px;
    color: #8C9293;
    position: relative;
    z-index: 2;
`;

const BuyFormHeader = styled.div`
    border-bottom: 3px solid #FF00CD;
    background-color: #2A3238;
    color: #D2D8DB;
    font-size: 36px;
    text-align: center;
    border-radius: 8px 8px 0 0;
`;

const BuyFormSlider = styled.div`
    width: 90%;
    margin: 20px 5%;
`;

const SelectedCountryIcon = styled.img`
    width: 80px;
`;

const BuyButton = styled.div`
    background-image: url(${actionButtonImage});
    background-position: center center;
    text-align: center;
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    cursor: pointer;
    color: white;
    width: 170px;
    font-size: 26px;
    margin-top: 10px;
`;

const ShowButton = styled.div`
    clip-path: polygon(1% 28%, 8% 9%, 21% 1%, 85% 1%, 96% 9%, 100% 20%, 100% 88%, 85% 100%, 13% 100%, 0% 86%);
    -webkit-clip-path: polygon(1% 28%, 8% 9%, 21% 1%, 85% 1%, 96% 9%, 100% 20%, 100% 88%, 85% 100%, 13% 100%, 0% 86%);
    background-color: black;
    position: relative;
    height: 36px;
    cursor: pointer;
    width: 120px;
    margin: 10px auto;
    
    &:after {
        clip-path: polygon(1% 28%, 8% 9%, 21% 1%, 85% 1%, 96% 9%, 100% 20%, 100% 88%, 85% 100%, 13% 100%, 0% 86%);
        -webkit-clip-path: polygon(1% 28%, 8% 9%, 21% 1%, 85% 1%, 96% 9%, 100% 20%, 100% 88%, 85% 100%, 13% 100%, 0% 86%);
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        content: "${props => props.content || ""}";
        background-color: #2A3238;
        padding: 2px;
        top: 2px;
        left: 2px;
        right: 2px;
        bottom: 2px;
        color: #8C9293;
        font-size: 18px;
    }
`;


const Col = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
`;

const SliderWithTooltip = createSliderWithTooltip(Slider);

const SliderMark = styled.div`
    color: #8C9293;
    font-size: 16;
    font-weight: bold;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
`;

const BuyInfo = styled.div`
    font-size: 12px;
    color: white;
`;

function log(value) {
    console.log(value); //eslint-disable-line
}

class BuyForm extends Component {

    state = {processBuy: false};

    render() {
        const {
            countryData, handleClick, selectHoveredId, mapIsShown, toggleMap, handleBuy,
            searchCountry, searchCountryValue, selectedCountry, numberOfPlots, setNumberOfPlots
        } = this.props;

        return (
          <BuyFormContainer>
              <BuyFormHeader>
                  Buy Plots of Land
              </BuyFormHeader>
              <BuyFormSlider>
                  <SliderWithTooltip
                    tipProps={{overlayClassName: 'foo'}}
                    onChange={(value) => {
                        setNumberOfPlots(value);
                        toggleMap();
                    }}
                    min={1}
                    max={40}
                    defaultValue={20}
                    trackStyle={{
                        backgroundColor: "#8C9293",
                        height: 4
                    }}
                    railStyle={{
                        backgroundColor: "#8C9293",
                        height: 4
                    }}
                    marks={{
                        1: <SliderMark>1</SliderMark>,
                        15: <SliderMark>10</SliderMark>,
                        30: <SliderMark>20</SliderMark>,
                        45: <SliderMark>30</SliderMark>,
                        60: <SliderMark>40</SliderMark>,
                    }}
                    handleStyle={{
                        backgroundColor: "magenta",
                        border: "3px solid #8C9293"
                    }}
                    dotStyle={{
                        width: "3px",
                        height: "10px",
                        backgroundColor: "#8C9293",
                        border: "0px solid #8C9293",
                        borderRadius: "0"
                    }}
                  />
              </BuyFormSlider>
              <div>
                  <div style={{textAlign: "center"}}><span
                    style={{color: "white", fontSize: "22px"}}>{numberOfPlots}</span> Plots of
                      Land
                  </div>
                  <div style={{textAlign: "center"}}><span
                    style={{
                        color: "white",
                        fontSize: "20px"
                    }}>{(numberOfPlots * 0.02).toFixed(2)}</span> ETH <span
                    style={{fontSize: "12px"}}>(0.02 per plot)</span>
                  </div>
              </div>
              <div style={{display: "flex"}}>
                  <Col style={{flex: 1}}>{selectedCountry.imageLinkMedium &&
                  <SelectedCountryIcon src={selectedCountry.imageLinkMedium}/>}</Col>
                  <Col style={{flex: 2}}>
                      {(!this.state.processBuy && countryData && countryData.length > 0) ?
                        <BuyButton onClick={() => {
                            this.setState({processBuy: true});
                            handleBuy(() => {
                                this.setState({processBuy: false})
                            });
                        }}>Buy Now</BuyButton> : (
                          <div className="flex x h3 w-100">
                              <Icon type="loading" theme="outlined"/>
                          </div>
                        )}
                      {
                          selectedCountry.availablePlots ?
                            numberOfPlots <= selectedCountry.availablePlots ?
                              <BuyInfo>Buy {numberOfPlots} plots in {selectedCountry.name}</BuyInfo>
                              :
                              <BuyInfo>{`Buy ${selectedCountry.availablePlots} plots in ${selectedCountry.name} ` +
                              `and ${(numberOfPlots - selectedCountry.availablePlots)} plots in random country`}</BuyInfo>
                            : <BuyInfo>Buy {numberOfPlots} plots in random country</BuyInfo>
                      }
                  </Col>
                  <Col style={{flex: 1}}>{selectedCountry.imageLinkMedium &&
                  <SelectedCountryIcon src={selectedCountry.imageLinkMedium}/>}</Col>
              </div>
              {mapIsShown &&
              <>
                  <ShowButton content={"Hide Map"} onClick={() => toggleMap()}/>
                  <CountryList countries={countryData}
                               selectCountry={(country) => {
                                   handleClick(country);
                               }}
                               selectedCountry={selectedCountry}
                               selectHoveredId={selectHoveredId}
                               searchCountry={searchCountry}
                               searchCountryValue={searchCountryValue}
                               numberOfPlots={numberOfPlots}
                  />
              </>
              }
          </BuyFormContainer>
        )
    }
}

export default BuyForm;

const CountriesTable = styled.div`
    display: flex;
    flex-wrap: wrap;
    height: 110px;
    overflow-y: auto;
    background-color: #24292F;
    padding: 5px;
    align-content: flex-start;
    align-items: flex-start;
    
`;

const CountryInfo = styled.div`
    width: 250px;
    text-align: right;
`;

const CountryFilter = styled.div`
    margin: 5px 10px;
    border-bottom: 10px solid #24292F;
    clip-path: polygon(0% 8%,1% 2%,3% 0%,97% 0%,99% 2%,100% 8%,100% 90%,98% 100%,2% 100%,0% 90%);
    -webkit-clip-path: polygon(0% 8%,1% 2%,3% 0%,97% 0%,99% 2%,100% 8%,100% 90%,98% 100%,2% 100%,0% 90%);
`;

const CountryLine = styled.div`
    width: calc(25% - 3px);
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

const CountryList = ({countries, selectedCountry, selectCountry, selectHoveredId, searchCountry, searchCountryValue, numberOfPlots}) => {

    return (
      <CountryFilter>
          <CountryTableHeader>
              <CountrySearch selectedCountry={selectedCountry} searchCountry={searchCountry}
                             searchValue={searchCountryValue}/>
              {selectedCountry &&
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
              }
          </CountryTableHeader>
          <CountriesTable>
              {countries && countries.map(country => (
                <CountryLine key={country.mapIndex}
                             selected={selectedCountry && country.name === selectedCountry.name}
                             onClick={() => selectCountry(country)}
                             onMouseEnter={() => selectHoveredId(country.countryId)}
                             onMouseLeave={() => selectHoveredId(9999)}>
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