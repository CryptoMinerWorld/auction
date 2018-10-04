import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { ReactComponent as Gem } from '../../../app/images/dashboard/gems.svg';
import { ReactComponent as Artifact } from '../../../app/images/dashboard/artifacts.svg';
import { ReactComponent as Keys } from '../../../app/images/dashboard/keys.svg';
import { ReactComponent as Land } from '../../../app/images/dashboard/land.svg';

const AuctionCategories = ({ gemCount }) => (
  <div className="flex jca pa2 mb4 bg-dark-gray br2">
    <div className="flex aic w-auto">
      <Gem />
      <p className="pl3 mt2 f5">{`${gemCount || 'NO'} GEMS`} </p>
    </div>

    <div className="flex aic w-auto">
      <Artifact />
      <p className="pl3 mt2 f5">NO ARTIFACTS</p>
    </div>

    <div className="flex aic w-auto">
      <Gem /> <p className="pl3 mt2 f5">NO GOLD</p>
    </div>

    <div className="flex aic w-auto">
      <Gem /> <p className="pl3 mt2 f5">NO SILVER</p>
    </div>

    <div className="flex aic w-auto">
      <Keys /> <p className="pl3 mt2 f5">NO KEYS</p>
    </div>

    <div className="flex aic w-auto">
      <Land /> <p className="pl3 mt2 f5">NO LAND</p>
    </div>
  </div>
);

export default AuctionCategories;
