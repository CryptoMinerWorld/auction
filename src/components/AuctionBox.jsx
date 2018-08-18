import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const TopHighlight = styled.div`
  background: linear-gradient(to right, #e36d2d, #b91a78);
  border-radius: 4px 4px 0px 0px;
  height: 3px;
`;

class AuctionBox extends PureComponent {
  static propTypes = {};

  render() {
    return (
      <div className="bg-dark-gray  br3 measure ">
        <TopHighlight />
        <div className="white pa3">
          <h1>Amethyst Thingymajig</h1>
          <div>countdown timer</div>
          <div>gems</div>
          <div>current price</div>
          <button>Buy Now</button>
          <p>learn more</p>
        </div>
      </div>
    );
  }
}

export default AuctionBox;
