import React from 'react';
// import styled from "styled-components";
import PropTypes from 'prop-types';

// const Image = styled.div`
//   background-image: url(${props => props.sourceImage};
// `;

const AuctionImage = ({ sourceImage }) => (
  <div className="pa3-ns">
    <div className="w-100 flex jcc vh-60 aic">
      <div className="w-40-l dn dib-l" />
      <div className="w-60-l tc h-100">
        {/* <Image className="bg-center tc center" sourceImage={sourceImage} /> */}
        {sourceImage && (
          <img
            style={{ backgroundposition: 'center' }}
            src={sourceImage}
            alt="gem for sale"
            className="w-auto-ns h-100-ns w-100 h-auto"
          />
        )}
      </div>
    </div>
  </div>
);

AuctionImage.propTypes = {
  sourceImage: PropTypes.string.isRequired,
};

export default AuctionImage;
