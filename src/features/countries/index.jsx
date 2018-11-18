import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import Cart from './components/Cart';
import Filter from './components/Filter';
import { rtdb } from '../../app/utils/firebase';
import Map from './components/Map';
import geoData from '../../app/maps/world-50m-with-population.json';
import DetailsBar from './components/DetailsBar';
import MapPageDetails from './components/MapPageDetails';
// import countryDatum from './components/countryData';

const CountryAuction = () => {
  const [countryData, setCountryData] = useState();
  useEffect(() => {
    rtdb.ref('/worldMap').on('value', snap => snap && setCountryData(snap.val()));

    return () => {
      rtdb.ref('/worldMap').off();
      console.log('unmounting...');
    };
  }, []);

  // eslint-disable-next-line
  const markSold = countryId => rtdb.ref(`/worldMap/objects/units/geometries/${countryId}/properties`).update({ sold: true });

  // eslint-disable-next-line
  // const markSold = countryId => console.log('countryId sold', countryId);

  const [selection, setSelection] = useState({
    name: 'Hover on a Country',
    plots: 0,
    price: 0,
    roi: 0,
    countryId: '',
  });
  const [countryBeingHoveredOnInFilter, setHoverCountry] = useState();

  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    if (!cart.includes(item)) {
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
    <div data-testid="mapPage" className="bg-off-black white">
      <div className="flex w-100 col row-ns mw9 center ">
        <div className="w-40-ns w-100 db dib-ns pa3">
          <Filter
            addToCart={addToCart}
            setSelection={setSelection}
            handleCityClick={handleCityClick}
            countryData={
              countryData
              && countryData.objects.units.geometries
                .filter(country => country.properties.countryId !== 200)
                .map(country => country.properties)
              // : geoData.objects.units.geometries
              //   .filter(country => country.properties.countryId !== 200)
              //   .map(country => country.properties)
            }
            setHoverCountry={setHoverCountry}
          />
        </div>
        <div className="w-60-ns w-100">
          <div className="w-100 pa3">
            {countryData ? (
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
              />
            ) : (
              <Map
                data={geoData}
                setSelection={setSelection}
                addToCart={addToCart}
                zoom={zoom}
                coordinates={coordinates}
                handleCityClick={handleCityClick}
                handleReset={handleReset}
                countryBeingHoveredOnInFilter={countryBeingHoveredOnInFilter}
              />
            )}
          </div>
        </div>
      </div>

      <DetailsBar details={selection} cart={cart} />
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

export default CountryAuction;

// CountryAuction.propTypes = {
//   countryFilterData: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
// };
