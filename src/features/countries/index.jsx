import React from 'react';

import Map from './components/Map';
import Cart from './components/Cart';
import Filter from './components/Filter';

const CountryAuction = () => (
  <div>
    <div className="flex">
      <div className="w-third pa3"><Filter /></div>
      <div className="w-two-thirds pa3"><Map /></div>
    </div>

    <Cart />

  </div>
);

export default CountryAuction;
