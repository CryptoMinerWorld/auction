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

class Gembox extends PureComponent {
  static propTypes = {
    level: PropTypes.array.isRequired,
    grade: PropTypes.string.isRequired,
    rate: PropTypes.number.isRequired
  };
  render() {
    let { level, grade, rate } = this.props;
    return (
      <div className="flex tc pa3">
        <div>
          <small>level</small>
          <Feature>
            <img
              src={gem1}
              alt=""
              style={{ gridColumn: '1 / -1', gridRow: '2' }}
            />
            <p style={{ gridRow: 2, gridColumn: 2 }}>{level}</p>
          </Feature>
        </div>
        <div>
          <small>grade</small>
          <Feature>
            <img
              src={gem2}
              alt=""
              style={{ gridColumn: '1 / -1', gridRow: '2' }}
            />
            <p style={{ gridRow: 2, gridColumn: 2 }} className="ttu black">
              {grade}
            </p>
          </Feature>
        </div>
        <div>
          <small>rate</small>

          <Feature>
            <img
              src={gem3}
              alt=""
              style={{ gridColumn: '1 / -1', gridRow: '2' }}
            />
            <p style={{ gridRow: 2, gridColumn: 2 }}>{rate}</p>
          </Feature>
        </div>
      </div>
    );
  }
}

export default Gembox;
