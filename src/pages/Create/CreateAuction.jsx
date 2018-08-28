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
  static propTypes = {};

  render() {
    return (
      <div className="bg-off-black ">
        <RockOverlay>
          <div className="relative mw9 center flex jcc">
            <div className="pa5 tc">
              <button className="ma3">Create Auction</button>
              <input type="text" placeholder="gemId" className="db" />
              <input type="text" placeholder="starting price" className="db" />
              <input type="text" placeholder="minimum price" className="db" />
              <input type="text" placeholder="duration" className="db" />
            </div>
          </div>
        </RockOverlay>
      </div>
    );
  }
}

export default CreateAuction;
