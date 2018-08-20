import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const AngleGradient = styled.div`
  background: linear-gradient(45deg, #c018ab, #5f1763);
`;

class CountdownTimer extends PureComponent {
  static propTypes = { deadline: PropTypes.instanceOf(Date).isRequired };

  render() {
    let { deadline } = this.props;
    return (
      <AngleGradient className="tc bg-blue pa3 br3">
        <p>Auction ends on</p>
        <time>{deadline}</time>
        <div className="flex jca">
          <div>
            <p>4</p>
            <small>days</small>
          </div>
          <div>
            <p>10</p>
            <small>hours</small>
          </div>
          <div>
            <p>22</p>
            <small>min</small>
          </div>
          <div>
            <p>40</p>
            <small>sec</small>
          </div>
        </div>
      </AngleGradient>
    );
  }
}

export default CountdownTimer;
