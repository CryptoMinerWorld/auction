import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const AngleGradient = styled.div`
  background: linear-gradient(45deg, #c018ab, #5f1763);
`;

class CountdownTimer extends PureComponent {
  static propTypes = { deadline: PropTypes.instanceOf(Date).isRequired };

  state = {};

  componentDidMount() {
    this.interval = setInterval(
      () =>
        this.setState({
          secondsLeft: this.props.deadline - Date.now()
        }),
      1000
    );
  }

  calculateTimeLeftInDays = seconds => seconds / (24 * 3600);

  calculateTimeLeftInHours = seconds => (seconds % (24 * 3600)) / 3600;

  calculateTimeLeftInMinutes = seconds => (seconds % (24 * 3600 * 3600)) / 60;

  calculateTimeLeftInSeconds = seconds => (seconds % (24 * 3600 * 3600)) / 60;

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    let { deadline } = this.props;
    console.log(this.calculateTimeLeftInDays(this.state.secondsLeft));

    return (
      <AngleGradient className="tc bg-blue pa2 br3 shadow-3">
        <p className="b">Auction ends on</p>
        <time className="measure">{deadline.toString()}</time>
        <div className="flex jca pt2">
          <div className="pb2">
            <p className="f2 f1-l fw6 ma0">
              {this.state.secondsLeft > 0
                ? Math.round(
                    this.calculateTimeLeftInDays(this.state.secondsLeft)
                  )
                : 0}
            </p>
            <small className="ttu b">
              {this.calculateTimeLeftInDays(this.state.secondsLeft) === 1
                ? 'day'
                : 'days'}
            </small>
          </div>
          <div>
            <p className="f2 f1-l fw6 ma0">
              {this.state.secondsLeft > 0
                ? Math.round(
                    this.calculateTimeLeftInHours(this.state.secondsLeft)
                  )
                : 0}
            </p>
            <small className="ttu b">
              {this.calculateTimeLeftInHours(this.state.secondsLeft) === 1
                ? 'hour'
                : 'hours'}
            </small>
          </div>
          <div>
            <p className="f2 f1-l fw6 ma0">
              {this.state.secondsLeft > 0
                ? Math.round(
                    this.calculateTimeLeftInMinutes(this.state.secondsLeft)
                  )
                : 0}
            </p>
            <small className="ttu b">
              {this.calculateTimeLeftInMinutes(this.state.secondsLeft) === 1
                ? 'minute'
                : 'minutes'}
            </small>
          </div>
          <div>
            <p className="f2 f1-l fw6 ma0">
              {this.state.secondsLeft > 0
                ? Math.round(
                    this.calculateTimeLeftInSeconds(this.state.secondsLeft)
                  )
                : 0}
            </p>
            <small className="ttu b">
              {this.state.secondsLeft === 1 ? 'second' : 'seconds'}
            </small>
          </div>
        </div>
      </AngleGradient>
    );
  }
}

export default CountdownTimer;
