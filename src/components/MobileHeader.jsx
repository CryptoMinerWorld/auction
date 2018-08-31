import React, { PureComponent } from 'react';
import styled from 'styled-components';
import Gembox from './Gembox';
import PropTypes from 'prop-types';

const Triangle = styled.div`
  width: 140px;
  height: 10px;
  border-left: 70px solid transparent;
  border-right: 70px solid transparent;
  border-top: 20px solid #5f1763;
`;

class MobileHeader extends PureComponent {
  static propTypes = {
    currentPrice: PropTypes.string.isRequired,
    level: PropTypes.number.isRequired,
    grade: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    rate: PropTypes.number.isRequired
  };
  render() {
    let { currentPrice, level, grade, rate } = this.props;
    return (
      <div className="flex-s dn-ns jca bg-base shadow-1 ">
        <div className="absolute left-1">
          <div className="bg-deep-purple pa3">
            <small className="white ttu b ">current price</small>
            <p className="white f3 tc">
              Ξ {Math.round(currentPrice * 100) / 100}
            </p>
          </div>
          <Triangle />
        </div>

        <div className="w-100">
          <div className="w-50 fr mr6-ns">
            <Gembox level={level} grade={grade} rate={rate} />
          </div>
        </div>
      </div>
    );
  }
}

export default MobileHeader;
