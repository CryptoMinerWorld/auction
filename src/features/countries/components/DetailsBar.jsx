import React from 'react';
import PropTypes from 'prop-types';

const DetailsBar = ({ details }) => (
  <article className="pa3 pt4 tr bg-dark-gray white" data-name="slab-stat">
    <dl className="dib mr5">
      <dd className="f6 f5-ns b ml0" data-testid="countryDetails">{details.country}</dd>
    </dl>
    <dl className="dib mr5">
      <dd className="f6 f5-ns b ml0">Price</dd>
      <dd className="f3 f2-ns b ml0" data-testid="priceDetails">{details.price}</dd>
    </dl>
    <dl className="dib mr5">
      <dd className="f6 f5-ns b ml0">Plots</dd>
      <dd className="f3 f2-ns b ml0" data-testid="plotsDetails">{details.plots}</dd>
    </dl>
    <dl className="dib mr5">
      <dd className="f6 f5-ns b ml0">ROI</dd>
      <dd className="f3 f2-ns b ml0" data-testid="roiDetails">{details.roi}</dd>
    </dl>
  </article>
);

export default DetailsBar;

DetailsBar.propTypes = {
  details: PropTypes.shape({
    name: PropTypes.string.isRequired,
    price: PropTypes.number,
    plots: PropTypes.number,
    roi: PropTypes.number,
  }).isRequired,
};
