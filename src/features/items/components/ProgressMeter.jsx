import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Progress from 'antd/lib/progress';
import { calculatePercentage, weiToEth } from '../../market/helpers';

require('antd/lib/progress/style/css');

class ProgressMeter extends PureComponent {
  render() {
    const { currentPrice, minPrice, maxPrice } = this.props;
    return (
      <div className="white ma0 pa3 tc ">
        <small className="white ttu ">current price</small>
        <p className="basic" style={{ fontSize: 'xx-large' }}>
          Ξ
          {' '}
          <span data-testid="currentPrice">{weiToEth(currentPrice)}</span>
        </p>

        <Progress
          percent={calculatePercentage(maxPrice, currentPrice)}
          showInfo={false}
          className="ba br-pill pb1 ph2 mb1  b--white-40"
          strokeColor="#c018ab"
          status="active"
        />
        <div className="flex jcb">
          <small className="basic">
            Ξ
            {' '}
            <span data-testid="minPrice">{weiToEth(maxPrice)}</span>
          </small>
          <small className="basic">
            Ξ
            {' '}
            <span data-testid="maxPrice">{weiToEth(minPrice)}</span>
          </small>
        </div>
      </div>
    );
  }
}

export default ProgressMeter;

ProgressMeter.propTypes = {
  currentPrice: PropTypes.number.isRequired,
  minPrice: PropTypes.number.isRequired,
  maxPrice: PropTypes.number.isRequired,
};
