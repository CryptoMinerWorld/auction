import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStateMachine, State } from 'react-automata';

const statechart = {
  initial: 'signedOut',
  states: {
    signedOut: {
      on: {
        LOGGEDIN: 'signedin',
      },
    },
    signedin: {
      on: {
        LOGGEDOUT: 'signedOut',
      },
      initial: 'idle',
      states: {
        idle: {},
        pending: {},
        resolved: {},
        loading: {},
        error: {},
      },
    },
  },
};


class Transaction extends PureComponent {
  static propTypes = {
    transition: PropTypes.func.isRequired,
    auth: PropTypes.bool,

  };

  static defaultProps = {
    auth: false,
  }

  componentDidMount() {
    const { auth, transition } = this.props;

    if (auth) {
      transition('LOGGEDIN');
    }

    if (!auth) {
      transition('LOGGEDOUT');
    }
  }


  componentDidUpdate(prevProps) {
    const { auth, transition } = this.props;

    if (auth !== prevProps.auth) {
      if (auth) {
        transition('LOGGEDIN');
      }

      if (!auth) {
        transition('LOGGEDOUT');
      }
    }
  }


  render() {
    const { transition } = this.props;
    return (
      <div>
        <State is="signedOut">
            logged out
        </State>
        <State is="signedin.*">
          <button type="button" onClick={() => transition('.pending')}>x</button>
            logged In
        </State>
      </div>
    );
  }
}


export default withStateMachine(statechart)(Transaction);
