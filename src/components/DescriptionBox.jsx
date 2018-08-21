import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import gem1 from '../images/icons/gem1.png';
import gem2 from '../images/icons/gem2.png';
import gem3 from '../images/icons/gem3.png';
import styled from 'styled-components';

const TopHighlight = styled.div`
  background: linear-gradient(to right, #e36d2d, #b91a78);
  border-radius: 4px 4px 0px 0px;
  height: 3px;
`;
class DescriptionBox extends PureComponent {
  static propTypes = {
    level: PropTypes.number.isRequired,
    grade: PropTypes.string.isRequired,
    rate: PropTypes.number.isRequired
  };

  render() {
    let { level, grade, rate } = this.props;
    return (
      <div className="bg-off-black white ma0">
        <TopHighlight />
        <div className="flex-ns jce">
          <div className="w-50-ns ">
            <div className="pa5-ns pa3">
              <h1>Amethyst Thingymagij</h1>
              <p>
                Click anywhere on teh line to place a bid or click on the giant
                buy now button above to buy at the current price.Click anywhere
                on teh line to place a bid or click on the giant buy now button
                above to buy at the current price.
              </p>
            </div>
            <FeatureBand
              colour="bg-dark-orange"
              gem={gem1}
              category="level"
              amount={level}
              description="Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
            />
            <FeatureBand
              colour="bg-dark-blue"
              gem={gem2}
              category="grade"
              amount={grade}
              description="Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
            />
            <FeatureBand
              colour="bg-dark-purple"
              gem={gem3}
              category="mining rate"
              amount={rate}
              description="Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
            />
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

const FeatureBand = ({ colour, gem, category, amount, description }) => {
  return (
    <div className={`w-100 ${colour} h4 flex aic mt3 br4-ns br--left`}>
      <div className="w-30 ">
        <Feature>
          <img
            src={gem}
            alt=""
            style={{ gridColumn: '1 / -1', gridRow: '2' }}
          />
          <p style={{ gridRow: 2, gridColumn: 2 }} className="ttu black">
            {amount}
          </p>
        </Feature>
      </div>
      <div className="w-70 ml4">
        <p className="b ttu">{category}</p>
        <p>{description}</p>
      </div>
    </div>
  );
};
