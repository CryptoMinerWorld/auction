import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import CountdownTimer from "./CountdownTimer";
import Gembox from "./Gembox";
import buyNow from "../images/pinkBuyNowButton.png";
import ProgressMeter from "./ProgressMeter";

const TopHighlight = styled.div`
  background: linear-gradient(to right, #e36d2d, #b91a78);
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
    className="bg-dark-gray measure-l w-100 shadow-3"
    style={{
      WebkitClipPath:
        "polygon(5px 2px, 3.34% -0.15%, 99% 0px, 100% 2.31%, 99.59% 7.08%, 99.48% 46%, 99.17% 71.71%, 100% 97%, 100.04% 99%, 98% 100%, 8.96% 99.00%, 0.8% 99.93%, 0px 97%, 0.58% 59.56%, 1.08% 25.51%, 0.03% 2.23%)",
      clipPath:
        "polygon(5px 2px, 3.34% -0.15%, 99% 0px, 100% 2.31%, 99.59% 7.08%, 99.48% 46%, 99.17% 71.71%, 100% 97%, 100.04% 99%, 98% 100%, 8.96% 99.00%, 0.8% 99.93%, 0px 97%, 0.58% 59.56%, 1.08% 25.51%, 0.03% 2.23%)"
      // clipPath:
      //   "polygon(3% 0, 97% 0, 100% 2%, 100% 98%, 97% 100%, 3% 100%, 0 98%, 0 2%)"
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
