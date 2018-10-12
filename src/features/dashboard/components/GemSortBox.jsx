import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  getGemsForDashboardFilter,
  rerenderSortBox,
  sortBoxReredendered
} from '../dashboardActions';
import { withStateMachine } from 'react-automata';
import { matchesState } from 'xstate';

const stateMachine = {
  initial: 'allGems',
  states: {
    allGems: {
      onEntry: 'handleFetchAllGems',
      on: {
        INAUCTION: 'gemsInAuction',
        NOTINAUCTION: 'gemsNotInAuction'
      }
    },
    gemsInAuction: {
      onEntry: 'handleFetchAllGemsInAuction',
      on: {
        ALL: 'allGems',
        NOTINAUCTION: 'gemsNotInAuction'
      }
    },
    gemsNotInAuction: {
      onEntry: ['handleFetchAllGemsNOTInAuction', 'hideOtherSortBox'],
      on: {
        ALL: 'allGems',
        INAUCTION: 'gemsInAuction'
      }
    }
  }
};

class GemSortBox extends PureComponent {
  static propTypes = {
    fetchGems: PropTypes.func.isRequired
  };

  handleFetchAllGems = () => this.props.fetchGems('all');
  handleFetchAllGemsInAuction = () => this.props.fetchGems('inAuction');
  handleFetchAllGemsNOTInAuction = () => this.props.fetchGems('notInAuction');

  hideOtherSortBox = () => this.props.handleRerenderSortBox();

  componentWillTransition(event) {
    this.props.handleRerenderSortBox();
  }

  componentDidTransition(prevMachineState, event) {
    this.props.handleSortBoxReredendered();
  }

  static OrderBy = ({ state, transition, title, to, match }) => {
    return (
      <p
        className={`pr4 tc pointer white link ${
          matchesState(state, match) ? 'o-90' : 'o-30'
        }`}
        onClick={() => transition(to)}
      >
        {title}
      </p>
    );
  };

  render() {
    const { transition, machineState } = this.props;

    return (
      <div className="flex aic w-100 pv4">
        <GemSortBox.OrderBy
          state={machineState.value}
          transition={transition}
          title="ALL GEMS"
          to="ALL"
          match="allGems"
        />
        <GemSortBox.OrderBy
          state={machineState.value}
          transition={transition}
          title="GEMS IN AUCTION"
          to="INAUCTION"
          match="gemsInAuction"
        />
        <GemSortBox.OrderBy
          state={machineState.value}
          transition={transition}
          title="GEMS NOT IN AUCTION"
          to="NOTINAUCTION"
          match="gemsNotInAuction"
        />
      </div>
    );
  }
}

const actions = {
  fetchGems: getGemsForDashboardFilter,
  handleRerenderSortBox: rerenderSortBox,
  handleSortBoxReredendered: sortBoxReredendered
};

export default compose(
  connect(
    null,
    actions
  ),
  withStateMachine(stateMachine)
)(GemSortBox);
