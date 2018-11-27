import React from 'react';
import PropTypes from 'prop-types';
import { formatDistance } from 'date-fns';
import ImageLoader from 'react-loading-image';
import Loading from '../../../../components/Loading';

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
    <div className="flex mv5 mw8 center pa3 row-ns flex-column-reverse  white">
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
            <dd className="f3 f2-ns b ml0 w-100">{totalPlots && totalPlots}</dd>
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
      <div className="w-50-ns w-100 tc ml3-ns flex ais jcc ">
        <ImageLoader
          src={image}
          className="grow w-auto h-75"
          loading={() => <Loading />}
          error={() => <div>Error</div>}
        />
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
