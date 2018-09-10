import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Input, Button } from 'antd';
import rockBackground from '../../images/rockBackground.png';
import Mint from './Mint';
import { ethToWei, daysToSeconds } from './helpers';

const RockOverlay = styled.div`
  background-image: url(${rockBackground});
  background-repeat: repeat;
  background-size: contain;
`;

class CreateAuction extends PureComponent {
  static propTypes = {
    createAuction: PropTypes.func.isRequired,
    // handleApproveGemTransfer: PropTypes.func.isRequired,
    handleRemoveGemFromAuction: PropTypes.func.isRequired
  };

  state = {
    gemId: '',
    duration: '',
    startPrice: '',
    endPrice: ''
  };

  handleChange = (value, field) => this.setState({ [field]: value });

  render() {
    const {
      createAuction,
      // handleApproveGemTransfer,
      handleRemoveGemFromAuction
    } = this.props;
    const { gemId, duration, startPrice, endPrice } = this.state;

    return (
      <div className="bg-off-black">
        <RockOverlay>
          <div className="relative mw9 center flex jcc ">
            {/* <div className="pa5 flex jcc col">
              <Input
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
                <Button
                  className="ma3"
                  onClick={() => handleApproveGemTransfer(gemId)}
                  data-testid="transferGemButton"
                >
                  Approve Transfer
                </Button>
              </div>
            </div> */}

            <div className="pa5 flex jcc col">
              <Input
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
                  className="ma3"
                  onClick={() =>

                    createAuction(gemId,
                      daysToSeconds(duration), ethToWei(startPrice), ethToWei(endPrice)
                    )
                  }
                  data-testid="createAuctionButton"
                >
                  Create Auction
                </Button>
              </div>
            </div>

            <div className="pa5 flex jcc col">
              <Input
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
          </div>
          <Mint />
        </RockOverlay>
      </div >
    );
  }
}

export default CreateAuction;
