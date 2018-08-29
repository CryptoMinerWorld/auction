import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';
import rockBackground from '../../images/rockBackground.png';
import { Subscribe } from 'unstated';
import CreateAuctionStore from './store';

const RockOverlay = styled.div`
  background-image: url(${rockBackground});
  background-repeat: repeat;
  background-size: contain;
`;

class CreateAuction extends PureComponent {
  // static propTypes = {};

  state = {
    gemId: 69898,
    duration: 400000,
    startPrice: 95566000000000000,
    endPrice: 955660000000000
  };

  handleChange = (value, field) => this.setState({ [field]: value });

  render() {
    let { createAuction, handleApproveGemTransfer } = this.props;
    let { gemId, duration, startPrice, endPrice } = this.state;
    return (
      <div className="bg-off-black ">
        <RockOverlay>
          <div className="relative mw9 center flex jcc">
            <div className="pa5 tc">
              <input
                type="text"
                placeholder="gemId"
                className="db"
                value={gemId}
                onChange={e => this.handleChange(e.target.value, 'gemId')}
                required
              />
              <input
                type="text"
                placeholder="duration in seconds"
                className="db"
                value={duration}
                onChange={e => this.handleChange(e.target.value, 'duration')}
                required
              />
              <input
                type="text"
                placeholder="starting price"
                className="db"
                value={startPrice}
                onChange={e => this.handleChange(e.target.value, 'startPrice')}
                required
              />
              <input
                type="text"
                placeholder="end price"
                className="db"
                value={endPrice}
                onChange={e => this.handleChange(e.target.value, 'endPrice')}
                required
              />
              <button
                className="ma3"
                onClick={() => handleApproveGemTransfer(gemId)}
              >
                Approve Transfer
              </button>
              <button
                className="ma3"
                onClick={() =>
                  createAuction(gemId, duration, startPrice, endPrice)
                }
              >
                Create Auction
              </button>
            </div>
          </div>
        </RockOverlay>
      </div>
    );
  }
}

export const CreateAuctionContainer = props => (
  <Subscribe to={[CreateAuctionStore]}>
    {store => <CreateAuction store={store} {...props} />}
  </Subscribe>
);
