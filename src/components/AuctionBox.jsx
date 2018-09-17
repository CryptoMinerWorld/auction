import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import CountdownTimer from "./CountdownTimer";
import Gembox from "./Gembox";
import buyNow from "../images/pinkBuyNowButton.png";
import ProgressMeter from "./ProgressMeter";

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

const AuctionBox = ({
  currentPrice,
  handleBuyNow,
  level,
  grade,
  rate,
  deadline,
  name,
  tokenId,
  provider,
  showConfirm,
  minPrice,
  maxPrice,
  currentAccount
}) => (
  <OverlapOnDesktopView
    className="bg-dark-gray br3 measure-l w-100 shadow-3"
    style={{
      clipPath:
        "polygon(3% 0, 97% 0, 100% 2%, 100% 98%, 97% 100%, 3% 100%, 0 98%, 0 2%)"
    }}
  >
    <TopHighlight />
    <div className="white pa3">
      <h1 className="tc pb3 b white" style={{ wordBreak: "break-all" }}>
        {name}
      </h1>
      {deadline && <CountdownTimer deadline={deadline} />}
      <div className="mt3" />
      <Gembox level={level} grade={grade} rate={rate} />

      <div className="w-100 w5-ns h3 center mt4">
        <BuyNow
          onClick={() =>
            provider
              ? handleBuyNow(tokenId, currentAccount)
              : showConfirm(handleBuyNow, tokenId, currentAccount)
          }
          className="b"
          data-testid="buyNowButton"
        >
          {currentAccount ? "Buy Now" : "Loading..."}
        </BuyNow>
      </div>
      <ProgressMeter
        currentPrice={currentPrice}
        minPrice={minPrice}
        maxPrice={maxPrice}
      />
    </div>
  </OverlapOnDesktopView>
);

export default AuctionBox;

AuctionBox.propTypes = {
  currentPrice: PropTypes.string.isRequired,
  handleBuyNow: PropTypes.func.isRequired,
  level: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  grade: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  rate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  deadline: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  name: PropTypes.string.isRequired,
  showConfirm: PropTypes.func.isRequired,
  tokenId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  maxPrice: PropTypes.number.isRequired,
  minPrice: PropTypes.number.isRequired,
  provider: PropTypes.bool.isRequired,
  currentAccount: PropTypes.string.isRequired
};
