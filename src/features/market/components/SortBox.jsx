import React, { PureComponent } from 'react';
import styled from 'styled-components';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { orderMarketBy } from '../marketActions';
import { withStateMachine } from 'react-automata';
import { compose } from 'redux';

const stateMachine = {
  initial: 'price',
  states: {
    price: {
      onEntry: 'orderByPrice',
      on: {
        RATE: 'rate',
        TIME: 'time'
      }
    },
    time: {
      onEntry: 'orderByTime',
      on: {
        PRICE: 'price',
        RATE: 'rate'
      }
    },
    rate: {
      onEntry: 'orderByRate',
      on: {
        PRICE: 'price',
        TIME: 'time'
      }
    }
  }
};

const Primary = styled.section`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 20px;
  grid-row-gap: 20px;
`;

class SortBox extends PureComponent {
  orderByPrice = () => this.props.handleOrderBy('currentPrice');
  orderByTime = () => this.props.handleOrderBy('deadline');
  orderByRate = () => this.props.handleOrderBy('rate');

  render() {
    const { transition, machineState } = this.props;

    return (
      <Primary className="pv4 ">
        <p
          className={`pointer ttu mr4 white link tc ${
            machineState.value === 'price' ? 'o-90' : 'o-30'
          }`}
          onClick={() => transition('PRICE')}
        >
          by price{' '}
          <span
            dangerouslySetInnerHTML={{
              __html: machineState.value === 'price' ? '&#8593;' : '&#8595;'
            }}
          />
        </p>
        <p
          className={`pointer ttu mr4 white link tc ${
            machineState.value === 'time' ? 'o-90' : 'o-30'
          }`}
          onClick={() => transition('TIME')}
        >
          by time{' '}
          <span
            dangerouslySetInnerHTML={{
              __html:
                machineState.value === 'time' ? '   &#8593;' : '   &#8595;'
            }}
          />
        </p>
        <p
          className={`pointer ttu mr4 white link tc ${
            machineState.value === 'rate' ? 'o-90' : 'o-30'
          }`}
          onClick={() => transition('RATE')}
        >
          by mining rate bonus
          <span
            dangerouslySetInnerHTML={{
              __html:
                machineState.value === 'rate' ? '   &#8593;' : '   &#8595;'
            }}
          />
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
