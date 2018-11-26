import React from 'react';
import PropTypes from 'prop-types';
import Particles from 'react-particles-js';
import { formatDistance } from 'date-fns';

const particleParameters = {
  particles: {
    number: {
      value: 2,
      density: {
        enable: true,
        value_area: 800,
      },
    },
    line_linked: {
      enable: false,
    },
    move: {
      enable: false,
      speed: 1,
      out_mode: 'out',
    },
    shape: {
      type: 'images',
      images: [
        {
          src: '/tinyGems/Age.png',
          height: 5,
          width: 5,
        },

        {
          src: '/tinyGems/Energy.png',
          height: 5,
          width: 5,
        },
        {
          src: '/tinyGems/Grade.png',
          height: 5,
          width: 5,
        },
        {
          src: '/tinyGems/MRB.png',
          height: 5,
          width: 5,
        },
      ],
    },
    size: {
      value: 10,
      random: false,
      anim: {
        enable: true,
        speed: 4,
        size_min: 10,
        sync: false,
      },
    },
  },
  retina_detect: true,
};

const CountryDetails = ({
  name,
  lastBought,
  totalPlots,
  plotsBought,
  plotsMined,
  plotsAvailable,
  image,
  lastPrice,
  roi,
}) => (
  <>
    <Particles
      style={{
        width: '100%',
        position: 'absolute',
        opacity: 0.5,
      }}
      params={particleParameters}
    />
    <div className="flex mv5 mw8 center pa3 row-ns flex-column-reverse z-1 relative white">
      <div className="w-50-ns w-100">
        <h1 className="white f1 b">{name}</h1>

        <small className="pb3">
          Owned for
          {` ${formatDistance(new Date(lastBought), new Date())}`}
        </small>

        <div className="flex aie jcb white">
          <div className="">
            <dd className="f6 f5-ns b ml0">Price Paid</dd>
            <dd className="f3 f2-ns b ml0 w-100">{lastPrice && lastPrice.toFixed(3)}</dd>
          </div>
          <div className="">
            <dd className="f6 f5-ns b ml0">Plots Remaining</dd>
            <dd className="f3 f2-ns b ml0 w-100">{totalPlots && totalPlots.toFixed(3)}</dd>
          </div>
          <div className="">
            <dd className="f6 f5-ns b ml0">Return on Investment</dd>
            <dd className="f3 f2-ns b ml0 w-100">{roi && roi.toFixed(3)}</dd>
          </div>
        </div>

        <dl className="w-100">
          <h3 className="white">DETAILS</h3>
          <span className="flex">
            <dt>Total Plots</dt>
            <dd className="pl2">{totalPlots}</dd>
          </span>
          <span className="flex">
            <dt>Plots Sold</dt>
            <dd className="pl2">{plotsBought}</dd>
          </span>
          <span className="flex">
            <dt>Plots Mined</dt>
            <dd className="pl2">{plotsMined}</dd>
          </span>

          <span className="flex">
            <dt>Plots Available for Auction</dt>
            <dd className="pl2">{plotsAvailable}</dd>
          </span>
        </dl>
      </div>
      <div className="w-50-ns w-100 tc flex aic ml3-ns">
        <img src={image} alt={name} className="w-100 h-auto center grow" />
      </div>
    </div>
  </>
);

export default CountryDetails;

CountryDetails.propTypes = {
  name: PropTypes.string.isRequired,
  lastBought: PropTypes.number.isRequired,
  totalPlots: PropTypes.number.isRequired,
  plotsBought: PropTypes.number.isRequired,
  plotsMined: PropTypes.number.isRequired,
  plotsAvailable: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  lastPrice: PropTypes.number.isRequired,
  roi: PropTypes.number.isRequired,
};
