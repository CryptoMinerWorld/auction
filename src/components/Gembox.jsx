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


export const Gem = ({ quality, image, amount }) => (

  <Feature >
    <img
      src={image}
      alt={quality}
      style={{ gridColumn: '1 / -1', gridRow: '2' }}
      className="h3 center"
    />
    <p
      style={{ gridRow: 2, gridColumn: 2 }}
      className={`ttu f5 mt2 b o-50 black ${quality === 'grade' && 'pr2'}`}
    >
      {quality === 'rate' ? `${amount}%` : amount}
    </p>
  </Feature>

);

Gem.propTypes = {
  quality: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Gem.defaultProps = {
  quality: '',
  image: '',
  amount: '',
};

class Gembox extends PureComponent {
  static propTypes = {
    level: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    grade: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    rate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
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
        <div className="w-100">
          <small className="ttu white b dn-ns">level</small>
          <Gem quality="level" image={gem2} amount={level} />
        </div>
        <div className="w-100">
          <small className="ttu white b dn-ns">grade</small>
          <Gem quality="grade" image={gem1} amount={this.gradeConverter(grade)} />
        </div>
        <div className="w-100">
          <small className="ttu white b dn-ns">rate</small>
          <Gem quality="rate" image={gem3} amount={this.rateConverter(rate)} />
        </div>
      </div>
    );
  }
}

export default Gembox;
