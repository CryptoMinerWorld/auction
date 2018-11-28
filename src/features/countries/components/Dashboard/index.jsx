import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { State, withStateMachine } from 'react-automata';
import NoCountries from './NoCountries';
import CountryDisplay from './CountryDisplay';

const statechart = {
  initial: 'noMetamask',
  states: {
    noMetamask: {
      on: {
        COUNTRIES: 'countries',
        NO_COUNTRIES: 'noCountries',
        NO_ACCOUNT: 'noAccount',
        NO_METAMASK: 'noMetamask',
      },
    },
    countries: {
      on: {
        COUNTRIES: 'countries',
        NO_COUNTRIES: 'noCountries',
        NO_ACCOUNT: 'noAccount',
        NO_METAMASK: 'noMetamask',
      },
    },
    noCountries: {
      on: {
        COUNTRIES: 'countries',
        NO_COUNTRIES: 'noCountries',
        NO_ACCOUNT: 'noAccount',
        NO_METAMASK: 'noMetamask',
      },
    },
    noAccount: {
      on: {
        COUNTRIES: 'countries',
        NO_COUNTRIES: 'noCountries',
        NO_ACCOUNT: 'noAccount',
        NO_METAMASK: 'noMetamask',
      },
    },
  },
};

class CountryDashboard extends Component {
  static propTypes = {
    countries: PropTypes.arrayOf(PropTypes.shape({})),
    transition: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired,
  };

  static defaultProps = {
    countries: [],
  };

  componentDidMount() {
    const {
      transition,

      countries,
    } = this.props;

    if (!countries || countries.length === 0) {
      transition('NO_COUNTRIES');
    } else {
      transition('COUNTRIES');
    }
  }

  componentDidUpdate(prevProps) {
    const { countries, transition } = this.props;

    if (prevProps.countries !== countries) {
      if (!countries || countries.length === 0) {
        transition('NO_COUNTRIES');
      } else {
        transition('COUNTRIES');
      }
    }
  }

  render() {
    const { countries, userId } = this.props;

    return (
      <div className="pa0">
        <State is="noCountries">
          <NoCountries />
        </State>

        <State is="countries">
          <CountryDisplay countries={countries} userId={userId} />
        </State>
      </div>
    );
  }
}

export default withStateMachine(statechart)(CountryDashboard);
