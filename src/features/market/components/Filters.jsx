import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Slider from "antd/lib/slider";
import { connect } from "react-redux";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import Icon from "antd/lib/icon";
import { filterMarketplaceResults } from "../marketActions";
import { weiToEth, gradeConverter } from "../helpers";

const Loading1 = () => (
  <Icon type="loading" style={{ fontSize: 24, color: "#bb207e" }} spin />
);

const Loading2 = () => (
  <Icon type="loading" style={{ fontSize: 24, color: "#765495" }} spin />
);

const Loading3 = () => (
  <Icon type="loading" style={{ fontSize: 24, color: "#5073c7" }} spin />
);

const Loading4 = () => (
  <Icon type="loading" style={{ fontSize: 24, color: "#d9a06c" }} spin />
);

const select = store => ({
  filterLoading: store.marketActions.filterLoading
});

class Filters extends PureComponent {
  static propTypes = {};

  state = {
    level: {
      min: 0,
      max: 3
    },
    gradeType: {
      min: 1,
      max: 3
    },
    rate: {
      min: 0,
      max: 400
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
    const { filterLoading } = this.props;
    return (
      <div>
        <p className="ttu pv4 pl4">{/* hide filters */}</p>
        <div>
          <ReactCSSTransitionGroup
            transitionName="example1"
            transitionAppear
            transitionAppearTimeout={5000}
            transitionEnterTimeout={5000}
            transitionLeaveTimeout={5000}
          >
            <div
              className="pa3 mv4 bg-dark-pink-50 relative left-2 pl4 b"
              style={{
                clipPath:
                  window.screen.availWidth >= 1920
                    ? "polygon(0 84%, 1% 96%, 5% 100%, 97% 100%, 99% 97%, 100% 90%, 100% 14%, 99% 4%, 96% 0, 5% 0%, 1% 2%, 0 12%)"
                    : "polygon(0 84%, 1% 96%, 5% 100%, 97% 100%, 100% 100%, 100% 90%, 100% 14%, 100% 0, 96% 0, 5% 0%, 1% 2%, 0 12%)"
              }}
            >
              <div>
                {filterLoading ? (
                  <div className="w-100 flex jcc pv4">
                    <Loading1 />
                  </div>
                ) : (
                  <div>
                    <p className="o-60">Only Show </p>
                    <p>
                      <span className="o-60">Levels </span>
                      <span className=" f3" style={{ color: "#bb207e" }}>{`${
                        level.min
                      }`}</span>{" "}
                      <span className="o-60"> to </span>
                      <span className=" f3" style={{ color: "#bb207e" }}>{`${
                        level.max
                      }`}</span>
                    </p>
                  </div>
                )}
                <Slider
                  range
                  defaultValue={[level.min, level.max]}
                  max={5}
                  className="slider1"
                  onChange={this.handleChange(`level`)}
                  onAfterChange={this.finalFilter()}
                />
              </div>
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
              className="pa3 mv4 bg-dark-purple-50 relative left-2 pl4 b"
              style={{
                clipPath:
                  window.screen.availWidth >= 1920
                    ? "polygon(0 84%, 1% 96%, 5% 100%, 97% 100%, 99% 97%, 100% 90%, 100% 14%, 99% 4%, 96% 0, 5% 0%, 1% 2%, 0 12%)"
                    : "polygon(0 84%, 1% 96%, 5% 100%, 97% 100%, 100% 100%, 100% 90%, 100% 14%, 100% 0, 96% 0, 5% 0%, 1% 2%, 0 12%)"
              }}
            >
              {filterLoading ? (
                <div className="w-100 flex jcc pv4">
                  <Loading2 />
                </div>
              ) : (
                <div>
                  <p className="o-60">Only Show </p>
                  <p>
                    <span className="o-60">Grade </span>
                    <span
                      className=" f3"
                      style={{ color: "#765495" }}
                    >{`${gradeConverter(gradeType.min)}`}</span>{" "}
                    <span className="o-60"> to </span>
                    <span
                      className=" f3"
                      style={{ color: "#765495" }}
                    >{`${gradeConverter(gradeType.max)}`}</span>
                  </p>
                </div>
              )}

              <Slider
                range
                defaultValue={[gradeType.min, gradeType.max]}
                max={6}
                min={1}
                onChange={this.handleChange(`gradeType`)}
                onAfterChange={this.finalFilter()}
                className="slider2"
                tipFormatter={val => gradeConverter(val)}
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
              className="pa3 mv4 bg-dark-blue-50 relative left-2 pl4 b"
              style={{
                clipPath:
                  window.screen.availWidth >= 1920
                    ? "polygon(0 84%, 1% 96%, 5% 100%, 97% 100%, 99% 97%, 100% 90%, 100% 14%, 99% 4%, 96% 0, 5% 0%, 1% 2%, 0 12%)"
                    : "polygon(0 84%, 1% 96%, 5% 100%, 97% 100%, 100% 100%, 100% 90%, 100% 14%, 100% 0, 96% 0, 5% 0%, 1% 2%, 0 12%)"
              }}
            >
              {filterLoading ? (
                <div className="w-100 flex jcc pv4">
                  <Loading3 />
                </div>
              ) : (
                <div>
                  <p className="o-60">Only Show </p>
                  <p>
                    <span className="o-60">Rates from </span>
                    <span className=" f3" style={{ color: "#5073c7" }}>{`${
                      rate.min
                    }`}</span>{" "}
                    <span className="o-60"> to </span>
                    <span className=" f3" style={{ color: "#5073c7" }}>{`${
                      rate.max
                    }`}</span>
                  </p>
                </div>
              )}

              <Slider
                range
                defaultValue={[rate.min, rate.max]}
                max={400}
                onChange={this.handleChange(`rate`)}
                onAfterChange={this.finalFilter()}
                className="slider3"
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
              className="pa3 mv4 bg-dark-orange-50 relative left-2 pl4 b "
              style={{
                clipPath:
                  window.screen.availWidth >= 1920
                    ? "polygon(0 84%, 1% 96%, 5% 100%, 97% 100%, 99% 97%, 100% 90%, 100% 14%, 99% 4%, 96% 0, 5% 0%, 1% 2%, 0 12%)"
                    : "polygon(0 84%, 1% 96%, 5% 100%, 97% 100%, 100% 100%, 100% 90%, 100% 14%, 100% 0, 96% 0, 5% 0%, 1% 2%, 0 12%)"
              }}
            >
              {filterLoading ? (
                <div className="w-100 flex jcc pv4">
                  <Loading4 />
                </div>
              ) : (
                <div>
                  <p className="o-60">Only Show Prices from </p>
                  <p>
                    <span className="basic">Ξ </span>
                    <span
                      className=" f3"
                      style={{ color: "#d9a06c" }}
                    >{`${weiToEth(currentPrice.min)}`}</span>{" "}
                    <span className="o-60"> to </span>
                    <span className="basic">Ξ </span>
                    <span
                      className=" f3"
                      style={{ color: "#d9a06c" }}
                    >{`${weiToEth(currentPrice.max)}`}</span>
                  </p>
                </div>
              )}

              <Slider
                range
                defaultValue={[currentPrice.min, currentPrice.max]}
                max={10000000000000000000}
                onChange={this.handleChange(`currentPrice`)}
                onAfterChange={this.finalFilter()}
                className="slider4"
                tipFormatter={val => weiToEth(val)}
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
  select,
  actions
)(Filters);

Filters.propTypes = {
  handleFilterMarketResults: PropTypes.func.isRequired,
  filterLoading: PropTypes.bool.isRequired
};
