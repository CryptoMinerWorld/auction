import React from 'react';
import PropTypes from 'prop-types';
import Progress from 'antd/lib/progress';

const DetailsBar = ({ details }) => (
  <div className="w-100">
    <Progress
      strokeLinecap="square"
      percent={100}
      status="active"
      strokeColor="#be007d"
      showInfo={false}
      className="relative"
    />
    <article
      className="pa3 pt4 tr bg-dark-gray white shadow-1 w-100 flex jce"
      data-name="slab-stat"
    >
      <div className="mw9 flex jce w-100 aic row-ns col w-100 w-50-ns">
        <div className="tc">
          <dl className="dib mr5-ns">
            <dd className="f6 f5-ns b ml0 w4 tc" data-testid="countryDetails">
              {details.name}
            </dd>
          </dl>
        </div>
        <div className="flex jcb tc w-100">
          <dl className="dib mr5-ns w-33">
            <dd className="f6 f5-ns b ml0 w-100">Price</dd>
            <dd className="f3 f2-ns b ml0 w4 tc" data-testid="priceDetails">
              <span className="basic b pr2">Ξ</span>
              {details.price && details.price.toFixed(2)}
            </dd>
          </dl>
          <dl className="dib mr5-ns w-33">
            <dd className="f6 f5-ns b ml0">Plots</dd>
            <dd className="f3 f2-ns b ml0 w4 tc" data-testid="plotsDetails">
              {details.plots}
            </dd>
          </dl>
          <dl className="dib mr5-ns w-33">
            <dd className="f6 f5-ns b ml0">Earns</dd>
            <dd className="f3 f2-ns b ml0  tc" style={{ width: '4em' }} data-testid="roiDetails">
              <span className="basic b pr2">Ξ</span>
              {details.roi && details.roi.toFixed(2)}
            </dd>
          </dl>
        </div>
      </div>
    </article>
  </div>
);
export default DetailsBar;

DetailsBar.propTypes = {
  details: PropTypes.shape({
    name: PropTypes.string,
    price: PropTypes.number,
    plots: PropTypes.number,
    roi: PropTypes.number,
  }).isRequired,
  // cart: PropTypes.arrayOf(
  //   PropTypes.shape({
  //     name: PropTypes.string,
  //     plots: PropTypes.number,
  //     price: PropTypes.number,
  //     roi: PropTypes.number,
  //     countryId: PropTypes.number,
  //   }),
  // ),
};
