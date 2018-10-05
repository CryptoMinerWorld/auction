import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Progress from 'antd/lib/progress';
import format from 'date-fns/format';
import { calculatePercentage, weiToEth } from '../helpers';
import MiniGemBox from '../../../components/MiniGemBox';

require('antd/lib/progress/style/css');

const Card = styled.aside`
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
      strokeColor="#c214a7"
      className="o-70"
    />
    <div className="flex jcb ph3">
      <small className="basic">
        Ξ <small>{weiToEth(auction.maxPrice)}</small>
      </small>
      <big className="db b f3 o-70">
        <span className="basic" style={{ color: '#FFB700' }}>
          Ξ
        </span>{' '}
        <span style={{ color: '#FFB700' }}>
          {weiToEth(auction.currentPrice)}
        </span>
      </big>
      <small className="basic">
        Ξ <small>{weiToEth(auction.minPrice)}</small>
      </small>
    </div>
    <div className="tc">
      <small>
        Ends on{' '}
        {auction.deadline &&
          format(new Date(auction.deadline * 1000), 'EEEE do of MMMM')}
      </small>
    </div>

    <div className="flex col pa3 pb0 w-100">
      <MiniGemBox
        level={auction.level}
        grade={auction.gradeType}
        rate={auction.rate}
      />
      <div className="flex jcc ph3 o-70 ">
        <img src={auction.userImage} alt={auction.userName} className="h2" />
        <p>Owned by {auction.userName}</p>
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

export default Cards;
