import React, { PureComponent } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import gem1 from '../images/icons/gem1.png';
import gem2 from '../images/icons/gem2.png';
import gem3 from '../images/icons/gem3.png';

const Feature = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  align-items: center;
`;

const Gem = ({ quality, image, amount }) => (
  <div className="w-100">
    <small className="ttu white b dn-ns">{quality}</small>
    <Feature>
      <img
        src={image}
        alt={quality}
        style={{ gridColumn: '1 / -1', gridRow: '2' }}
        className="h3 center"
      />
      <p
        style={{ gridRow: 2, gridColumn: 2 }}
        className="ttu f5  b o-50 black"
      >
        {quality === 'rate' ? `${amount} %` : amount}
      </p>
    </Feature>
  </div>
);

Gem.propTypes = {
  quality: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
};

class Gembox extends PureComponent {
  static propTypes = {
    level: PropTypes.number.isRequired,
    grade: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    rate: PropTypes.number.isRequired,
  };

  gradeConverter = gradeValue => ({
    1: 'D',
    2: 'C',
    3: 'B',
    4: 'A',
    5: 'AA',
    6: 'AAA'
  }[gradeValue]);

  rateConverter = rate => Math.round((rate / 400) * 100);

  render() {
    const { level, grade, rate } = this.props;
    return (
      <div className="flex tc pa3">
        <Gem quality="level" image={gem1} amount={level} />
        <Gem quality="grade" image={gem2} amount={this.gradeConverter(grade)} />
        <Gem quality="rate" image={gem3} amount={this.rateConverter(rate)} />
      </div>
    );
  }
}

export default Gembox;
