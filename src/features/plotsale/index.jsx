import React, {Component, useEffect, useState} from 'react';
// import PropTypes from 'prop-types';
import Icon from 'antd/lib/icon';
import Cart from './components/Cart';
import Filter from './components/Filter';
import {rtdb} from '../../app/utils/firebase';
import Map from './components/Map';
import geoData from '../../app/maps/world-50m-with-population.json';
import MapPageDetails from './components/MapPageDetails';
// import countryDatum from './components/countryData';
import {checkIfCountryIsForSale} from './helpers';
import {compose, lifecycle} from "recompose";
import {withRouter} from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import windowSize from "react-window-size";
import ChestsBar from "./components/ChestsBar";
import BuyForm from "./components/BuyForm";

const select = store => ({
    countryService: store.app.countryServiceInstance
});

class PlotSale extends Component {

    state = {
        countryData: [],
        zoom : 1,
        coordinates: [0, 20],
        countryBeingHoveredOnInFilter: 9999,
        selection: {
            name: 'Select a Country',
            plots: 0,
            price: 0,
            roi: 0,
            countryId: '',
        },
        cart: []
    }

    componentDidMount() {
        const { countryService } = this.props;
        if (!countryService) { console.log('No service')}
        if (countryService) {
            this.rtdbListen();
        }
    }

    componentDidUpdate(prevProps) {
        const { countryService } = this.props;
        if (!countryService) { console.log('No service')}
        if (countryService !== prevProps.countryService) {
            this.rtdbListen();
        }
        console.log("Getting country data");
    }

    rtdbListen = () => {
        rtdb.ref('/worldMap').on('value', async snap => {
            console.log('COUNTRY SNAP:::', snap.val());
            const tokenMapString = await this.props.countryService.getTokenSoldMap();
            console.log('TOKEN MAP STRING:::', tokenMapString);
            const countryDataSnap = snap.val();
            countryDataSnap.objects.units.geometries.forEach((country) => {
                if (country.properties.countryId !== 200)
                    country.properties.sold = tokenMapString.charAt(192 - country.properties.countryId) !== '0';
            });

            snap && this.setState({countryData: countryDataSnap});
        });
        //rtdb.ref('/worldMap').off();
    }

    handleCityClick = (city) => {
        this.setState({
            zoom: 2,
            coordinates: [city.east, city.north]
        });
    };

    handleReset = () => () => {
        this.setState({
            zoom: 1,
            coordinates: [0, 20]
        });
    };

    render() {

        const { countryData, zoom, coordinates, countryBeingHoveredOnInFilter, selection, cart } = this.state;

        console.log("Country data:", countryData);

        return (
          <div data-testid="mapPage" className="bg-off-black white w-100">
              <div className="flex w-100 col-reverse row-ns mw9 center">
                  <div className="w-40-ns w-100 db dib-ns pa3">
                      <BuyForm/>
                  </div>
                  <div className="w-60-ns w-100">
                      <div className="w-100 pa3">
                          {countryData && Object.keys(countryData).length > 0 ? (
                            <Map
                              data={{
                                  ...geoData,
                                  ...countryData,
                              }}
                              setSelection={()=>{}}
                              addToCart={()=>{}}
                              zoom={zoom}
                              coordinates={coordinates}
                              handleReset={this.handleReset}
                              countryBeingHoveredOnInFilter={countryBeingHoveredOnInFilter}
                              cart={cart}
                              removeFromCart={()=>{}}
                            />
                          ) : (
                            <div className="flex x h5 w-100">
                                <Icon type="loading" theme="outlined"/>
                            </div>
                          )}
                      </div>
                  </div>
              </div>
              <ChestsBar/>
          </div>
        );
    }
}

export default compose(
  withRouter,
  connect(
    select,
    {},
  ),
)(PlotSale);


