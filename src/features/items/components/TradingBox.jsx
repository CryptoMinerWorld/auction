import PropTypes from 'prop-types';
import styled from 'styled-components';
import React, { PureComponent } from 'react';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import { connect } from 'react-redux';
import { ethToWei, daysToSeconds } from '../../mint/helpers';
import { createAuction, removeFromAuction } from '../itemActions';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';

const TopHighLight = styled.div`
  background: linear-gradient(to right, #e36d2d, #b91a78);
  height: 4px;
`;

const tophighlight = {
  background: 'linear-gradient(to right, #e36d2d, #b91a78)',
  height: '4px'
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
    tokenId: PropTypes.number.isRequired,
    handleCreateAuction: PropTypes.func.isRequired,
    handleRemoveGemFromAuction: PropTypes.func.isRequired,
    auctionIsLive: PropTypes.bool.isRequired
  };

  state = {
    duration: '',
    startPrice: '',
    endPrice: '',
    formSubmitted: false
  };

  handleChange = (value, field) => this.setState({ [field]: value });

  turnLoaderOff = () => this.setState({ formSubmitted: false });

  render() {
    const {
      handleCreateAuction,
      handleRemoveGemFromAuction,
      tokenId,
      auctionIsLive,
      history
    } = this.props;
    const { duration, startPrice, endPrice, formSubmitted } = this.state;
    return (
      <OverlapOnDesktopView
        className="bg-dark-gray measure-l w-100 shadow-3"
        style={{
          WebkitClipPath:
            'polygon(100.23% 96.54%, 95.12% 99.87%, 8.69% 100.01%, 1.21% 98.76%, -0.22% 92.82%, 0.03% 2.74%, 4.31% -0.23%, 92.22% -0.24%, 98.41% 1.33%, 100.1% 5.29%)',
          clipPath:
            'polygon(100.23% 96.54%, 95.12% 99.87%, 8.69% 100.01%, 1.21% 98.76%, -0.22% 92.82%, 0.03% 2.74%, 4.31% -0.23%, 92.22% -0.24%, 98.41% 1.33%, 100.1% 5.29%)'
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
                    onClick={() => {
                      this.setState({ formSubmitted: true });

                      handleRemoveGemFromAuction(
                        Number(tokenId),
                        history,
                        this.turnLoaderOff
                      );
                    }}
                    data-testid="removeGemButton"
                    loading={formSubmitted}
                  >
                    Remove Gem From Auction
                  </Button>
                </div>
                {formSubmitted && (
                  <p className="red pt3 pl3 measure">
                    Please do not nagivate away from this page while the
                    transaction is processing. You will be redirected once it is
                    done.
                  </p>
                )}
              </div>
            ) : (
              <div className="pa5 flex jcc col">
                <Input
                  type="number"
                  placeholder="duration in days"
                  className="db"
                  value={duration}
                  onChange={e =>
                    this.handleChange(Number(e.target.value), 'duration')
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
                    this.handleChange(Number(e.target.value), 'startPrice')
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
                    this.handleChange(Number(e.target.value), 'endPrice')
                  }
                  data-testid="endPriceInputField"
                  required
                />
                <div>
                  <Button
                    type="submit"
                    className="ma3"
                    disabled={
                      !(
                        tokenId &&
                        duration &&
                        startPrice &&
                        startPrice > endPrice &&
                        startPrice !== endPrice
                      )
                    }
                    onClick={() => {
                      const payload = {
                        tokenId: Number(tokenId),
                        duration: daysToSeconds(duration),
                        startPrice: ethToWei(startPrice),
                        endPrice: ethToWei(endPrice)
                      };
                      this.setState({ formSubmitted: true });
                      handleCreateAuction(payload, this.turnLoaderOff, history);
                    }}
                    data-testid="createAuctionButton"
                    loading={formSubmitted}
                  >
                    Create Auction
                  </Button>
                </div>
                {formSubmitted && (
                  <p className="red pt3 measure">
                    Please do not nagivate away from this page while the
                    transaction is processing. You will be redirected once it is
                    done.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </OverlapOnDesktopView>
    );
  }
}

const actions = {
  handleCreateAuction: createAuction,
  handleRemoveGemFromAuction: removeFromAuction
};

export default compose(
  connect(
    null,
    actions
  ),
  withRouter
)(TradingBox);
