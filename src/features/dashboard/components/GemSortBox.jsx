import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withStateMachine } from 'react-automata';
import { matchesState } from 'xstate';
import {
  getGemsForDashboardFilter,
  rerenderSortBox,
  sortBoxReredendered,
} from '../dashboardActions';

const stateMachine = {
  initial: 'allGems',
  states: {
    allGems: {
      onEntry: 'handleFetchAllGems',
      on: {
        INAUCTION: 'gemsInAuction',
        NOTINAUCTION: 'gemsNotInAuction',
      },
    },
    gemsInAuction: {
      onEntry: 'handleFetchAllGemsInAuction',
      on: {
        ALL: 'allGems',
        NOTINAUCTION: 'gemsNotInAuction',
      },
    },
    gemsNotInAuction: {
      onEntry: ['handleFetchAllGemsNOTInAuction', 'hideOtherSortBox'],
      on: {
        ALL: 'allGems',
        INAUCTION: 'gemsInAuction',
      },
    },
  },
};

class GemSortBox extends PureComponent {
  static propTypes = {
    fetchGems: PropTypes.func.isRequired,
    handleRerenderSortBox: PropTypes.func.isRequired,
    handleSortBoxReredendered: PropTypes.func.isRequired,
    transition: PropTypes.func.isRequired,
    machineState: PropTypes.shape({}).isRequired,
  };

  static OrderBy = ({
    state, transition, title, to, match,
  }) => (
    <div
      className={`pr4 tc pointer  white link ${
        matchesState(state, match) ? 'o-90 underline' : 'o-30'
      }`}
      onClick={() => transition(to)}
      onKeyPress={() => transition(to)}
      role="button"
      tabIndex={0}
    >
      {title}
    </div>
  );

  handleFetchAllGemsNOTInAuction = () => {
    const { fetchGems } = this.props;
    fetchGems('notInAuction');
  };

  handleFetchAllGemsInAuction = () => {
    const { fetchGems } = this.props;
    fetchGems('inAuction');
  };

  handleFetchAllGems = () => {
    const { fetchGems } = this.props;
    return fetchGems('all');
  };

  hideOtherSortBox = () => {
    const { handleRerenderSortBox } = this.props;
    handleRerenderSortBox();
  };

  componentWillTransition() {
    const { handleRerenderSortBox } = this.props;
    handleRerenderSortBox();
  }

  componentDidTransition() {
    const { handleSortBoxReredendered } = this.props;
    handleSortBoxReredendered();
  }

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
  handleSortBoxReredendered: sortBoxReredendered,
};

export default compose(
  connect(
    null,
    actions,
  ),
  withStateMachine(stateMachine),
)(GemSortBox);
