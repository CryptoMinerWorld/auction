import React, { PureComponent } from 'react';
import gem1 from '../images/icons/gem1.png';
import gem2 from '../images/icons/gem2.png';
import gem3 from '../images/icons/gem3.png';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Feature = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  align-items: center;
`;

const Gem = ({ quality, image, amount }) => {
  return (
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
};

class Gembox extends PureComponent {
  static propTypes = {
    level: PropTypes.number.isRequired,
    grade: PropTypes.string.isRequired,
    rate: PropTypes.number.isRequired
  };

  gradeConverter = gradeValue => {
    switch (gradeValue) {
      case 1:
        return 'D';
        break;
      case 2:
        return 'C';
        break;
      case 3:
        return 'B';
        break;
      case 4:
        return 'A';
        break;
      case 5:
        return 'AA';
        break;
      case 6:
        return 'AAA';
        break;
      default:
        return '...';
    }
  };

  rateConverter = rate => Math.round((rate / 400) * 100);

  render() {
    let { level, grade, rate } = this.props;
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
