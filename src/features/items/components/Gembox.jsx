import React, { PureComponent } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import gem1 from "../../../app/images/icons/gem1.png";
import gem2 from "../../../app/images/icons/gem2.png";
import gem3 from "../../../app/images/icons/gem3.png";

class Gembox extends PureComponent {
  static propTypes = {
    level: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    grade: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    rate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    styling: PropTypes.string
  };

  static defaultProps = {
    styling: "",
    level: 2,
    grade: 2,
    rate: 2
  };

  gradeConverter = gradeValue =>
    ({
      1: "D",
      2: "C",
      3: "B",
      4: "A",
      5: "AA",
      6: "AAA"
    }[gradeValue]);

  // rateConverter = rate => Math.round((rate / 400) * 100);

  render() {
    const { level, grade, rate, styling } = this.props;
    return (
      <div className={styling}>
        <div className="flex tc pa3">
          <Nugget quality="level" value={level} gem={gem2} />
          <Nugget
            quality="grade"
            value={this.gradeConverter(grade)}
            gem={gem1}
          />
          <Nugget quality="rate" value={rate} gem={gem3} />
        </div>
      </div>
    );
  }
}

export default Gembox;

const Feature = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  align-items: center;
`;

export const Gem = ({ quality, image, amount }) => (
  <Feature>
    <img
      src={image}
      alt={quality}
      style={{ gridColumn: "1 / -1", gridRow: "2" }}
      className="h3 center"
    />
    <p
      style={{ gridRow: 2, gridColumn: 2 }}
      className={`ttu f5 mt2 o-50 black tc pt1 b ${quality === "grade" &&
        "pr2"}`}
    >
      {quality === "rate" ? `+${amount.toFixed(2)}%` : amount}
    </p>
  </Feature>
);

Gem.propTypes = {
  quality: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

Gem.defaultProps = {
  quality: 1,
  image: 1,
  amount: 1
};

const Nugget = ({ quality, value, gem }) => (
  <div className="w-100">
    <small className="ttu white dn-ns">{quality}</small>
    <Gem quality={quality} image={gem} amount={value} />
  </div>
);

Nugget.propTypes = {
  quality: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  gem: PropTypes.string.isRequired
};

Nugget.defaultProps = {
  value: 1
};
