import React, {Component} from 'react';
// import PropTypes from 'prop-types';
import Icon from 'antd/lib/icon';
import {db, rtdb} from '../../app/utils/firebase';
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
import {buyPlots, getAvailableCountryPlots, getChestValues} from "./plotSaleActions";
import {getChestValue} from "../sale/saleActions";
import plot1 from '../../app/images/plots/1plot.png';
import plot2 from '../../app/images/plots/2-15_Plot.png';
import plot16 from '../../app/images/plots/16-30_Plot.png';
import plot31 from '../../app/images/plots/31-45_Plot.png';
import plot46 from '../../app/images/plots/46-60_Plot.png';
import rockBackground from '../../app/images/rockBackground.png';

const select = store => ({
    countryService: store.app.countryServiceInstance,
    worldChestValue: store.plotSale.worldChestValue,
    monthlyChestValue: store.plotSale.monthlyChestValue,
    web3: store.app.web3,
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
        const {countryService, handleGetChestValues, web3} = this.props;
        if (!countryService) {
            console.log('No service')
        }
        if (countryService) {
            this.rtdbListen();
        }
        if (web3) {
            handleGetChestValues();
        }
    }

    async componentDidUpdate(prevProps) {
        const {countryService, handleGetChestValues, web3} = this.props;
        if (!countryService) {
            console.log('No service')
        }
        if (countryService !== prevProps.countryService) {
            this.rtdbListen();
        }
        if (web3 !== prevProps.web3) {
            handleGetChestValues();
        }
    }

    rtdbListen = () => {
        const countriesMapping = {};
        rtdb.ref('/worldMap').on('value', async snap => {

            // snap && snap.val().objects.units.geometries
            //       .filter(country => country.properties.countryId !== 200)
            //       .forEach(async country => {
            //           const props = country.properties;
            //           const data = (await db.collection('countries').where('countryId', '==',
            //             Number(props.countryId)).get());
            //           if (!data.docs[0]) {
            //               await db.collection('countries').doc(props['name']).set({
            //                   countryId: props['countryId'],
            //                   imageLinkLarge: props['imageLinkLarge'],
            //                   imageLinkMedium: props['imageLinkMedium'],
            //                   imageLinkSmall: props['imageLinkSmall'],
            //                   mapIndex: props['mapIndex'],
            //                   onSale: false,
            //                   name: props['name'],
            //                   id: props['name']
            //               })
            //           }
            //       })
                  //country.properties)
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

    getPlotImage = () => {
        if (this.state.numberOfPlots < 2) return plot1;
        if (this.state.numberOfPlots < 16) return plot2;
        if (this.state.numberOfPlots < 31) return plot16;
        if (this.state.numberOfPlots < 46) return plot31;
        return plot46;
    }

    render() {

        const {countryData, zoom, coordinates, countryIdHovered, selection, cart, mapIsShown, searchCountryValue, countryList, searchCountryList, numberOfPlots} = this.state;
        const {getAvailableCountryPlots, handleBuy, worldChestValue, monthlyChestValue} = this.props;

        return (
          <div data-testid="mapPage" className="plot-sale bg-off-black white w-100" style={{
              backgroundImage: 'url('+rockBackground+')',
              backgroundRepeat: 'repeat',
              backgroundSize: 'contain',
          }}>
              <div className="flex ais w-100 col-reverse row-ns mw9 center"
                   style={{padding: "25px 10px 15px", minHeight: "601px"}}>
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
                                   this.setState({mapIsShown: false})
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
                      <PlotImages>
                          <PlotImage src={plot1} visible={numberOfPlots === 1}/>
                          <PlotImage src={plot2} visible={numberOfPlots >= 2 && numberOfPlots < 16}/>
                          <PlotImage src={plot16} visible={numberOfPlots >= 16 && numberOfPlots < 31}/>
                          <PlotImage src={plot31} visible={numberOfPlots >= 31 && numberOfPlots < 46}/>
                          <PlotImage src={plot46} visible={numberOfPlots >= 46}/>
                      </PlotImages>
                          {mapIsShown &&
                      <MapContainer className="pa3">
                          {countryData && Object.keys(countryData).length > 0 ? (
                            <Map
                              data={{
                                  ...geoData,
                                  ...countryData,
                              }}
                              setSelection={() => {
                              }}
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
                      </MapContainer>
                      }
                  </MapArea>
              </div>
              <ChestsBar worldChestValue={worldChestValue} monthlyChestValue={monthlyChestValue}/>
          </div>
        );
    }
}

const actions = {
    getAvailableCountryPlots: getAvailableCountryPlots,
    handleBuy: buyPlots,
    handleGetChestValues: getChestValues,
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
    position: relative;
`;

const MapContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    clip-path: polygon(0% 50%, 11% 8%, 22% 0%, 78% 0%, 89% 8%, 100% 50%, 89% 92%, 78% 100%, 22% 100%, 11% 92%);
    -webkit-clip-path: polygon(0% 50%, 11% 8%, 22% 0%, 78% 0%, 89% 8%, 100% 50%, 89% 92%, 78% 100%, 22% 100%, 11% 92%);
`;

const PlotImage = styled.img `
    position: absolute;
    top:0;
    opacity: ${props => props.visible ? "1" : "0"};
`;

const PlotImages = styled.div`
    width: 100%;
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