import React, { PureComponent } from 'react';
import styled from 'styled-components';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { orderMarketBy } from '../marketActions';
import { withStateMachine, State } from 'react-automata';
import { compose } from 'redux';
import { ReactComponent as DownArrowCircle } from '../../../app/images/svg/chevrons-down.svg';
import { ReactComponent as UpArrowCircle } from '../../../app/images/svg/chevrons-up.svg';

import { ReactComponent as TrendingDown } from '../../../app/images/svg/chevrons-down.svg';
import { ReactComponent as TrendingUp } from '../../../app/images/svg/chevrons-up.svg';

import { ReactComponent as ChevronsDown } from '../../../app/images/svg/chevrons-down.svg';
import { ReactComponent as ChevronsUp } from '../../../app/images/svg/chevrons-up.svg';
const stateMachine = {
  initial: 'priceASC',
  states: {
    priceASC: {
      onEntry: 'orderByPrice',
      on: {
        TOGGLE_RATE: 'rateASC',
        TOGGLE_TIME: 'timeASC',
        TOGGLE_PRICE: 'priceDESC'
      }
    },
    priceDESC: {
      onEntry: 'orderByPriceDesc',
      on: {
        TOGGLE_RATE: 'rateASC',
        TOGGLE_TIME: 'timeASC',
        TOGGLE_PRICE: 'priceASC'
      }
    },
    timeASC: {
      onEntry: 'orderByTime',
      on: {
        TOGGLE_PRICE: 'priceASC',
        TOGGLE_RATE: 'rateASC',
        TOGGLE_TIME: 'timeDESC'
      }
    },
    timeDESC: {
      onEntry: 'orderByTimeDesc',
      on: {
        TOGGLE_PRICE: 'priceASC',
        TOGGLE_RATE: 'rateASC',
        TOGGLE_TIME: 'timeASC'
      }
    },
    rateASC: {
      onEntry: 'orderByRate',
      on: {
        TOGGLE_PRICE: 'priceASC',
        TOGGLE_TIME: 'timeASC',
        TOGGLE_RATE: 'rateDESC'
      }
    },
    rateDESC: {
      onEntry: 'orderByRateDesc',
      on: {
        TOGGLE_PRICE: 'priceASC',
        TOGGLE_TIME: 'timeASC',
        TOGGLE_RATE: 'rateASC'
      }
    }
  }
};

const Primary = styled.section`
  display: flex;
  width: 100%;
`;

class SortBox extends PureComponent {
  orderByPrice = () => this.props.handleOrderBy('currentPrice', 'asc');
  orderByPriceDesc = () => this.props.handleOrderBy('currentPrice', 'desc');
  orderByTime = () => this.props.handleOrderBy('deadline', 'asc');
  orderByTimeDesc = () => this.props.handleOrderBy('deadline', 'desc');
  orderByRate = () => this.props.handleOrderBy('rate', 'asc');
  orderByRateDesc = () => this.props.handleOrderBy('rate', 'desc');

  render() {
    const { transition, machineState } = this.props;
    return (
      <Primary className="pv4 ">
        <p
          className={`flex aic jcs pointer mr5 white link hover-gold
  ${
    machineState.value === 'priceASC' || machineState.value === 'priceDESC'
      ? 'o-90'
      : 'o-30'
  }`}
          onClick={() => transition('TOGGLE_PRICE')}
        >
          BY PRICE
          <State is="priceASC">
            <UpArrowCircle
              className="ml2"
              onClick={() => transition('TOGGLE_PRICE')}
            />
          </State>
          <State is="priceDESC">
            <DownArrowCircle
              className="ml2"
              onClick={() => transition('TOGGLE_PRICE')}
            />
          </State>
        </p>
        <p
          className={`flex aic jcc pointer  mr5 white link hover-time-purple ${
            machineState.value === 'timeASC' ||
            machineState.value === 'timeDESC'
              ? 'o-90'
              : 'o-30'
          }`}
          onClick={() => transition('TOGGLE_TIME')}
        >
          BY TIME
          <State is="timeASC">
            <ChevronsUp
              className="ml2"
              onClick={() => transition('TOGGLE_TIME')}
            />
          </State>
          <State is="timeDESC">
            <ChevronsDown
              className="ml2"
              onClick={() => transition('TOGGLE_TIME')}
            />
          </State>
        </p>
        <p
          className={`flex aic jcc pointer mr5 white link hover-light-purple ${
            machineState.value === 'rateASC' ||
            machineState.value === 'rateDESC'
              ? 'o-90'
              : 'o-30'
          }`}
          onClick={() => transition('TOGGLE_RATE')}
        >
          BY MINING RATE BONUS
          <State is="rateASC">
            <TrendingUp
              className="ml2"
              onClick={() => transition('TOGGLE_RATE')}
            />
          </State>
          <State is="rateDESC">
            <TrendingDown
              className="ml2"
              onClick={() => transition('TOGGLE_RATE')}
            />
          </State>
        </p>
      </Primary>
    );
  }
}

const actions = {
  handleOrderBy: orderMarketBy
};

export default compose(
  connect(
    null,
    actions
  ),
  withStateMachine(stateMachine)
)(SortBox);
