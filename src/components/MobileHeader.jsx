import React, { PureComponent } from 'react';
import styled from 'styled-components';
import Gembox from './Gembox';
import PropTypes from 'prop-types';

const Triangle = styled.div`
  width: 116px;
  height: 0;
  border-left: 60px solid transparent;
  border-right: 60px solid transparent;
  border-top: 20px solid #5f1763;
`;

class MobileHeader extends PureComponent {
  static propTypes = {
    currentPrice: PropTypes.string.isRequired,
    level: PropTypes.number.isRequired,
    grade: PropTypes.string.isRequired,
    rate: PropTypes.number.isRequired
  };
  render() {
    let { currentPrice, level, grade, rate } = this.props;
    return (
      <div className="flex-s dn-ns jca bg-base shadow-1 ">
        <div className="absolute left-1">
          <div className="bg-deep-purple pa3">
            <p className="white">current price</p>
            <p className="white">Ξ {currentPrice}</p>
          </div>
          <Triangle />
        </div>

        <div>
          <div className="w-60 fr">
            <Gembox level={level} grade={grade} rate={rate} />
          </div>
        </div>
      </div>
    );
  }
}

export default MobileHeader;
