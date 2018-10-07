import React, { PureComponent } from 'react';
// import styled from 'styled-components';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { orderDashboardBy } from '../dashboardActions';
import { withStateMachine, State } from 'react-automata';
import { compose } from 'redux';
import { ReactComponent as DownArrowCircle } from '../../../app/images/svg/chevrons-down.svg';
import { ReactComponent as UpArrowCircle } from '../../../app/images/svg/chevrons-up.svg';

export const stateMachine = {
  initial: 'priceASC',
  states: {
    priceASC: {
      onEntry: 'orderByPrice',
      on: {
        // TOGGLE_RATE: 'rateASC',
        TOGGLE_TIME: 'timeASC',
        TOGGLE_PRICE: 'priceDESC'
      }
    },
    priceDESC: {
      onEntry: 'orderByPriceDesc',
      on: {
        // TOGGLE_RATE: 'rateASC',
        TOGGLE_TIME: 'timeASC',
        TOGGLE_PRICE: 'priceASC'
      }
    },
    timeASC: {
      onEntry: 'orderByTime',
      on: {
        TOGGLE_PRICE: 'priceASC',
        // TOGGLE_RATE: 'rateASC',
        TOGGLE_TIME: 'timeDESC'
      }
    },
    timeDESC: {
      onEntry: 'orderByTimeDesc',
      on: {
        TOGGLE_PRICE: 'priceASC',
        // TOGGLE_RATE: 'rateASC',
        TOGGLE_TIME: 'timeASC'
      }
    }
    // rateASC: {
    //   onEntry: 'orderByRate',
    //   on: {
    //     TOGGLE_PRICE: 'priceASC',
    //     TOGGLE_TIME: 'timeASC',
    //     TOGGLE_RATE: 'rateDESC'
    //   }
    // },
    // rateDESC: {
    //   onEntry: 'orderByRateDesc',
    //   on: {
    //     TOGGLE_PRICE: 'priceASC',
    //     TOGGLE_TIME: 'timeASC',
    //     TOGGLE_RATE: 'rateASC'
    //   }
    // }
  }
};

// const Primary = styled.section`
//   display: grid;
//   width: 100%;
//   grid-template-columns: 1fr 1fr;
// `;

class SortBox extends PureComponent {
  orderByTime = () => this.props.handleOrderBy('level', 'asc');
  orderByTimeDesc = () => this.props.handleOrderBy('level', 'desc');
  // orderByRate = () => this.props.handleOrderBy('rate', 'asc');
  // orderByRateDesc = () => this.props.handleOrderBy('rate', 'desc');
  orderByPrice = () => this.props.handleOrderBy('gradeType', 'asc');
  orderByPriceDesc = () => this.props.handleOrderBy('gradeType', 'desc');

  render() {
    const { transition, machineState } = this.props;

    return (
      <div className="flex jce aic w-100 pv4">
        <p
          className={`flex aic jcc pointer  mr4 white link  ${
            machineState.value === 'timeASC' ||
            machineState.value === 'timeDESC'
              ? 'o-90'
              : 'o-30'
          }`}
          onClick={() => transition('TOGGLE_TIME')}
        >
          BY LEVEL
          <State is="timeDESC">
            <UpArrowCircle
              className="ml2"
              onClick={() => transition('TOGGLE_TIME')}
            />
          </State>
          <State is="timeASC">
            <DownArrowCircle
              className="ml2"
              onClick={() => transition('TOGGLE_TIME')}
            />
          </State>
        </p>

        <p
          className={`flex aic jcc pointer  white link
  ${
    machineState.value === 'priceASC' || machineState.value === 'priceDESC'
      ? 'o-90'
      : 'o-30'
  }`}
          onClick={() => transition('TOGGLE_PRICE')}
        >
          BY GRADE
          <State is="priceDESC">
            <UpArrowCircle
              className="ml2"
              onClick={() => transition('TOGGLE_PRICE')}
            />
          </State>
          <State is="priceASC">
            <DownArrowCircle
              className="ml2"
              onClick={() => transition('TOGGLE_PRICE')}
            />
          </State>
        </p>
        {/* <p
          className={`flex aic jcc pointer white link ${
            machineState.value === 'rateASC' ||
            machineState.value === 'rateDESC'
              ? 'o-90'
              : 'o-30'
          }`}
          onClick={() => transition('TOGGLE_RATE')}
        >
          BY MINING RATE BONUS
          <State is="rateDESC">
            <UpArrowCircle
              className="ml2"
              onClick={() => transition('TOGGLE_RATE')}
            />
          </State>
          <State is="rateASC">
            <DownArrowCircle
              className="ml2"
              onClick={() => transition('TOGGLE_RATE')}
            />
          </State>
        </p> */}
      </div>
    );
  }
}

const actions = {
  handleOrderBy: orderDashboardBy
};

export default compose(
  connect(
    null,
    actions
  ),
  withStateMachine(stateMachine)
)(SortBox);
