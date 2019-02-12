import React from 'react';
import PropTypes from 'prop-types';
import Progress from 'antd/lib/progress';
import format from 'date-fns/format';
import Tilt from 'react-tilt';
import { calculatePercentage} from '../helpers';
import MiniGemBox from '../../../components/MiniGemBox';

require('antd/lib/progress/style/css');

const Cards = ({ auction }) => (
  <Tilt className="Tilt" options={{ max: 20, scale: 1 }}>
    <div
      className="bg-dark-gray shadow-3 white Tilt-inner"
      style={{
        WebkitClipPath:
          'polygon(100.23% 96.54%, 95.12% 99.87%, 8.69% 100.01%, 1.21% 98.76%, -0.22% 92.82%, 0.03% 2.74%, 4.31% -0.23%, 92.22% -0.24%, 98.41% 1.33%, 100.1% 5.29%)',
        clipPath:
          'polygon(100.23% 96.54%, 95.12% 99.87%, 8.69% 100.01%, 1.21% 98.76%, -0.22% 92.82%, 0.03% 2.74%, 4.31% -0.23%, 92.22% -0.24%, 98.41% 1.33%, 100.1% 5.29%)',
      }}
    >
      <figure className="ma0 pa0">
        <img src={auction.gemImage} alt="gem" className="ma0 pa3 pb0" />
        <figcaption hidden>{auction.quality}</figcaption>
      </figure>
      <Progress
        strokeLinecap="square"
        percent={calculatePercentage(auction.minPrice, auction.maxPrice, auction.currentPrice)}
        status="active"
        showInfo={false}
        strokeColor="#c214a7"
        className="o-70"
      />
      <div className="flex jcb ph3">
        <small className="basic">
          Ξ
          {' '}
          <small>{auction.maxPrice}</small>
        </small>
        <big className="db b f3 o-70">
          <span className="basic" style={{ color: '#FFB700' }}>
            Ξ
          </span>
          {' '}
          <span style={{ color: '#FFB700' }}>{auction.currentPrice}</span>
        </big>
        <small className="basic">
          Ξ
          {' '}
          <small>{auction.minPrice}</small>
        </small>
      </div>
      <div className="tc">
        <small>
          Lowest price on
          {auction.deadline && format(new Date(auction.deadline * 1000), ' do LLL')}
        </small>
      </div>

      <div className="flex col pa3 pb0 w-100">
        <MiniGemBox
          level={auction.level}
          grade={auction.gradeType}
          rate={auction.rate}
          market
        />
        <div className="flex aic o-70 mb2 w-100">
          <img
            src={auction.userImage}
            alt={auction.userName}
            className="h2 ma2"
          />
          <div className="db">
            <p className="pl2 ma0 truncate mw5">{auction.userName}</p>
          </div>
        </div>
      </div>
    </div>
  </Tilt>
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
