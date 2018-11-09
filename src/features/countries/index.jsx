import React, { useState, useEffect } from 'react';
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


  const [cart, setCart] = useState([
  ]);

  const addToCart = item => setCart([...cart, item]);

  const removeFromCart = selected => setCart(
    cart.filter(item => item.country !== selected.country),
  );

  return (
    <div data-testid="mapPage">
      <div className="flex">
        <div className="w-third pa3">
          <Filter addToCart={addToCart} setSelection={setSelection} />
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
              />
            ) : (
              <Map data={geoData} setSelection={setSelection} addToCart={addToCart} />
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
//   markSold: PropTypes.func.isRequired,
// };
