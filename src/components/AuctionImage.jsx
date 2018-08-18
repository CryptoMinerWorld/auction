import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import img from '../images/amethystImage.png';
import rockBackground from '../images/rockBackground.png';

const Image = styled.div`
  background-image: url(${img});
`;

const RockOverlay = styled.div`
  background-image: url(${rockBackground});
  background-repeat: repeat;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
`;

class AuctionImage extends PureComponent {
  static propTypes = {};

  render() {
    return (
      <div className="pa4-ns bg-black">
        <RockOverlay />
        <Image className="vh-75 v-mid bg-black contain bg-right-ns bg-center" />
      </div>
    );
  }
}

export default AuctionImage;
