import React from 'react';
import PropTypes from 'prop-types';
import Progress from 'antd/lib/progress';
import Tilt from 'react-tilt';
import { calculatePercentage } from '../../market/helpers';
import MiniGemBox from '../../../components/MiniGemBox';
import { calculateGemName } from '../helpers';

require('antd/lib/progress/style/css');

const Cards = ({ auction }) => {
  console.log("CARD:::", auction);
  return (
  <Tilt className="Tilt" options={{ max: 20, scale: 1 }}>
    <div
      className="bg-off-black shadow-3 white"
      style={{
        WebkitClipPath:
          'polygon(100.23% 96.54%, 95.12% 99.87%, 8.69% 100.01%, 1.21% 98.76%, -0.22% 92.82%, 0.03% 2.74%, 4.31% -0.23%, 92.22% -0.24%, 98.41% 1.33%, 100.1% 5.29%)',
        clipPath:
          'polygon(100.23% 96.54%, 95.12% 99.87%, 8.69% 100.01%, 1.21% 98.76%, -0.22% 92.82%, 0.03% 2.74%, 4.31% -0.23%, 92.22% -0.24%, 98.41% 1.33%, 100.1% 5.29%)',
      }}
    >
      <figure className="ma0 pa0">
        <img src={auction.image} alt="gem" className="ma0 pa3 pb0" />
        <figcaption hidden>{auction.quality}</figcaption>
      </figure>
      <Progress
        strokeLinecap="square"
        percent={calculatePercentage(auction.minPrice, auction.maxPrice, auction.currentPrice)}
        status="active"
        showInfo={false}
        strokeColor="#ffc584"
        className="o-50"
      />
      <div className="tc">
        <big className="db b f3">{calculateGemName(auction.color, auction.id)}</big>
      </div>
      <div className="flex pa3 pb0 w-100 jcc">
        <MiniGemBox level={auction.level} grade={auction.gradeType} rate={auction.rate} market />
      </div>
    </div>
  </Tilt>
)}

Cards.propTypes = {
  auction: PropTypes.shape({
    id: PropTypes.number,
    minPrice: PropTypes.number,
    maxPrice: PropTypes.number,
    price: PropTypes.number,
    image: PropTypes.string,
    owner: PropTypes.string,
    grade: PropTypes.number,
    quality: PropTypes.number,
    rate: PropTypes.number,
  }).isRequired,
};

export default Cards;
