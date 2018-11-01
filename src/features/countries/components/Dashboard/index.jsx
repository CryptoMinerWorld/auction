import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { State, withStateMachine } from 'react-automata';
import NoCountries from './NoCountries';
import Countries from './CountryDisplay';

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

class CountryDashboard extends PureComponent {
  static propTypes = {
    web3: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.bool]),
    countries: PropTypes.arrayOf(PropTypes.shape({})),
    account: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.string]),
    transition: PropTypes.func.isRequired,
  };

  // static defaultProps = {
  //   web3: false,
  //   countries: [],
  //   account: false,
  // };

  static defaultProps = {
    web3: true,
    countries: [
      {
        name: 'Brazil',
        key: '3',
        plots: 44,
        price: 32,
        return: 54,
        roi: 45,
        gems: 5,
        artifacts: 2,
        gold: 67,
        silver: 98,
        keys: 6,
      },
      {
        name: 'India',
        key: '1',
        plots: 44,
        price: 32,
        return: 54,
        roi: 45,
      },
      {
        name: 'Portugal',
        key: '2',
        plots: 44,
        price: 32,
        return: 54,
        roi: 45,
      },
      {
        name: 'Brazil',
        key: '3',
        plots: 44,
        price: 32,
        return: 54,
        roi: 45,
        gems: 5,
        artifacts: 2,
        gold: 67,
        silver: 98,
        keys: 6,
      },
      {
        name: 'India',
        key: '1',
        plots: 44,
        price: 32,
        return: 54,
        roi: 45,
      },
      {
        name: 'Portugal',
        key: '2',
        plots: 44,
        price: 32,
        return: 54,
        roi: 45,
      },
    ],
    account: true,
  };

  componentDidMount() {
    const {
      transition, web3, account, countries,
    } = this.props;

    if (!web3) {
      transition('NO_METAMASK');
    } else if (!account) {
      transition('NO_ACCOUNT');
    } else if (!countries || countries.length === 0) {
      transition('NO_COUNTRIES');
    } else if (countries && countries.length > 0) {
      transition('COUNTRIES');
    } else {
      transition('NO_METAMASK');
    }
  }

  render() {
    const { countries } = this.props;
    return (
      <div>
        <State is="noCountries">
          {' '}
          <NoCountries />
        </State>
        <State is="noMetamask">
          {' '}
          <p data-testid="noMetamask">No Metamask</p>
        </State>
        <State is="noAccount">
          {' '}
          <p data-testid="noAccount">No Account</p>
        </State>
        <State is="countries">
          <Countries countries={countries} />
        </State>
      </div>
    );
  }
}

export default withStateMachine(statechart)(CountryDashboard);
