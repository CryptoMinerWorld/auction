import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Progress from 'antd/lib/progress';
import { calculatePercentage } from '../../market/helpers';
import MiniGemBox from '../../../components/MiniGemBox';
import { calculateGemName } from '../helpers';

require('antd/lib/progress/style/css');

// const Card = styled.aside`
//   clip-path: polygon(
//     5% 0%,
//     95% 0%,
//     100% 5%,
//     100% 95%,
//     95% 100%,
//     5% 100%,
//     0% 95%,
//     0% 5%
//   );
// `;

const Cards = ({ auction }) => (
  <div
    className="bg-dark-gray shadow-3 white"
    style={{
      WebkitClipPath:
        'polygon(100.23% 96.54%, 95.12% 99.87%, 8.69% 100.01%, 1.21% 98.76%, -0.22% 92.82%, 0.03% 2.74%, 4.31% -0.23%, 92.22% -0.24%, 98.41% 1.33%, 100.1% 5.29%)',
      clipPath:
        'polygon(100.23% 96.54%, 95.12% 99.87%, 8.69% 100.01%, 1.21% 98.76%, -0.22% 92.82%, 0.03% 2.74%, 4.31% -0.23%, 92.22% -0.24%, 98.41% 1.33%, 100.1% 5.29%)'
    }}
  >
    <figure className="ma0 pa0">
      <img src={auction.gemImage} alt="gem" className="ma0 pa3 pb0" />
      <figcaption hidden>{auction.quality}</figcaption>
    </figure>
    <Progress
      strokeLinecap="square"
      percent={calculatePercentage(auction.maxPrice, auction.currentPrice)}
      status="active"
      showInfo={false}
      strokeColor="#ffc584"
      className="o-50"
    />
    {/* <div className="flex jcb ph3">
      <small className="basic">
        Ξ <small>{weiToEth(auction.maxPrice)}</small>
      </small>
      <small className="basic">
        Ξ <small>{weiToEth(auction.minPrice)}</small>
      </small>
    </div> */}
    <div className="tc">
      <big className="db b f3">
        {calculateGemName(auction.color, auction.id)}
      </big>
      {/* <small>
        Auction ends on{" "}
        {auction.deadline &&
          format(new Date(auction.deadline * 1000), "EEEE do of MMMM")}
      </small> */}
    </div>

    <div className="flex pa3 pb0 w-100 jcc">
      <MiniGemBox
        level={auction.level}
        grade={auction.gradeType}
        rate={auction.rate}
      />
    </div>
  </div>
);

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
    rate: PropTypes.number
  }).isRequired
};

export default Cards;
