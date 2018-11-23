import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import gem1 from '../app/images/icons/gem1.png';
import gem2 from '../app/images/icons/gem2.png';
import gem3 from '../app/images/icons/gem3.png';

class Gembox extends PureComponent {
  static propTypes = {
    level: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    grade: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    rate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    market: PropTypes.bool,
  };

  static defaultProps = {
    market: false,
    level: 2,
    grade: 2,
    rate: 2,
  };

  gradeConverter = gradeValue => ({
    1: 'D',
    2: 'C',
    3: 'B',
    4: 'A',
    5: 'AA',
    6: 'AAA',
  }[gradeValue]);

  render() {
    const {
      level, grade, rate, market,
    } = this.props;
    return (
      <div className="flex jcc">
        <Nugget quality="level" value={level} gem={gem2} market={market} />
        <Nugget quality="grade" value={this.gradeConverter(grade)} gem={gem1} market={market} />
        <Nugget quality="rate" value={rate} gem={gem3} market={market} />
      </div>
    );
  }
}

export default Gembox;

export const Gem = ({ quality, image, amount }) => (
  <div className="flex">
    <img src={image} alt={quality} className="h2 w-auto" />
    <p className="ttu f5 o-50 white tc pt1 b">
      {quality === 'rate' ? `+${amount.toFixed(2)}%` : amount}
    </p>
  </div>
);

Gem.propTypes = {
  quality: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

};

Gem.defaultProps = {
  quality: 1,
  image: 1,
  amount: 1,
};

const Nugget = ({
  quality, value, gem, market,
}) => (
  <div className="flex pr3 aic jca">
    {!market && <small className="ttu white dn-ns pl2">{quality}</small>}
    <Gem quality={quality} image={gem} amount={value} />
  </div>
);

Nugget.propTypes = {
  quality: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  gem: PropTypes.string.isRequired,
  market: PropTypes.bool.isRequired,
};

Nugget.defaultProps = {
  value: 1,
};
