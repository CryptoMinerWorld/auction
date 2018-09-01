import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Waypoint from 'react-waypoint';
import gem1 from '../../images/icons/gem1.png';
import gem2 from '../../images/icons/gem2.png';
import gem3 from '../../images/icons/gem3.png';
import tinyDiamond from '../../images/tinyDiamond.png';
import './animations.css';


class DescriptionBox extends PureComponent {
  static propTypes = {
    level: PropTypes.number.isRequired,
    grade: PropTypes.string.isRequired,
    rate: PropTypes.number.isRequired
  };

  state = {
    inView: false
  };

  handleWaypointEnter = ({ previousPosition }) => {
    if (previousPosition === Waypoint.below) {
      this.setState({ inView: true });
    }
  };

  rateConverter = rate => Math.round((rate / 400) * 100);

  render() {
    const { level, grade, rate } = this.props;
    const { inView } = this.state
    return (
      <div className="bg-off-black white ma0 ">
        <div className="flex-l jce mw9 center">
          <div className="w-50-l">
            <div className="pa5-ns pa3">
              <div className="flex aic tc tl-ns">
                <img
                  src={tinyDiamond}
                  alt="tiny decorative orange triangle"
                  className="dib mr3"
                />
                <h1 className="dib b white">Amethyst Thingymagij</h1>
                <img
                  src={tinyDiamond}
                  alt="tiny decorative orange triangle"
                  className="dib ml3"
                />
              </div>
              <p className="o-50">
                Click anywhere on teh line to place a bid or click on the giant
                buy now button above to buy at the current price.Click anywhere
                on teh line to place a bid or click on the giant buy now button
                above to buy at the current price.
              </p>
            </div>
            <Waypoint onEnter={this.handleWaypointEnter}>
              <div>
                {inView && (
                  <div>
                    <ReactCSSTransitionGroup
                      transitionName="example1"
                      transitionAppear
                      transitionAppearTimeout={5000}
                      transitionEnterTimeout={5000}
                      transitionLeaveTimeout={5000}
                    >
                      <FeatureBand
                        colour="bg-dark-orange"
                        gem={gem1}
                        category="level"
                        amount={level}
                        description="Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                      />
                    </ReactCSSTransitionGroup>
                    <ReactCSSTransitionGroup
                      transitionName="example2"
                      transitionAppear
                      transitionAppearTimeout={5000}
                      transitionEnterTimeout={5000}
                      transitionLeaveTimeout={5000}
                    >
                      <FeatureBand
                        colour="bg-dark-blue"
                        gem={gem2}
                        category="grade"
                        amount={grade}
                        description="Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                      />
                    </ReactCSSTransitionGroup>
                    <ReactCSSTransitionGroup
                      transitionName="example3"
                      transitionAppear
                      transitionAppearTimeout={5000}
                      transitionEnterTimeout={5000}
                      transitionLeaveTimeout={5000}
                    >
                      <FeatureBand
                        colour="bg-dark-purple"
                        gem={gem3}
                        category="mining rate"
                        amount={`${this.rateConverter(rate)} %`}
                        description="Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                      />
                    </ReactCSSTransitionGroup>
                  </div>
                )}
              </div>
            </Waypoint>
          </div>
        </div>
      </div>
    );
  }
}

export default DescriptionBox;

const Feature = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  align-items: center;
`;

const FeatureBand = ({ colour, gem, category, amount, description }) =>
  <div
    className={`w-100 ${colour} h4 flex aic mt3 br4-ns br--left-ns shadow-3`}
  >
    <div className="w-30 ">
      <Feature>
        <img
          src={gem}
          alt={category}
          style={{ gridColumn: '1 / -1', gridRow: '2' }}
          className="h3 center"
        />
        <p
          style={{ gridRow: 2, gridColumn: 2 }}
          className="ttu f4 b o-50 black tc"
        >
          {amount}
        </p>
      </Feature>
    </div>
    <div className="w-70">
      <p className="b ttu">{category}</p>
      <p className="measure-ns pr4-ns">{description}</p>
    </div>
  </div>

FeatureBand.propTypes = {
  colour: PropTypes.number.isRequired, gem: PropTypes.number.isRequired, category: PropTypes.number.isRequired, amount: PropTypes.number.isRequired, description: PropTypes.string.isRequired
};

