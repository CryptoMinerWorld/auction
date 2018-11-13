import React, {
  useState,
  useEffect,
} from 'react';
// import PropTypes from 'prop-types';
import Cart from './components/Cart';
import Filter from './components/Filter';
import { rtdb } from '../../app/utils/firebase';
import Map from './components/Map';
import geoData from '../../app/maps/world-50m-with-population.json';
import DetailsBar from './components/DetailsBar';

const CountryAuction = () => {
  const [countryData, setCountryData] = useState(null);

  useEffect(
    () => rtdb.ref('/worldMap').on('value', snap => snap && setCountryData(snap.val())),
    [],
  );

  const markSold = countryId => rtdb.ref(`/worldMap/objects/units/geometries/${countryId}/properties`).update({ sold: true });

  const [selection, setSelection] = useState({
    country: 'UK',
    plots: 50,
    price: 10,
    roi: 5,
    countryId: 23,
  });

  const [cart, setCart] = useState([]);

  const addToCart = item => setCart([...cart, item]);

  const removeFromCart = selected =>
    // eslint-disable-next-line
    setCart(cart.filter(item => item.country !== selected.country));

  const [zoom, setZoom] = useState(1);
  const [coordinates, setCoordinates] = useState([0, 20]);

  // const handleZoomIn = () => () => setZoom(zoom * 2);
  // const handleZoomOut = () => () => setZoom(zoom / 2);

  const handleCityClick = (city) => {
    setZoom(2);
    setCoordinates([city.east, city.north]);
  };

  const handleReset = () => () => {
    setZoom(1);
    setCoordinates([0, 20]);
  };

  console.log('cart', cart);

  return (
    <div data-testid="mapPage">
      <div className="flex">
        <div className="w-third pa3">
          <Filter
            addToCart={addToCart}
            setSelection={setSelection}
            handleCityClick={handleCityClick}
          />
        </div>
        <div className="w-two-thirds pa3">
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
              />
            )}
          </div>
        </div>
      </div>
      <DetailsBar details={selection} />
      <Cart picked={cart} removeFromCart={removeFromCart} markSold={markSold} />
    </div>
  );
};


export default CountryAuction;

// CountryAuction.propTypes = {
//   countryFilterData: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
// };
