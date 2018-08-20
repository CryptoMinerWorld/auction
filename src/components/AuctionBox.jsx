import React, { PureComponent } from 'react';
import styled from 'styled-components';
import CountdownTimer from './CountdownTimer';
import Gembox from './Gembox';
import PropTypes from 'prop-types';
import buyNow from '../images/pinkBuyNowButton.png';

const TopHighlight = styled.div`
  background: linear-gradient(to right, #e36d2d, #b91a78);
  border-radius: 4px 4px 0px 0px;
  height: 3px;
`;

const BuyNow = styled.button`
  background-image: url(${buyNow});
  background-position: center top;
  width: 100%;
  height: 100%;
  text-align: center;
  background-size: contain;
  background-repeat: no-repeat;
  background-color: transparent;
  border: none;
  color: white;
  text-transform: uppercase;
  cursor: pointer;
`;

class AuctionBox extends PureComponent {
  static propTypes = {
    currentPrice: PropTypes.string.isRequired,
    handleBuyNow: PropTypes.func.isRequired,
    level: PropTypes.number.isRequired,
    grade: PropTypes.string.isRequired,
    rate: PropTypes.number.isRequired,
    deadline: PropTypes.instanceOf(Date).isRequired
  };
  render() {
    let {
      currentPrice,
      handleBuyNow,
      level,
      grade,
      rate,
      deadline
    } = this.props;
    return (
      <div className="bg-dark-gray  br3 measure ">
        <TopHighlight />
        <div className="white pa3">
          <h1 className="tc">Amethyst Thingymajig</h1>
          <CountdownTimer deadline={deadline} />
          <Gembox level={level} grade={grade} rate={rate} />
          <div className="tc">
            <p>current price</p>
            <p>Ξ {currentPrice}</p>
          </div>
          <div className="w-100 w5-ns h3">
            <BuyNow onClick={handleBuyNow}>Buy Now</BuyNow>
          </div>
          <p className="underline blue tc measure">
            Click here to learn more about how dutch auctions work?
          </p>
        </div>
      </div>
    );
  }
}

export default AuctionBox;
