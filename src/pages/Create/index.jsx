import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import rockBackground from '../../images/rockBackground.png';

const RockOverlay = styled.div`
  background-image: url(${rockBackground});
  background-repeat: repeat;
  background-size: contain;
`;

class CreateAuction extends PureComponent {
  static propTypes = {
    createAuction: PropTypes.func.isRequired,
    handleApproveGemTransfer: PropTypes.func.isRequired,
    handleRemoveGemFromAuction: PropTypes.func.isRequired
  };

  state = {
    gemId: '',
    duration: 400000,
    startPrice: 95566000000000000,
    endPrice: 955660000000000
  };

  handleChange = (value, field) => this.setState({ [field]: value });

  render() {
    let {
      createAuction,
      handleApproveGemTransfer,
      handleRemoveGemFromAuction
    } = this.props;
    let { gemId, duration, startPrice, endPrice } = this.state;

    return (
      <div className="bg-off-black">
        <RockOverlay>
          <div className="relative mw9 center flex jcc ">
            <div className="pa5 flex jcc col">
              <input
                type="number"
                placeholder="gemId"
                className="db"
                value={gemId}
                onChange={e =>
                  this.handleChange(Number(e.target.value), 'gemId')
                }
                data-testid="approveGemInputField"
                required
              />

              <div>
                <button
                  className="ma3"
                  onClick={() => handleApproveGemTransfer(gemId)}
                  data-testid="transferGemButton"
                >
                  Approve Transfer
                </button>
              </div>
            </div>

            <div className="pa5 flex jcc col">
              <input
                type="number"
                placeholder="gemId"
                className="db"
                value={gemId}
                onChange={e =>
                  this.handleChange(Number(e.target.value), 'gemId')
                }
                data-testid="gemInputField"
                required
              />
              <input
                type="number"
                placeholder="duration in seconds"
                className="db"
                value={duration}
                onChange={e =>
                  this.handleChange(Number(e.target.value), 'duration')
                }
                data-testid="durationInputField"
                required
              />
              <input
                type="number"
                placeholder="starting price"
                className="db"
                value={startPrice}
                onChange={e =>
                  this.handleChange(Number(e.target.value), 'startPrice')
                }
                data-testid="startPriceInputField"
                required
              />
              <input
                type="number"
                placeholder="end price"
                className="db"
                value={endPrice}
                onChange={e =>
                  this.handleChange(Number(e.target.value), 'endPrice')
                }
                data-testid="endPriceInputField"
                required
              />
              <div>
                <button
                  className="ma3"
                  onClick={() =>
                    createAuction(gemId, duration, startPrice, endPrice)
                  }
                  data-testid="createAuctionButton"
                >
                  Create Auction
                </button>
              </div>
            </div>

            <div className="pa5 flex jcc col">
              <input
                type="text"
                placeholder="gemId"
                className="db"
                value={gemId}
                onChange={e =>
                  this.handleChange(Number(e.target.value), 'gemId')
                }
                data-testid="removeGemInputField"
                required
              />

              <div>
                <button
                  className="ma3"
                  onClick={() => handleRemoveGemFromAuction(gemId)}
                  data-testid="removeGemButton"
                >
                  Remove Gem From Auction
                </button>
              </div>
            </div>
          </div>
        </RockOverlay>
      </div>
    );
  }
}

export default CreateAuction;