import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Progress from 'antd/lib/progress';
import format from 'date-fns/format';
import { calculatePercentage, weiToEth } from '../features/market/helpers';
import MiniGemBox from './MiniGemBox';

require('antd/lib/progress/style/css');

const Card = styled.aside`
  clip-path: polygon(5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0% 95%, 0% 5%);
`;

const Cards = ({ auction }) => (
  <Card className="bg-dark-gray shadow-3 white">
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
    <div className="flex jcb ph3">
      <small className="basic">
        Ξ
        {' '}
        <small>{weiToEth(auction.maxPrice)}</small>
      </small>
      <small className="basic">
        Ξ
        {' '}
        <small>{weiToEth(auction.minPrice)}</small>
      </small>
    </div>
    <div className="tc">
      <big className="db b f3">
        {' '}
        <span className="basic">Ξ</span>
        {' '}
        {weiToEth(auction.currentPrice)}
      </big>
      <small>
        Auction ends on
        {' '}
        {auction.deadline && format(new Date(auction.deadline * 1000), 'EEEE do of MMMM')}
      </small>
    </div>
    <hr />
    <div className="flex pa3 pb0 w-100">
      <img src={auction.userImage} alt={auction.userName} className="h3" />
      <div className="pl3 ma0 pa0 w-100">
        <p>
          by
          {auction.userName}
        </p>

        <MiniGemBox level={auction.level} grade={auction.gradeType} rate={auction.rate} />
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
        seconds: PropTypes.number.isRequired,
      }).isRequired,
      PropTypes.number,
    ]).isRequired,
    image: PropTypes.string,
    owner: PropTypes.string,
    grade: PropTypes.number,
    quality: PropTypes.number,
    rate: PropTypes.number,
  }).isRequired,
};

export default Cards;
