import React, { PureComponent } from 'react';
import styled from 'styled-components';
import CountdownTimer from './CountdownTimer';
import Gembox from './Gembox';

const TopHighlight = styled.div`
  background: linear-gradient(to right, #e36d2d, #b91a78);
  border-radius: 4px 4px 0px 0px;
  height: 3px;
`;

class AuctionBox extends PureComponent {
  render() {
    return (
      <div className="bg-dark-gray  br3 measure ">
        <TopHighlight />
        <div className="white pa3">
          <h1 className="tc">Amethyst Thingymajig</h1>
          <CountdownTimer />
          <Gembox level="2" grade="b" rate="54" />
          <div>current price</div>
          <button>Buy Now</button>
          <p>learn more</p>
        </div>
      </div>
    );
  }
}

export default AuctionBox;
