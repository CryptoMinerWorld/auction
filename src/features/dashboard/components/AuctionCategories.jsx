import React from 'react';
// import PropTypes from 'prop-types';
import Gem from '../../../app/images/dashboard/gems.png';
import Artifact from '../../../app/images/dashboard/Artifacts.png';
import Keys from '../../../app/images/dashboard/Keys.png';
import Land from '../../../app/images/dashboard/Land.png';

const AuctionCategories = ({ gemCount }) => (
  <div className="flex jca pa2 mb4 bg-dark-gray br2">
    <div className="flex aic w-auto">
      <img src={Gem} alt="" />
      <p className="pl3 mt2 f5">{`${gemCount || 'NO'} GEMS`} </p>
    </div>

    <div className="flex aic w-auto">
      <img src={Artifact} alt="" />
      <p className="pl3 mt2 f5">NO ARTIFACTS</p>
    </div>

    <div className="flex aic w-auto">
      <img src={Gem} alt="" /> <p className="pl3 mt2 f5">NO GOLD</p>
    </div>

    <div className="flex aic w-auto">
      <img src={Gem} alt="" /> <p className="pl3 mt2 f5">NO SILVER</p>
    </div>

    <div className="flex aic w-auto">
      <img src={Keys} alt="" /> <p className="pl3 mt2 f5">NO KEYS</p>
    </div>

    <div className="flex aic w-auto">
      <img src={Land} alt="" /> <p className="pl3 mt2 f5">NO LAND</p>
    </div>
  </div>
);

export default AuctionCategories;
