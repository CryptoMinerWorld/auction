import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';

const gradientAndShape = {
  background: 'linear-gradient(45deg, #ff35c6,#c018ab)',

  WebkitClipPath:
    'polygon(4.46% -0.15%, 96.33% 0px, 100.22% 11.24%, 100% 86.58%, 98.1% 97.17%, 93.09% 100.5%, 3.94% 100.25%, -1px 90.05%, -0.09% 8.97%)',
  clipPath:
    'polygon(4.46% -0.15%, 96.33% 0px, 100.22% 11.24%, 100% 86.58%, 98.1% 97.17%, 93.09% 100.5%, 3.94% 100.25%, -1px 90.05%, -0.09% 8.97%)',
};

class CountdownTimer extends PureComponent {
  static propTypes = {
    deadline: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      message: PropTypes.string.isRequired,
  };

  state = {
    timeLeft: '',
  };

  componentDidMount() {
    const { deadline } = this.props;

    this.interval = setInterval(
      () => this.setState({
        timeLeft: Math.round(deadline * 1000 - new Date().getTime()),
      }),
      1000,
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
    const { deadline, message} = this.props;
    const { timeLeft } = this.state;

    return (
      <div className="tc pa2" style={gradientAndShape}>
        <p className="b">{message}</p>
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
                {this.calculateTimeLeftInMinutes(timeLeft) === 1 ? 'min' : 'mins'}
              </small>
            </div>
            <div>
              <time className="f2 f1-l fw6 ma0 db" data-testid="secondsLeft">
                {timeLeft > 0 ? this.calculateTimeLeftInSeconds(timeLeft) : 0}
              </time>
              <small className="ttu b">{timeLeft === 1 ? 'sec' : 'secs'}</small>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default CountdownTimer;
