import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Progress } from 'antd';

class ProgressMeter extends PureComponent {
  calculatePercentage = (max, current) => ((max - current) / max) * 100;

  render() {
    const { currentPrice, minPrice, maxPrice } = this.props;

    return (
      <div className="white ma0 pa3 tc ">
        <small className="white ttu ">current price</small>
        <p className="basic" style={{ fontSize: 'xx-large' }}>
          Ξ
          {' '}
          <span data-testid="currentPrice">{currentPrice}</span>
        </p>

        <Progress
          percent={this.calculatePercentage(minPrice, currentPrice)}
          showInfo={false}
          className="ba br-pill pb1 ph2 mb1  b--white-40"
          strokeColor="#c018ab"
        />
        <div className="flex jcb">
          <small className="basic">
            Ξ
            {' '}
            <span data-testid="minPrice">{minPrice}</span>
          </small>
          <small className="basic">
            Ξ
            {' '}
            <span data-testid="maxPrice">{maxPrice}</span>
          </small>
        </div>
      </div>
    );
  }
}

export default ProgressMeter;

ProgressMeter.propTypes = {
  currentPrice: PropTypes.string.isRequired,
  minPrice: PropTypes.number.isRequired,
  maxPrice: PropTypes.number.isRequired,
};
