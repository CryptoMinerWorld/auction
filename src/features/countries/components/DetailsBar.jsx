import React from 'react';
import PropTypes from 'prop-types';
import Progress from 'antd/lib/progress';

const DetailsBar = ({ details }) => (
  <>
    <Progress
      strokeLinecap="square"
      percent={100}
      status="active"
      strokeColor="#be007d"
      showInfo={false}
      className="top-1 relative"
    />
    <article className="pa3 pt4 tr bg-dark-gray white shadow-1" data-name="slab-stat">
      <div className="mw9 center flex jce w-100 aic row-ns col">
        <div className="tc">
          <dl className="dib mr5-ns">
            <dd className="f6 f5-ns b ml0" data-testid="countryDetails">
              {details.name}
            </dd>
          </dl>
        </div>
        <div className="flex jcb tc">
          <dl className="dib mr5-ns ">
            <dd className="f6 f5-ns b ml0 ">Price</dd>
            <dd className="f3 f2-ns b ml0" data-testid="priceDetails">
              {details.price && details.price.toFixed(2)}
            </dd>
          </dl>
          <dl className="dib mr5-ns">
            <dd className="f6 f5-ns b ml0">Plots</dd>
            <dd className="f3 f2-ns b ml0 " data-testid="plotsDetails">
              {details.plots}
            </dd>
          </dl>
          <dl className="dib mr5-ns">
            <dd className="f6 f5-ns b ml0">ROI %</dd>
            <dd className="f3 f2-ns b ml0" data-testid="roiDetails">
              {details.roi && details.roi.toFixed(3)}
            </dd>
          </dl>
        </div>
      </div>
    </article>
  </>
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
