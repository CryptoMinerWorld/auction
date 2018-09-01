import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class ProgressMeter extends PureComponent {
  static propTypes = {
    currentPrice: PropTypes.number.isRequired,
    minPrice: PropTypes.number.isRequired,
    maxPrice: PropTypes.number.isRequired
  };

  render() {
    const { currentPrice, minPrice, maxPrice } = this.props;
    return (
      <div className="white ma0 pa3 tc ">
        <small className="white ttu ">current price</small>
        <p
          data-testid="currentPrice"
          className="basic"
          style={{ fontSize: 'xx-large' }}
        >
          Ξ {currentPrice}
        </p>
        <progress value={currentPrice} max={maxPrice} min={minPrice} className="w-100" />
        <div className="flex jcb">
          <small data-testid="minPrice" className="basic">
            Ξ {minPrice}
          </small>
          <small data-testid="maxPrice" className="basic">
            Ξ {maxPrice}
          </small>
        </div>
      </div>
    );
  }
}

export default ProgressMeter;
