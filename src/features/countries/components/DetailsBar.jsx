import React from 'react';
import PropTypes from 'prop-types';

const DetailsBar = ({ details }) => (
  <article
    className="pa3 pt4 tr bg-dark-gray white"
    data-name="slab-stat"
  >
    <div className="mw9 center flex jce w-100 aic row-ns col">
      <div className="tc">
        <dl className="dib mr5-ns">
          <dd className="f6 f5-ns b ml0" data-testid="countryDetails">
            {details.name}
          </dd>
        </dl>
      </div>
      <div className="flex jcb tc">
        <dl className="dib mr5-ns">
          <dd className="f6 f5-ns b ml0">Price</dd>
          <dd className="f3 f2-ns b ml0" data-testid="priceDetails">
            {details.price}
          </dd>
        </dl>
        <dl className="dib mr5-ns">
          <dd className="f6 f5-ns b ml0">Plots</dd>
          <dd className="f3 f2-ns b ml0" data-testid="plotsDetails">
            {details.plots}
          </dd>
        </dl>
        <dl className="dib mr5-ns">
          <dd className="f6 f5-ns b ml0">ROI</dd>
          <dd className="f3 f2-ns b ml0" data-testid="roiDetails">
            {details.roi}
          </dd>
        </dl>
      </div>
    </div>
  </article>
);

export default DetailsBar;

DetailsBar.propTypes = {
  details: PropTypes.shape({
    name: PropTypes.string,
    price: PropTypes.number,
    plots: PropTypes.number,
    roi: PropTypes.number,
  }).isRequired,
};
