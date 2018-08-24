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
      <p style={{ gridRow: 2, gridColumn: 2 }} className="ttu f3  b o-50 black">
        {amount}
      </p>
    </Feature>
  </div>
);

class Gembox extends PureComponent {
  static propTypes = {
    level: PropTypes.number.isRequired,
    grade: PropTypes.string.isRequired,
    rate: PropTypes.number.isRequired
  };
  render() {
    let { level, grade, rate } = this.props;
    return (
      <div className="flex tc pa3">
        <Gem quality="level" image={gem1} amount={level} />
        <Gem quality="grade" image={gem2} amount={grade} />
        <Gem quality="rate" image={gem3} amount={rate} />
      </div>
    );
  }
}

export default Gembox;
