import React from 'react';
import styled from 'styled-components';
import img from '../images/amethystImage.png';

const Image = styled.div`
  background-image: url(${img});
  height: 60vh;
`;

const AuctionImage = () => (
  <div className="pa3-ns">
    <div className="mw8 center">
      <Image className="v-mid bg-transparent contain bg-right-l bg-center" />
    </div>
  </div>
);


export default AuctionImage;
