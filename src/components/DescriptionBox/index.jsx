import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import Waypoint from "react-waypoint";
import gem1 from "../../images/icons/gem1.png";
import gem2 from "../../images/icons/gem2.png";
import gem3 from "../../images/icons/gem3.png";
import tinyDiamond from "../../images/tinyDiamond.png";
import "./animations.css";
import logo from "../../images/Profile-Image-Logo-60x60.png";
import { Gem } from "../Gembox";

class DescriptionBox extends PureComponent {
  static propTypes = {
    level: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    grade: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    rate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    story: PropTypes.string.isRequired
  };

  state = {
    inView: false
  };

  componentDidMount() {
    this.fireAnimationImmediatelyOnMobileOrMassiveScreens(
      window.screen.availWidth
    );
  }

  fireAnimationImmediatelyOnMobileOrMassiveScreens = width => {
    const massiveScreens = width >= 1920;
    const mobileScreens = width <= 780;

    if (massiveScreens || mobileScreens) {
      this.setState({ inView: true });
    }
  };

  handleWaypointEnter = ({ previousPosition }) => {
    if (previousPosition === Waypoint.below) {
      this.setState({ inView: true });
    }
  };

  rateConverter = rate => Math.round((rate / 400) * 100);

  gradeConverter = gradeValue =>
    ({
      1: "D",
      2: "C",
      3: "B",
      4: "A",
      5: "AA",
      6: "AAA"
    }[gradeValue]);

  render() {
    const { level, grade, rate, name, story } = this.props;
    const { inView } = this.state;
    return (
      <div className="bg-off-black white ma0 ">
        <div className="flex-l jce mw9 center">
          <div className="w-60-l pl5-l">
            <div className="pa5-ns pa3">
              <div className="flex jcb aic">
                <div className="flex aic tc tl-ns">
                  <img
                    src={tinyDiamond}
                    alt="tiny decorative orange triangle"
                    className="dib mr3"
                  />
                  <h1 className="dib b white">{name}</h1>
                  <img
                    src={tinyDiamond}
                    alt="tiny decorative orange triangle"
                    className="dib ml3"
                  />
                </div>
                <div
                  className="flex aic bg-white-10 w5-ns w-auto black h-auto pa1"
                  style={{
                    clipPath:
                      "polygon(5% 0, 97% 1%, 100% 19%, 100% 81%, 95% 100%, 5% 99%, 0 84%, 0 16%)"
                  }}
                >
                  <img
                    src={logo}
                    alt="seller logo"
                    className="br-100 h2 pl3-ns"
                  />
                  <small className="pl3 white-60 dn dib-m dib-l">
                    <span className="dn dib-l">Sold By {""}</span> CryptoMiner
                    World
                  </small>
                </div>
              </div>
              <p className="o-50">{story}</p>
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
                        bgColour="bg-dark-blue"
                        gem={gem1}
                        category="grade"
                        amount={this.gradeConverter(grade)}
                        description="A Gem’s Grade determines how fast it can mine. There are 6 Grades, D, C, B, A, AA, and AAA. Grade As and better all store Resting Energy when they are not mining!"
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
                        bgColour="bg-dark-orange"
                        gem={gem2}
                        category="level"
                        amount={level}
                        description="A Gem’s level determines how far down that Gem can mine. There are 5 tiers of land and 5 levels of gems. Each successive level allows for another type of land to be mined."
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
                        bgColour="bg-dark-purple"
                        gem={gem3}
                        category="mining rate Bonus"
                        amount={`${this.rateConverter(rate)}%`}
                        description="This is the percentage of how much faster a Gem mines compared to the base speed. +100% is twice as fast as base, +400% is five times faster. All Mining Rate Bonuses are tied to Grades. Grades give you a general sense of how how fast a Gem mines but Mining Rate Bonuses tells you exactly how much fast it is."
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

export const FeatureBand = ({
  bgColour,
  gem,
  category,
  amount,
  description
}) => (
  <div className="relative">
    <div
      className={`w-100 ${bgColour} h-auto flex aic jcb mt3 br--left-ns pa3 pl5-ns`}
      style={{
        clipPath:
          window.screen.availWidth >= 1920
            ? "polygon(0 84%, 1% 96%, 5% 100%, 97% 100%, 99% 97%, 100% 90%, 100% 14%, 99% 4%, 96% 0, 5% 0%, 1% 2%, 0 12%)"
            : "polygon(0 84%, 1% 96%, 5% 100%, 97% 100%, 100% 100%, 100% 90%, 100% 14%, 100% 0, 96% 0, 5% 0%, 1% 2%, 0 12%)"
      }}
    >
      <Gem quality={category} image={gem} amount={amount} styling="w-20" />
      <div className="w-80 pl3 pl0-nsa">
        <p className="b ttu">{category}</p>
        <p className=" pr4-ns">{description}</p>
      </div>
    </div>
  </div>
);

FeatureBand.propTypes = {
  bgColour: PropTypes.string.isRequired,
  gem: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  description: PropTypes.string.isRequired
};

FeatureBand.defaultProps = {
  clip: null
};
