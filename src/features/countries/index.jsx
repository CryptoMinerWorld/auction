import React, { useState, useEffect } from 'react';
import {connect} from 'react-redux';
// import PropTypes from 'prop-types';
import Icon from 'antd/lib/icon';
import Cart from './components/Cart';
import Filter from './components/Filter';
import { rtdb } from '../../app/utils/firebase';
import Map from './components/Map';
import geoData from '../../app/maps/world-50m-with-population.json';
import DetailsBar from './components/DetailsBar';
import MapPageDetails from './components/MapPageDetails';
// import countryDatum from './components/countryData';
import { checkIfCountryIsForSale } from './helpers';
import styled from "styled-components";

const select = store => ({
  countryService: store.app.countryServiceInstance
});

const CountryAuction = ({countryService}) => {
  console.log('COUNTRY SERVICE:',countryService);
  const [countryData, setCountryData] = useState([]);
  useEffect(() => {
    console.log('1111');
    if (!countryService) {return }

    rtdb.ref('/worldMap').on('value', async snap => {
      console.log('COUNTRY SNAP:::', snap.val());

      const tokenMapString = await countryService.getTokenSoldMap();

      console.log('TOKEN MAP STRING:::', tokenMapString);

      const countryDataSnap = snap.val();
      countryDataSnap.objects.units.geometries.forEach((country) => {
        if (country.properties.countryId !== 200)
        country.properties.sold = tokenMapString.charAt(192 - country.properties.countryId) !== '0';
      });


//         COUNTRY SNAP:::
//         {…}
// ​          objects: {…}
// ​​             units: {…}
// ​​                geometries: (241) […]
//     ​​​​                 [0…99]
//     ​​​​​                    0: {…}
// ​​​​​​                             arcs: Array [ (1) […] ]
//     ​​​​​​                         properties: {…}



      snap && setCountryData(countryDataSnap)
    });
    return () => rtdb.ref('/worldMap').off();
  }, [countryService]);

  // eslint-disable-next-line
  const markSold = countryId => rtdb.ref(`/worldMap/objects/units/geometries/${countryId}/properties`).update({ sold: true });

  const [selection, setSelection] = useState({
    name: 'Select a Country',
    plots: 0,
    price: 0,
    roi: 0,
    countryId: '',
  });

  const [countryBeingHoveredOnInFilter, setHoverCountry] = useState(9999);
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    checkIfCountryIsForSale(item && item.countryId);
    if (
      !cart.some(country => country.name === item.name)
      && (item.countryId < 171 || item.countryId > 190)
    ) {
      setCart([...cart, item]);
    }
  };

  const removeFromCart = selected =>
    // eslint-disable-next-line
    setCart(cart.filter(item => item.countryId !== selected.countryId));

  const [zoom, setZoom] = useState(1);
  const [coordinates, setCoordinates] = useState([0, 20]);

  const handleCityClick = (city) => {
    setZoom(2);
    setCoordinates([city.east, city.north]);
  };

  const handleReset = () => () => {
    setZoom(1);
    setCoordinates([0, 20]);
  };

  return (
    <div data-testid="mapPage" className="bg-off-black white w-100">
      <div className="flex w-100 col-reverse row-ns mw9 center">
        <div className="w-40-ns w-100 db dib-ns pa3">
          <Filter
            addToCart={addToCart}
            setSelection={setSelection}
            handleCityClick={handleCityClick}
            countryData={
              countryData
              && countryData.objects
              && countryData.objects.units
              && countryData.objects.units.geometries
              && countryData.objects.units.geometries
                .filter(country => country.properties.countryId !== 200)
                .map(country => country.properties)
            }
            setHoverCountry={setHoverCountry}
          />
        </div>
        <div className="w-60-ns w-100">
          <div className="w-100 pa3">
            {countryData && Object.keys(countryData).length > 0 ? (
              <Map
                data={{
                  ...geoData,
                  ...countryData,
                }}
                setSelection={setSelection}
                addToCart={addToCart}
                zoom={zoom}
                coordinates={coordinates}
                handleReset={handleReset}
                countryBeingHoveredOnInFilter={countryBeingHoveredOnInFilter}
                cart={cart}
                removeFromCart={removeFromCart}
              />
            ) : (
              <div className="flex x h5 w-100">
                <Icon type="loading" theme="outlined" />
              </div>
            )}
          </div>
        </div>
      </div>

      <DetailsBar details={selection} />
      <Cart
        picked={cart}
        removeFromCart={removeFromCart}
        markSold={markSold}
        price={selection && selection.price}
      />
      <MapPageDetails />
    </div>
  );
};

export default connect(select)(CountryAuction);

// CountryAuction.propTypes = {
//   countryFilterData: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
// };
