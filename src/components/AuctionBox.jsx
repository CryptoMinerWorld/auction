import React, { Component } from 'react';
import CountdownTimer from './CountdownTimer';
import Gembox from './Gembox';
import PropTypes from 'prop-types';
import buyNow from '../images/pinkBuyNowButton.png';
import styled from 'styled-components';

const TopHighlight = styled.div`
  background: linear-gradient(to right, #e36d2d, #b91a78);
  border-radius: 4px 4px 0px 0px;
  height: 4px;
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

const OverlapOnDesktopView = styled.div`
  @media (min-width: 64em) {
    position: absolute;
    top: 2em;
    left: 5em;
    z-index: 2;
  }
`;

class AuctionBox extends Component {
  static propTypes = {
    currentPrice: PropTypes.number.isRequired,
    handleBuyNow: PropTypes.func.isRequired,
    level: PropTypes.number.isRequired,
    grade: PropTypes.string.isRequired,
    rate: PropTypes.number.isRequired,
    deadline: PropTypes.instanceOf(Date).isRequired,
    name: PropTypes.string.isRequired
  };
  render() {
    let {
      currentPrice,
      handleBuyNow,
      level,
      grade,
      rate,
      deadline,
      name,
      tokenId,
      redirectTo,
      showConfirm
    } = this.props;

    if (redirectTo === '/workshop') {
      window.location = 'https://cryptominerworld.com/workshop/';
    }
    return (
      <OverlapOnDesktopView className="bg-dark-gray br3 measure-l w-100 shadow-3">
        <TopHighlight />
        <div className="white pa3">
          <h1 className="tc pb3" style={{ wordBreak: 'break-all' }}>
            {name}
          </h1>
          <CountdownTimer deadline={deadline} />
          <Gembox level={level} grade={grade} rate={rate} />
          <div className="tc">
            <small className="white ttu ">current price</small>
            <p
              className="white f2 mv2 tc basic "
              data-testid="currentAuctionPrice"
            >
              Ξ {currentPrice}
            </p>
          </div>
          <div className="w-100 w5-ns h3 center">
            <BuyNow
              onClick={() => showConfirm(tokenId, handleBuyNow)}
              className="b"
              data-testid="buyNowButton"
            >
              Buy Now
            </BuyNow>
          </div>
          <p className="underline blue tc measure-narrow center pt3">
            Click here to learn more about how dutch auctions work?
          </p>
        </div>
      </OverlapOnDesktopView>
    );
  }
}

export default AuctionBox;
