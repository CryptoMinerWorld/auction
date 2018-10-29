import React from 'react';

import Map from './components/Map';
import Cart from './components/Cart';
import Filter from './components/Filter';

const CountryAuction = () => (
  <div>
    <div>
      <Filter />
      <Map />
    </div>

    <Cart />

  </div>
);

export default CountryAuction;
