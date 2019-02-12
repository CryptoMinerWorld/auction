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


class GemSortBox extends PureComponent {
  static propTypes = {
    fetchGems: PropTypes.func.isRequired,
    handleRerenderSortBox: PropTypes.func.isRequired,
    handleSortBoxReredendered: PropTypes.func.isRequired,
    //transition: PropTypes.func.isRequired,
    //machineState: PropTypes.shape({}).isRequired,
  };

  state = {
    currentMatch: 'allGems',
  };

  static OrderBy = ({
    that, title, to, match,
  }) => (
    <div
      className={`pr4 tc pointer  white link ${
         that.state.currentMatch === match ? 'o-90 underline' : 'o-30'
      }`}
      onClick={() => that.setState({currentMatch: match})}
      onKeyPress={() => that.setState({currentMatch: match})}
      role="button"
      tabIndex={0}
    >
      {title}
    </div>
  );

  handleFetchAllGemsNotInAuction = () => {
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

  componentDidUpdate(prevProps) {
    const { fetchGems } = this.props;
    return fetchGems(this.state.currentMatch);
  }

  render() {
    const { transition, machineState } = this.props;

    return (
      <div className="flex aic w-100 pv4">
        <GemSortBox.OrderBy
          that={this}
          title="ALL GEMS"
          to="ALL"
          match="allGems"
        />
        <GemSortBox.OrderBy
          that={this}
          title="GEMS IN AUCTION"
          to="INAUCTION"
          match="gemsInAuction"
        />
        <GemSortBox.OrderBy
          that={this}
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
)(GemSortBox);
