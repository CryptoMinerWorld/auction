import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Gembox from "../../../components/Gembox";

const Card = styled.aside`
  grid-column: span 1;
  clip-path: polygon(
    5% 0%,
    95% 0%,
    100% 5%,
    100% 95%,
    95% 100%,
    5% 100%,
    0% 95%,
    0% 5%
  );
`;

const ProgressDivider = styled.progress`
  appearance: none;
  width: 100%;
  height: 5px;
  margin: 0;
  padding: 0;
  &:-webkit-progress-value {
    color: red;
  }
  &:-moz-progress-bar {
    color: red;
  }
`;

export const Cards = ({ auction }) => (
  <Card className="bg-dark-gray shadow-3">
    <figure className="ma0 pa0">
      <img src={auction.gemImage} alt="gem" className="ma0 pa3 pb0" />
      <figcaption hidden>{auction.quality}</figcaption>
    </figure>
    <ProgressDivider value="22" max="100" />
    <div className="flex jcb ph3">
      <small>{auction.minPrice}</small> <small>{auction.maxPrice}</small>
    </div>
    <div className="tc">
      <big className="db b">{auction.price}</big>
      <small>
        Auction ends on {auction.deadline && auction.deadline.seconds}
      </small>
    </div>
    <hr />
    <div className="flex pa3 pb0">
      <img src={auction.image} alt="" className="h3" />
      <div className="pl3 ma0 pa0">
        <p>by {auction.name}</p>
        <Gembox
          level={auction.gemLevel}
          grade={auction.grade}
          rate={auction.rate}
        />
      </div>
    </div>
  </Card>
);

Cards.propTypes = {
  auction: PropTypes.shape({
    id: PropTypes.number,
    minPrice: PropTypes.number,
    maxPrice: PropTypes.number,
    price: PropTypes.number,
    deadline: PropTypes.oneOfType([
      PropTypes.shape({
        seconds: PropTypes.number.isRequired
      }).isRequired,
      PropTypes.number
    ]).isRequired,
    image: PropTypes.string,
    owner: PropTypes.string,
    grade: PropTypes.number,
    quality: PropTypes.number,
    rate: PropTypes.number
  }).isRequired
};

export const temp = () => console.log("frog");
