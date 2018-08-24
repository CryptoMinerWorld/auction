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
      <AngleGradient className="tc bg-blue pa2 br3 shadow-3">
        <p className="b">Auction ends on</p>
        <time>{deadline}</time>
        <div className="flex jca pt2">
          <div className="pb2">
            <p className="f2 f1-l fw6 ma0">4</p>
            <small className="ttu b">days</small>
          </div>
          <div>
            <p className="f2 f1-l fw6 ma0">10</p>
            <small className="ttu b">hours</small>
          </div>
          <div>
            <p className="f2 f1-l fw6 ma0">22</p>
            <small className="ttu b">min</small>
          </div>
          <div>
            <p className="f2 f1-l fw6 ma0">40</p>
            <small className="ttu b">sec</small>
          </div>
        </div>
      </AngleGradient>
    );
  }
}

export default CountdownTimer;
