import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class ProgressMeter extends PureComponent {
  static propTypes = {
    currentPrice: PropTypes.string.isRequired,
    minPrice: PropTypes.number.isRequired,
    maxPrice: PropTypes.number.isRequired
  };

  render() {
    const { currentPrice, minPrice, maxPrice } = this.props;
    return (
      <div className="white ma0 pa3 tc ">
        <small className="white ttu ">current price</small>
        <p

          className="basic"
          style={{ fontSize: 'xx-large' }}
        >
          Ξ <span data-testid="currentPrice">{currentPrice}</span>
        </p>
        <progress value={currentPrice} max={maxPrice} min={minPrice} className="w-100" />
        <div className="flex jcb">
          <small className="basic">
            Ξ <span data-testid="minPrice">{minPrice}</span>
          </small>
          <small className="basic">
            Ξ <span data-testid="maxPrice" >{maxPrice}</span>
          </small>
        </div>
      </div >
    );
  }
}

export default ProgressMeter;
