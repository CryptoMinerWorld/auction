import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Triangle = styled.div`
  width: 116px;
  height: 0;
  border-left: 60px solid transparent;
  border-right: 60px solid transparent;
  border-top: 20px solid #5f1763;
`;

class MobileHeader extends PureComponent {
  static propTypes = {};

  render() {
    return (
      <div className="flex-s dn-ns jca bg-base shadow-1 ">
        <div className="absolute left-1">
          <div className="bg-dark-purple pa3">
            <p className="white">current price</p>
            <p className="white">Ξ 3.557</p>
          </div>
          <Triangle />
        </div>
        <div className="w4" />
        <div>
          <p>level</p>
          <p>2</p>
        </div>
        <div>
          <p>grade</p>
          <p>a</p>
        </div>
        <div>
          <p>rate</p>
          <p>82</p>
        </div>
      </div>
    );
  }
}

export default MobileHeader;
