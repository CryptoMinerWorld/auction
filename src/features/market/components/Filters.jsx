import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Slider from "antd/lib/slider";
import { connect } from "react-redux";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { filterMarketplaceResults } from "../marketActions";
import { weiToEth } from "../helpers";

class Filters extends PureComponent {
  static propTypes = {};

  state = {
    level: {
      min: 0,
      max: 3
    },
    gradeType: {
      min: 0,
      max: 3
    },
    rate: {
      min: 0,
      max: 3
    },
    currentPrice: {
      min: 0,
      max: 10000000000000000000
    }
  };

  handleChange = filterName => values =>
    this.setState({ [filterName]: { min: values[0], max: values[1] } });

  finalFilter = () => () => {
    const { handleFilterMarketResults } = this.props;
    handleFilterMarketResults(this.state);
  };

  render() {
    const { level, gradeType, rate, currentPrice } = this.state;
    return (
      <div>
        <p className="ttu pv4 pl4">hide filters</p>
        <div>
          <ReactCSSTransitionGroup
            transitionName="example1"
            transitionAppear
            transitionAppearTimeout={5000}
            transitionEnterTimeout={5000}
            transitionLeaveTimeout={5000}
          >
            <div
              className="pa3 mv4 bg-dark-pink relative left-2 pl4"
              style={{
                clipPath:
                  window.screen.availWidth >= 1920
                    ? "polygon(0 84%, 1% 96%, 5% 100%, 97% 100%, 99% 97%, 100% 90%, 100% 14%, 99% 4%, 96% 0, 5% 0%, 1% 2%, 0 12%)"
                    : "polygon(0 84%, 1% 96%, 5% 100%, 97% 100%, 100% 100%, 100% 90%, 100% 14%, 100% 0, 96% 0, 5% 0%, 1% 2%, 0 12%)"
              }}
            >
              <p>{`Only Show Levels ${level.min} to ${level.max}`}</p>
              <Slider
                range
                defaultValue={[level.min, level.max]}
                max={5}
                className="red"
                onChange={this.handleChange(`level`)}
                onAfterChange={this.finalFilter()}
              />
            </div>
          </ReactCSSTransitionGroup>
          <ReactCSSTransitionGroup
            transitionName="example2"
            transitionAppear
            transitionAppearTimeout={5000}
            transitionEnterTimeout={5000}
            transitionLeaveTimeout={5000}
          >
            <div
              className="pa3 mv4 bg-dark-purple relative left-2 pl4"
              style={{
                clipPath:
                  window.screen.availWidth >= 1920
                    ? "polygon(0 84%, 1% 96%, 5% 100%, 97% 100%, 99% 97%, 100% 90%, 100% 14%, 99% 4%, 96% 0, 5% 0%, 1% 2%, 0 12%)"
                    : "polygon(0 84%, 1% 96%, 5% 100%, 97% 100%, 100% 100%, 100% 90%, 100% 14%, 100% 0, 96% 0, 5% 0%, 1% 2%, 0 12%)"
              }}
            >
              <p>{`Only Show Grade ${gradeType.min} to ${gradeType.max}`}</p>
              <Slider
                range
                defaultValue={[gradeType.min, gradeType.max]}
                max={5}
                onChange={this.handleChange(`gradeType`)}
                onAfterChange={this.finalFilter()}
              />
            </div>
          </ReactCSSTransitionGroup>
          <ReactCSSTransitionGroup
            transitionName="example3"
            transitionAppear
            transitionAppearTimeout={5000}
            transitionEnterTimeout={5000}
            transitionLeaveTimeout={5000}
          >
            <div
              className="pa3 mv4 bg-dark-blue relative left-2 pl4"
              style={{
                clipPath:
                  window.screen.availWidth >= 1920
                    ? "polygon(0 84%, 1% 96%, 5% 100%, 97% 100%, 99% 97%, 100% 90%, 100% 14%, 99% 4%, 96% 0, 5% 0%, 1% 2%, 0 12%)"
                    : "polygon(0 84%, 1% 96%, 5% 100%, 97% 100%, 100% 100%, 100% 90%, 100% 14%, 100% 0, 96% 0, 5% 0%, 1% 2%, 0 12%)"
              }}
            >
              <p>{`Only Show Rates from ${rate.min} to ${rate.max}`}</p>
              <Slider
                range
                defaultValue={[rate.min, rate.max]}
                max={5}
                onChange={this.handleChange(`rate`)}
                onAfterChange={this.finalFilter()}
              />
            </div>
          </ReactCSSTransitionGroup>
          <ReactCSSTransitionGroup
            transitionName="example3"
            transitionAppear
            transitionAppearTimeout={5000}
            transitionEnterTimeout={5000}
            transitionLeaveTimeout={5000}
          >
            <div
              className="pa3 mv4 bg-dark-orange relative left-2 pl4"
              style={{
                clipPath:
                  window.screen.availWidth >= 1920
                    ? "polygon(0 84%, 1% 96%, 5% 100%, 97% 100%, 99% 97%, 100% 90%, 100% 14%, 99% 4%, 96% 0, 5% 0%, 1% 2%, 0 12%)"
                    : "polygon(0 84%, 1% 96%, 5% 100%, 97% 100%, 100% 100%, 100% 90%, 100% 14%, 100% 0, 96% 0, 5% 0%, 1% 2%, 0 12%)"
              }}
            >
              <p>{`Only Show Prices from ${weiToEth(
                currentPrice.min
              )} to ${weiToEth(currentPrice.max)}`}</p>
              <Slider
                range
                defaultValue={[currentPrice.min, currentPrice.max]}
                max={10000000000000000000}
                onChange={this.handleChange(`currentPrice`)}
                onAfterChange={this.finalFilter()}
              />
            </div>
          </ReactCSSTransitionGroup>
        </div>
      </div>
    );
  }
}

const actions = {
  handleFilterMarketResults: filterMarketplaceResults
};

export default connect(
  null,
  actions
)(Filters);

Filters.propTypes = { handleFilterMarketResults: PropTypes.func.isRequired };
