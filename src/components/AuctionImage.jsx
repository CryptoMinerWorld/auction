import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Image = styled.div`
  background-image: url(${ props => props.sourceImage});
  height: 60vh;
`;

const AuctionImage = ({ sourceImage }) => (
  <div className="pa3-ns">
    <div className="mw8 center">
      <Image className="v-mid bg-transparent contain bg-right-l bg-center"
        sourceImage={sourceImage} />
    </div>
  </div>
);

AuctionImage.propTypes = {
  sourceImage: PropTypes.string.isRequired,
};


export default AuctionImage;
