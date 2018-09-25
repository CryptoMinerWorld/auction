import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Slider from "antd/lib/slider";
import { connect } from "react-redux";
import { filterMarketplaceResults } from "../marketActions";

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
        <p className="ttu pv4">hide filters</p>
        <div>
          <div className=" pa3 mv4">
            <p>{`Only Show Levels ${level.min} to ${level.max}`}</p>
            <Slider
              range
              defaultValue={[level.min, level.max]}
              max={5}
              onChange={this.handleChange(`level`)}
              onAfterChange={this.finalFilter()}
            />
          </div>
          <div className="pa3 mv4">
            <p>{`Only Show Grade ${gradeType.min} to ${gradeType.max}`}</p>
            <Slider
              range
              defaultValue={[gradeType.min, gradeType.max]}
              max={5}
              onChange={this.handleChange(`gradeType`)}
              onAfterChange={this.finalFilter()}
            />
          </div>
          <div className="pa3 mv4">
            <p>{`Only Show Rates from ${rate.min} to ${rate.max}`}</p>
            <Slider
              range
              defaultValue={[rate.min, rate.max]}
              max={5}
              onChange={this.handleChange(`rate`)}
              onAfterChange={this.finalFilter()}
            />
          </div>
          <div className="pa3 mv4">
            <p>{`Only Show Prices from ${currentPrice.min} to ${
              currentPrice.max
            }`}</p>
            <Slider
              range
              defaultValue={[currentPrice.min, currentPrice.max]}
              max={10000000000000000000}
              onChange={this.handleChange(`currentPrice`)}
              onAfterChange={this.finalFilter()}
            />
          </div>
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
