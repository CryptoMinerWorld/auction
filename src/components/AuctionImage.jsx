import React, { PureComponent } from 'react';
import img from '../images/amethystImage.png';
import styled from 'styled-components';

const Image = styled.div`
  background-image: url(${img});
  height: 60vh;
`;

class AuctionImage extends PureComponent {
  static propTypes = {};

  render() {
    return (
      <div className="pa3-ns">
        <div className="mw8 center">
          <Image className="v-mid bg-transparent contain bg-right-ns bg-center" />
        </div>
      </div>
    );
  }
}

export default AuctionImage;
