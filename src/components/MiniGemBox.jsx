import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import gem1 from '../app/images/icons/gem1.png';
import gem2 from '../app/images/icons/gem2.png';
import gem3 from '../app/images/icons/gem3.png';
import {CutEdgesButton} from "../components/CutEdgesButton";
import {
    energyOutlineColor, energyPaneColor,
    gradeOutlineColor,
    gradePaneColors,
    levelOutlineColor,
    levelPaneColors, mrbOutlineColor, mrbPaneColor
} from "../features/plots/components/propertyPaneStyles";

class Gembox extends PureComponent {
  static propTypes = {
    level: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    grade: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    rate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    market: PropTypes.bool,
  };

  static defaultProps = {
    market: false,
    level: 2,
    grade: 2,
    rate: 2,
  };

  gradeConverter = gradeValue => ({
    1: 'D',
    2: 'C',
    3: 'B',
    4: 'A',
    5: 'AA',
    6: 'AAA',
  }[gradeValue]);

  render() {
    const {
      level, grade, rate, restingEnergy, market,
    } = this.props;
    return (
      <div className="flex jcv w-100">
          <CutEdgesButton
            outlineColor={gradeOutlineColor}
            backgroundColor={gradePaneColors(grade)}
            fontColor={gradeOutlineColor}
            edgeSizes={12}
            outlineWidth={2}
            fontSize={18}
            height={41}
            content={this.gradeConverter(grade)}
            otherStyles={"width: 43px; font-weight: bold;"}/>
          <CutEdgesButton
            outlineColor={levelOutlineColor}
            backgroundColor={levelPaneColors(level)}
            fontColor={levelOutlineColor}
            edgeSizes={12}
            outlineWidth={2}
            fontSize={18}
            height={41}
            content={level}
            otherStyles={"width: 43px; font-weight: bold;"}/>
          <CutEdgesButton
            outlineColor={mrbOutlineColor}
            backgroundColor={mrbPaneColor}
            fontColor={mrbOutlineColor}
            edgeSizes={[5, 12]}
            outlineWidth={2}
            fontSize={14}
            height={41}
            content={rate+"%"}
            otherStyles={"width: 70px; font-weight: bold;"}/>
          {restingEnergy && restingEnergy > 0 ?
          <CutEdgesButton
            outlineColor={energyOutlineColor}
            backgroundColor={energyPaneColor}
            fontColor={energyOutlineColor}
            edgeSizes={[5, 12]}
            outlineWidth={2}
            fontSize={14}
            height={41}
            content={formatRestingEnergy(restingEnergy)}
            otherStyles={"width: 70px; font-weight: bold;"}/> : ''
          }
      </div>
    );
  }
}

export default Gembox;

const formatRestingEnergy = (energy) => {
    return calculateEnergyInDays(energy) + "-" + calculateEnergyInHours(energy) + "-" + calculateEnergyInMinutes(energy)
};

const calculateEnergyInWeeks = t => Math.floor(t / (60 * 24 * 7))
const calculateEnergyInDays = t => Math.floor((t % (60 *24 * 7)) / (60 * 24));
const calculateEnergyInHours = t => Math.floor((t % (60 * 24)) / 60);
const calculateEnergyInMinutes = t => Math.floor(t % 60);

export const Gem = ({ quality, image, amount }) => (
  <div className="flex">
    <img src={image} alt={quality} className="h2 w-auto" />
    <p className="ttu f5 o-50 white tc pt1 b">
      {quality === 'rate' ? `+${amount.toFixed(2)}%` : amount}
    </p>
  </div>
);

Gem.propTypes = {
  quality: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

};

Gem.defaultProps = {
  quality: 1,
  image: 1,
  amount: 1,
};

const GradeBox = styled.div`
    flex: 1;
    background-color:;
`;

const LevelBox = styled.div`
    flex: 1;
`;

const RateBox = styled.div`
    flex: 2;
`;

const EnergyBox = styled.div`
    flex: 2;
`;

const Nugget = ({
  quality, value, gem, market,
}) => (
  <div className="flex pr3 aic jca">
    {!market && <small className="ttu white dn-ns pl2">{quality}</small>}
    <Gem quality={quality} image={gem} amount={value} />
  </div>
);

Nugget.propTypes = {
  quality: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  gem: PropTypes.string.isRequired,
  market: PropTypes.bool.isRequired,
};

Nugget.defaultProps = {
  value: 1,
};
