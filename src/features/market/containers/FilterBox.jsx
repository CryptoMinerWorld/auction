import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withStateMachine } from 'react-automata';
import { filterMarketplaceResults } from '../marketActions';
import Filters from '../components/Filters';
import GemFilters from '../components/GemFilters';

// const stateMachine = {
//   initial: 'filters',
//   states: {
//     filters: {
//       on: {
//         FILTER_GEMS: 'loading'
//       }
//     },
//     loading: {
//       onEntry: ['filterGems'],
//       on: {
//         SUCCESS: 'filters',
//         FAILURE: 'error'
//       }
//     },
//     error: {
//       on: {
//         FILTER_GEMS: 'loading'
//       }
//     }
//   }
// };

// const LeftAside = styled.aside`
//   grid-column: 1;
// `;

// const RightAside = styled.aside`
//   grid-column: 5;
// `;

class FilterBox extends Component {
  // static propTypes = {
  //   handleFilterMarketResults: PropTypes.func.isRequired,
  //   left: PropTypes.bool,
  //   right: PropTypes.bool
  // };

  // static defaultProps = {
  //   left: false,
  //   right: false
  // };

  // state = {
  //   filterLoading: false,
  //   gems: {
  //     amethyst: true,
  //     garnet: true,
  //     sapphire: true,
  //     opal: true
  //   },
  //   level: {
  //     min: 0,
  //     max: 5
  //   },
  //   gradeType: {
  //     min: 1,
  //     max: 6
  //   },
  //   currentPrice: {
  //     min: 0,
  //     max: 10000000000000000000
  //   }
  // };

  filterGems = () => () => {
    this.setState({ filterLoading: true });
    this.props
      .handleFilterMarketResults(this.state)
      .then(() => this.setState({ filterLoading: false }));
  };

  handleChange = filterName => values =>
    this.setState({ [filterName]: { min: values[0], max: values[1] } });

  // toggleGem = gemType => () => {
  //   this.setState({ filterLoading: true }, () => {
  //     const gemState = { ...this.state };
  //     gemState.gems[gemType] = !gemState.gems[gemType];
  //     this.setState({ ...gemState }, () => {
  //       this.props
  //         .handleFilterMarketResults(this.state)
  //         .then(() => this.setState({ filterLoading: false }));
  //     });
  //   });
  // };

  // render() {
  //   return (
  //     <div>
  //       {this.props.left && (
  //         <LeftAside>
  //           <GemFilters
  //             toggleGem={this.toggleGem}
  //             selection={this.state.gems}
  //             filterLoading={this.state.filterLoading}
  //           />
  //         </LeftAside>
  //       )}
  //       {this.props.right && (
  //         <RightAside>
  //           <Filters
  //             handleChange={this.handleChange}
  //             selection={this.state}
  //             filterLoading={this.state.filterLoading}
  //             finalFilter={this.filterGems}
  //           />
  //         </RightAside>
  //       )}
  //     </div>
  //   );
  }
}

const actions = {
  handleFilterMarketResults: filterMarketplaceResults
};

export default compose(
  connect(
    null,
    actions
  ),
  withStateMachine(stateMachine)
)(FilterBox);
