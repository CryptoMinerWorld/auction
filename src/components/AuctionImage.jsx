import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const Image = styled.div`
  background-image: url(${props => props.sourceImage});
  height: 60vh;
  @media (min-width: 60em) {
    margin-right: 8em;
  }

  @media (min-width: 100em) {
    margin-right: 16em;
  }
`;

const AuctionImage = ({ sourceImage }) => (
  <div className="pa3-ns">
    <div className="mw9">
      <Image
        className="v-mid bg-transparent contain bg-right-l bg-center"
        sourceImage={sourceImage}
      />
    </div>
  </div>
);

AuctionImage.propTypes = {
  sourceImage: PropTypes.string.isRequired
};

export default AuctionImage;
