import React, { PureComponent } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStateMachine, State } from 'react-automata';
import { compose } from 'redux';
import { orderMarketBy } from '../marketActions';
import { ReactComponent as ChevronsDown } from '../../../app/images/svg/chevrons-down.svg';
import { ReactComponent as ChevronsUp } from '../../../app/images/svg/chevrons-up.svg';
import { ReactComponent as Dollar } from '../../../app/images/svg/dollar-sign.svg';
import { ReactComponent as Clock } from '../../../app/images/svg/clock.svg';
import { ReactComponent as Percent } from '../../../app/images/svg/percent.svg';

const stateMachine = {
  initial: 'noOrderBy',
  states: {
    noOrderBy: {
        on: {
            TOGGLE_RATE: 'rateASC',
            TOGGLE_TIME: 'timeASC',
            TOGGLE_PRICE: 'priceDESC',
        },
    },
    priceASC: {
      onEntry: 'orderByPrice',
      on: {
        TOGGLE_RATE: 'rateASC',
        TOGGLE_TIME: 'timeASC',
        TOGGLE_PRICE: 'priceDESC',
      },
    },
    priceDESC: {
      onEntry: 'orderByPriceDesc',
      on: {
        TOGGLE_RATE: 'rateASC',
        TOGGLE_TIME: 'timeASC',
        TOGGLE_PRICE: 'priceASC',
      },
    },
    timeASC: {
      onEntry: 'orderByTime',
      on: {
        TOGGLE_PRICE: 'priceASC',
        TOGGLE_RATE: 'rateASC',
        TOGGLE_TIME: 'timeDESC',
      },
    },
    timeDESC: {
      onEntry: 'orderByTimeDesc',
      on: {
        TOGGLE_PRICE: 'priceASC',
        TOGGLE_RATE: 'rateASC',
        TOGGLE_TIME: 'timeASC',
      },
    },
    rateASC: {
      onEntry: 'orderByRate',
      on: {
        TOGGLE_PRICE: 'priceASC',
        TOGGLE_TIME: 'timeASC',
        TOGGLE_RATE: 'rateDESC',
      },
    },
    rateDESC: {
      onEntry: 'orderByRateDesc',
      on: {
        TOGGLE_PRICE: 'priceASC',
        TOGGLE_TIME: 'timeASC',
        TOGGLE_RATE: 'rateASC',
      },
    },
  },
};

const Primary = styled.section`
  display: flex;
  width: 100%;
`;

class SortBox extends PureComponent {
  static propTypes = {
    transition: PropTypes.func.isRequired,
    machineState: PropTypes.shape({}).isRequired,
    handleOrderBy: PropTypes.func.isRequired,
  }

  orderByPrice = () => {
    const { handleOrderBy } = this.props;
    handleOrderBy('currentPrice', 'asc');
  }

  orderByPriceDesc = () => {
    const { handleOrderBy } = this.props;
    handleOrderBy('currentPrice', 'desc');
  }

  orderByTime = () => {
    const { handleOrderBy } = this.props;
    handleOrderBy('deadline', 'asc');
  }

  orderByTimeDesc = () => {
    const { handleOrderBy } = this.props;
    handleOrderBy('deadline', 'desc');
  }

  orderByRate = () => {
    const { handleOrderBy } = this.props;
    handleOrderBy('rate', 'asc');
  }

  orderByRateDesc = () => {
    const { handleOrderBy } = this.props;
    handleOrderBy('rate', 'desc');
  }

  render() {
    const { transition, machineState } = this.props;
    return (
      <Primary className="pv4 ">
        <div
          className={`flex aic jcs pointer mr5 white link hover-gold
  ${machineState.value === 'priceASC' || machineState.value === 'priceDESC' ? 'o-90' : 'o-30'}`}
          onClick={() => transition('TOGGLE_PRICE')}
          onKeyPress={() => transition('TOGGLE_PRICE')}
          role="button"
          tabIndex={0}
        >
          <span className="dn dib-ns">BY PRICE</span>
          <Dollar className="dn-ns dib" />

          <State is="priceASC">
            <ChevronsUp className="ml2" onClick={() => transition('TOGGLE_PRICE')} />
          </State>
          <State is="priceDESC">
            <ChevronsDown className="ml2" onClick={() => transition('TOGGLE_PRICE')} />
          </State>
        </div>
        <div
          className={`flex aic jcc pointer  mr5 white link hover-time-purple ${
            machineState.value === 'timeASC' || machineState.value === 'timeDESC' ? 'o-90' : 'o-30'
          }`}
          onClick={() => transition('TOGGLE_TIME')}
          onKeyPress={() => transition('TOGGLE_TIME')}
          role="button"
          tabIndex={-1}
        >
          <span className="dn dib-ns">BY TIME</span>
          <Clock className="dn-ns dib" />

          <State is="timeASC">
            <ChevronsUp className="ml2" onClick={() => transition('TOGGLE_TIME')} />
          </State>
          <State is="timeDESC">
            <ChevronsDown className="ml2" onClick={() => transition('TOGGLE_TIME')} />
          </State>
        </div>
        <div
          className={`flex aic jcc pointer mr5 white link hover-light-purple ${
            machineState.value === 'rateASC' || machineState.value === 'rateDESC' ? 'o-90' : 'o-30'
          }`}
          onClick={() => transition('TOGGLE_RATE')}
          onKeyPress={() => transition('TOGGLE_RATE')}
          role="button"
          tabIndex={-2}
        >
          <span className="dn dib-ns">BY MINING RATE</span>
          <Percent className="dn-ns dib" />
          <State is="rateASC">
            <ChevronsUp className="ml2" onClick={() => transition('TOGGLE_RATE')} />
          </State>
          <State is="rateDESC">
            <ChevronsDown className="ml2" onClick={() => transition('TOGGLE_RATE')} />
          </State>
        </div>
      </Primary>
    );
  }
}

const actions = {
  handleOrderBy: orderMarketBy,
};

export default compose(
  connect(
    null,
    actions,
  ),
  withStateMachine(stateMachine),
)(SortBox);
