import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStateMachine, State } from 'react-automata';
import { compose } from 'redux';
import { orderDashboardBy } from '../dashboardActions';
import { ReactComponent as DownArrowCircle } from '../../../app/images/svg/chevrons-down.svg';
import { ReactComponent as UpArrowCircle } from '../../../app/images/svg/chevrons-up.svg';

export const stateMachine = {
  initial: 'noOrderBy',
  states: {
    noOrderBy: {
        on: {
            TOGGLE_TIME: 'timeASC',
            TOGGLE_PRICE: 'priceDESC',
        },
    },
    priceASC: {
      onEntry: 'orderByPrice',
      on: {
        TOGGLE_TIME: 'timeASC',
        TOGGLE_PRICE: 'priceDESC',
      },
    },
    priceDESC: {
      onEntry: 'orderByPriceDesc',
      on: {
        TOGGLE_TIME: 'timeASC',
        TOGGLE_PRICE: 'priceASC',
      },
    },
    timeASC: {
      onEntry: 'orderByTime',
      on: {
        TOGGLE_PRICE: 'priceASC',
        TOGGLE_TIME: 'timeDESC',
      },
    },
    timeDESC: {
      onEntry: 'orderByTimeDesc',
      on: {
        TOGGLE_PRICE: 'priceASC',
        TOGGLE_TIME: 'timeASC',
      },
    },
  },
};

class SortBox extends PureComponent {
  static propTypes = {
    handleOrderBy: PropTypes.func.isRequired,
    transition: PropTypes.func.isRequired,
    machineState: PropTypes.shape({
    }).isRequired,
  }

  orderByTime = () => {
    const { handleOrderBy } = this.props;
    handleOrderBy('level', 'asc');
  }

  orderByTimeDesc = () => {
    const { handleOrderBy } = this.props;
    handleOrderBy('level', 'desc');
  }

  orderByPrice = () => {
    const { handleOrderBy } = this.props;
    handleOrderBy('gradeType', 'asc');
  }

  orderByPriceDesc = () => {
    const { handleOrderBy } = this.props;
    handleOrderBy('gradeType', 'desc');
  }

  render() {
    const { transition, machineState } = this.props;

    return (
      <div className="flex-ns dn jce aic w-100 pv4">
        <div
          className={`flex aic jcc pointer  mr4 white link  ${
            machineState.value === 'timeASC' || machineState.value === 'timeDESC' ? 'o-90' : 'o-30'
          }`}
          onClick={() => transition('TOGGLE_TIME')}
          onKeyPress={() => transition('TOGGLE_TIME')}
          role="button"
          tabIndex={0}
        >
          BY LEVEL
          <State is="timeDESC">
            <UpArrowCircle className="ml2" onClick={() => transition('TOGGLE_TIME')} />
          </State>
          <State is="timeASC">
            <DownArrowCircle className="ml2" onClick={() => transition('TOGGLE_TIME')} />
          </State>
        </div>

        <div
          className={`flex aic jcc pointer  white link
  ${machineState.value === 'priceASC' || machineState.value === 'priceDESC' ? 'o-90' : 'o-30'}`}
          onClick={() => transition('TOGGLE_PRICE')}
          onKeyPress={() => transition('TOGGLE_PRICE')}
          role="button"
          tabIndex={0}
        >
          BY GRADE
          <State is="priceDESC">
            <UpArrowCircle className="ml2" onClick={() => transition('TOGGLE_PRICE')} />
          </State>
          <State is="priceASC">
            <DownArrowCircle className="ml2" onClick={() => transition('TOGGLE_PRICE')} />
          </State>
        </div>
      </div>
    );
  }
}

const actions = {
  handleOrderBy: orderDashboardBy,
};

export default compose(
  connect(
    null,
    actions,
  ),
  withStateMachine(stateMachine),
)(SortBox);
