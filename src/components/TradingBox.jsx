import PropTypes from "prop-types";
import styled from "styled-components";
import React, { PureComponent } from "react";
import Input from "antd/lib/input";
import Button from "antd/lib/button";
import { ethToWei, daysToSeconds } from "../features/mint/helpers";

const TopHighLight = styled.div`
  background: linear-gradient(to right, #e36d2d, #b91a78);
  height: 4px;
`;

const tophighlight = {
  background: "linear-gradient(to right, #e36d2d, #b91a78)",
  height: "4px"
};

const OverlapOnDesktopView = styled.div`
  @media (min-width: 64em) {
    position: absolute;
    top: 2em;
    left: 5em;
    z-index: 2;
  }
`;

class TradingBox extends PureComponent {
  static propTypes = {
    gemId: PropTypes.string.isRequired,
    createAuction: PropTypes.func.isRequired,
    handleRemoveGemFromAuction: PropTypes.func.isRequired,
    auctionIsLive: PropTypes.bool.isRequired
  };

  state = {
    duration: "",
    startPrice: "",
    endPrice: ""
  };

  handleChange = (value, field) => this.setState({ [field]: value });

  render() {
    const {
      createAuction,
      handleRemoveGemFromAuction,
      gemId,
      auctionIsLive
    } = this.props;
    const { duration, startPrice, endPrice } = this.state;

    return (
      <OverlapOnDesktopView
        className="bg-dark-gray measure-l w-100 shadow-3"
        style={{
          WebkitClipPath:
            "polygon(100.23% 96.54%, 95.12% 99.87%, 8.69% 100.01%, 1.21% 98.76%, -0.22% 92.82%, 0.03% 2.74%, 4.31% -0.23%, 92.22% -0.24%, 98.41% 1.33%, 100.1% 5.29%)",
          clipPath:
            "polygon(100.23% 96.54%, 95.12% 99.87%, 8.69% 100.01%, 1.21% 98.76%, -0.22% 92.82%, 0.03% 2.74%, 4.31% -0.23%, 92.22% -0.24%, 98.41% 1.33%, 100.1% 5.29%)"
        }}
      >
        <TopHighLight style={tophighlight} />
        <div className="white pa3">
          <div className="flex col jcc ">
            {auctionIsLive ? (
              <div className="pa5 flex jcc col">
                <div>
                  <Button
                    type="danger"
                    className="ma3"
                    onClick={() => handleRemoveGemFromAuction(gemId)}
                    data-testid="removeGemButton"
                  >
                    Remove Gem From Auction
                  </Button>
                </div>
              </div>
            ) : (
              <div className="pa5 flex jcc col">
                <Input
                  type="number"
                  placeholder="duration in days"
                  className="db"
                  value={duration}
                  onChange={e =>
                    this.handleChange(Number(e.target.value), "duration")
                  }
                  data-testid="durationInputField"
                  required
                />
                <Input
                  type="number"
                  placeholder="Start price in ether"
                  className="db"
                  value={startPrice}
                  onChange={e =>
                    this.handleChange(Number(e.target.value), "startPrice")
                  }
                  data-testid="startPriceInputField"
                  required
                />
                <Input
                  type="number"
                  placeholder="End price in ether"
                  className="db"
                  value={endPrice}
                  onChange={e =>
                    this.handleChange(Number(e.target.value), "endPrice")
                  }
                  data-testid="endPriceInputField"
                  required
                />
                <div>
                  <Button
                    className="ma3"
                    disabled={!(gemId && duration && startPrice)}
                    onClick={() => {
                      const payload = {
                        gemId,
                        duration: daysToSeconds(duration),
                        startPrice: ethToWei(startPrice),
                        endPrice: ethToWei(endPrice)
                      };
                      createAuction(payload);
                    }}
                    data-testid="createAuctionButton"
                  >
                    Create Auction
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </OverlapOnDesktopView>
    );
  }
}

export default TradingBox;

TradingBox.propTypes = {
  createAuction: PropTypes.func.isRequired,
  handleRemoveGemFromAuction: PropTypes.func.isRequired
};
