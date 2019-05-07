import React, {Component} from 'react';
// import PropTypes from 'prop-types';
import Icon from 'antd/lib/icon';
import {rtdb} from '../../app/utils/firebase';
import Map from './components/Map';
import geoData from '../../app/maps/world-50m-with-population.json';
// import countryDatum from './components/countryData';
import {compose} from "recompose";
import {withRouter} from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import ChestsBar from "./components/ChestsBar";
import BuyForm from "./components/BuyForm";
import arrowDownActive from "../../app/images/arrowDownActive.png";
import styled from "styled-components";
import {buyPlots, getAvailableCountryPlots} from "./plotSaleActions";

const select = store => ({
    countryService: store.app.countryServiceInstance
});

class PlotSale extends Component {

    state = {
        countryData: [],
        countryList: [],
        searchCountryList: [],
        zoom: 1,
        coordinates: [0, 20],
        countryIdHovered: 9999,
        selection: {
            name: '',
            plots: '500k',
            price: 0,
            roi: 0,
            countryId: '',
        },
        cart: [],
        mapIsShown: false,
        searchCountryValue: "",
        numberOfPlots: 30,
    }

    componentDidMount() {
        const {countryService} = this.props;
        if (!countryService) {
            console.log('No service')
        }
        if (countryService) {
            this.rtdbListen();
        }
    }

    componentDidUpdate(prevProps) {
        const {countryService} = this.props;
        if (!countryService) {
            console.log('No service')
        }
        if (countryService !== prevProps.countryService) {
            this.rtdbListen();
        }
        console.log("Getting country data");
    }

    rtdbListen = () => {
        rtdb.ref('/worldMap').on('value', async snap => {
            snap && this.setState({
                countryData: snap.val(),
                countryList: snap.val().objects.units.geometries
                  .filter(country => country.properties.countryId !== 200)
                  .map(country => country.properties)
            }, () => {
                this.setState({searchCountryList: this.state.countryList})
            });
        });
        //rtdb.ref('/worldMap').off();
    }

    handleCityClick = (country) => {
        this.setState({
            zoom: 2,
            coordinates: [country.east, country.north]
        });
    };

    handleReset = () => () => {
        this.setState({
            zoom: 1,
            coordinates: [0, 20]
        });
    };

    render() {

        const {countryData, zoom, coordinates, countryIdHovered, selection, cart, mapIsShown, searchCountryValue, countryList, searchCountryList, numberOfPlots} = this.state;
        const {getAvailableCountryPlots, handleBuy} = this.props;

        console.log("Country data: ", countryData);

        console.log("Country hovered: ", countryIdHovered);

        return (
          <div data-testid="mapPage" className="plot-sale bg-off-black white w-100">
              <div className="flex w-100 col-reverse row-ns mw9 center">
                  <BuyFormContainer>
                      <BuyForm countryData={searchCountryList}
                               handleClick={(country) => {
                                   this.handleCityClick(country);
                                   this.setState({selection: country}, async () => {
                                       country.availablePlots = await getAvailableCountryPlots(country.countryId);
                                       this.setState({selection: country});
                                   });
                               }}
                               selectHoveredId={(countryId) => {
                                   this.setState({countryIdHovered: countryId})
                               }}
                               mapIsShown={mapIsShown}
                               toggleMap={() => {
                                   this.setState({mapIsShown: !mapIsShown})
                               }}
                               selectedCountry={this.state.selection}
                               searchCountryValue={searchCountryValue}
                               searchCountry={(val) => {
                                   console.log("VAL: ", val);
                                   this.setState({
                                       searchCountryValue: val,
                                       searchCountryList: val !== "" ?
                                         countryList.filter(country => country.name.toLowerCase().startsWith(val.toLowerCase())) : countryList,
                                   })
                               }}
                               numberOfPlots={numberOfPlots}
                               setNumberOfPlots={(value) => this.setState({numberOfPlots: value})}
                               handleBuy={(callBack) => handleBuy(selection.countryId, numberOfPlots, selection.availablePlots ? Math.max(numberOfPlots - selection.availablePlots, 0) : numberOfPlots, null, callBack)}
                      />
                      {!mapIsShown &&
                      <PickLocationButton content={"Pick Plot's Location"} onClick={() => {
                          this.setState({mapIsShown: true})
                      }}>
                          <PickLocationArrow src={arrowDownActive}/>
                      </PickLocationButton>
                      }
                  </BuyFormContainer>
                  <MapArea className="w-60-ns w-100">
                      {mapIsShown &&
                      <div className="w-100 pa3">
                          {countryData && Object.keys(countryData).length > 0 ? (
                            <Map
                              data={{
                                  ...geoData,
                                  ...countryData,
                              }}
                              setSelection={()=>{}}
                              addToCart={(country) => {
                                  this.setState({selection: country}, async () => {
                                      country.availablePlots = await getAvailableCountryPlots(country.countryId);
                                      this.setState({selection: country});
                                  });
                              }}
                              zoom={zoom}
                              coordinates={coordinates}
                              handleReset={this.handleReset}
                              countryBeingHoveredOnInFilter={countryIdHovered}
                              cart={cart}
                              removeFromCart={() => {
                              }}
                            />
                          ) : (
                            <div className="flex x h5 w-100">
                                <Icon type="loading" theme="outlined"/>
                            </div>
                          )}
                      </div>
                      }
                  </MapArea>
              </div>
              <ChestsBar/>
          </div>
        );
    }
}

const actions = {
    getAvailableCountryPlots: getAvailableCountryPlots,
    handleBuy: buyPlots,
}

export default compose(
  withRouter,
  connect(
    select,
    actions,
  ),
)(PlotSale);

const PickLocationButton = styled.div`
    height: 57px;
    clip-path: polygon(0% 0%,0% 51%,15% 62%,38% 62%,38% 82%,40% 100%,57% 100%,62% 90%,62% 61%,94% 61%,100% 48%,100% 0%);
    -webkit-clip-path: polygon(0% 0%,0% 51%,15% 62%,38% 62%,38% 82%,40% 100%,57% 100%,62% 90%,62% 61%,94% 61%,100% 48%,100% 0%);
    position: absolute;
    bottom: 6px;
    left: 0;
    right: 0;
    margin: auto;
    width: 200px;
    background-color: #4d5454;
    cursor: pointer;
    
    &:after {
        clip-path: polygon(0% 0%,0% 49%,15% 60%,38% 60%,39% 90%,40% 100%,58% 100%,61% 90%,61% 58%,94% 58%,100% 48%,100% 0%);
        -webkit-clip-path: polygon(0% 0%,0% 49%,15% 60%,38% 60%,39% 90%,40% 100%,58% 100%,61% 90%,61% 58%,94% 58%,100% 48%,100% 0%);
        position: absolute;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        text-align: center;
        content: "${props => props.content || ""}";
        background-color: #383F45;
        padding: 2px;
        top: 3px;
        left: 3px;
        right: 3px;
        bottom: 3px;
        color: #8C9293;
        font-size: 16px;
    }
`;

const PickLocationArrow = styled.img`
    width: 14px;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 10;
    bottom: 10px;
`;

const MapArea = styled.div`
    @media(max-width: 800px) {
        display: none;
    }
`;

const BuyFormContainer = styled.div`
    @media(max-width: 800px) {
        width: 100%;
    }
    width: 40%;
    padding-bottom: 60px;
    display: flex;
    justify-content: center;
    position: relative;
    
`;