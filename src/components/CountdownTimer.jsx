import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import format from 'date-fns/format';

const AngleGradient = styled.div`
  background: linear-gradient(45deg, #c018ab, #5f1763);
`;

class CountdownTimer extends PureComponent {
  static propTypes = { deadline: PropTypes.number.isRequired };

  state = {
    timeLeft: '',
  };

  componentDidMount() {
    const { deadline } = this.props;

    this.interval = setInterval(
      () =>
        this.setState({
          timeLeft: (deadline * 1000) - new Date().getTime()
        }),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  calculateTimeLeftInDays = t => Math.floor(t / (1000 * 60 * 60 * 24));

  calculateTimeLeftInHours = t => Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  calculateTimeLeftInMinutes = t => Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));

  calculateTimeLeftInSeconds = t => Math.floor((t % (1000 * 60)) / 1000);

  render() {
    const { deadline } = this.props;
    const { timeLeft } = this.state;

    return (
      <AngleGradient className="tc bg-blue pa2 br3 shadow-3">
        <p className="b">Auction ends on</p>
        <time className="measure">{format(new Date(deadline * 1000), 'EEEE do of MMMM, p')}</time>
        {timeLeft !== '' && (
          <div className="flex jca pt2">
            <div className="pb2">
              <time className="f2 f1-l fw6 ma0 db" data-testid="daysLeft">
                {timeLeft > 0 ? this.calculateTimeLeftInDays(timeLeft) : 0}
              </time>

              <small className="ttu b" data-testid="daysUnit">
                {this.calculateTimeLeftInDays(timeLeft) === 1 ? 'day' : 'days'}
              </small>
            </div>
            <div>
              <time className="f2 f1-l fw6 ma0 db" data-testid="hoursLeft">
                {timeLeft > 0 ? this.calculateTimeLeftInHours(timeLeft) : 0}
              </time>
              <small className="ttu b">
                {this.calculateTimeLeftInHours(timeLeft) === 1 ? 'hour' : 'hours'}
              </small>
            </div>
            <div>
              <time className="f2 f1-l fw6 ma0 db" data-testid=" minutesLeft">
                {timeLeft > 0 ? this.calculateTimeLeftInMinutes(timeLeft) : 0}
              </time>
              <small className="ttu b">
                {this.calculateTimeLeftInMinutes(timeLeft) === 1 ? 'minute' : 'minutes'}
              </small>
            </div>
            <div>
              <time className="f2 f1-l fw6 ma0 db" data-testid="secondsLeft">
                {timeLeft > 0 ? this.calculateTimeLeftInSeconds(timeLeft) : 0}
              </time>
              <small className="ttu b">{timeLeft === 1 ? 'second' : 'seconds'}</small>
            </div>
          </div>
        )}
      </AngleGradient>
    );
  }
}

export default CountdownTimer;
