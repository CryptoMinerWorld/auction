import React, { useState, useEffect } from 'react';
import Cart from './components/Cart';
import Filter from './components/Filter';
import { rtdb } from '../../app/utils/firebase';
import Map from './components/Map';
import geoData from '../../app/maps/world-50m-with-population.json';

const CountryAuction = () => {
  const [countryData, setCountryData] = useState(null);
  useEffect(() => rtdb.ref('/worldMap').on('value', snap => setCountryData(snap.val())), []);
  return (
    <div data-testid="mapPage">
      <div className="flex">
        <div className="w-third pa3">
          <Filter />
        </div>
        <div className="w-two-thirds pa3">
          {countryData && <Map data={{ ...geoData, ...countryData }} />}
        </div>
      </div>
      <Cart />
    </div>
  );
};

export default CountryAuction;
