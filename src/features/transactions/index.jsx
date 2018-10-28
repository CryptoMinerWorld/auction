import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStateMachine, State } from 'react-automata';
import Spin from 'antd/lib/spin';
import Icon from 'antd/lib/icon';

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
        idle: {
          on: {
            TXSTARTED: 'pending',
          },
        },
        pending: {
          onEntry: ['handleTx', 'markItemPending'],
          on: {
            TXCONFIRMED: 'confirmed',
            TXERROR: 'error',
          },
        },
        confirmed: {
          on: {
            TXSUCCEEDED: 'resolved',
            TXERROR: 'error',
          },
        },
        resolved: {
          on: {
            CLOSE: 'idle',
          },
        },
        error: {
          on: {
            CLOSE: 'idle',

          },
        },
      },
    },
  },
};

class Transaction extends PureComponent {
  static propTypes = {
    transition: PropTypes.func.isRequired,
    auth: PropTypes.bool,
    receipt: PropTypes.string,
    tx: PropTypes.bool,
    confirmations: PropTypes.number,
    txid: PropTypes.string,
  };

  static defaultProps = {
    receipt: '',
    confirmations: 0,
    txid: '',
    auth: false,
    tx: false,
  };

  componentDidMount() {
    const { auth, transition, tx } = this.props;

    if (auth) {
      transition('LOGGEDIN');
    }

    if (!auth) {
      transition('LOGGEDOUT');
    }

    if (auth && tx) {
      transition('TXSTARTED');
    }
  }

  componentDidUpdate(prevProps) {
    const { auth, transition, tx } = this.props;

    if (auth !== prevProps.auth) {
      if (auth) {
        transition('LOGGEDIN');
      }

      if (!auth) {
        transition('LOGGEDOUT');
      }
    }

    if (tx !== prevProps.tx) {
      if (auth && tx) {
        transition('TXSTARTED');
      }
    }
  }

  render() {
    const {
      receipt, confirmations, txid, error,
    } = this.props;
    const loading = <Icon type="loading" style={{ fontSize: 24 }} spin />;
    return (
      <div>
        <State is="signedin.pending">
          <Spin indicator={loading} />
          <p>
            Transaction
            {receipt}
            {' '}
processing...
          </p>
        </State>

        <State is="signedin.confirmed">
          <Spin indicator={loading} />
          <p>
            Transaction
            {receipt}
            {' '}
processing...
            {confirmations}
            {' '}
            {confirmations === 1 ? 'confirmation' : 'confirmations'}
          </p>
        </State>

        <State is="signedin.resolved">

          <p className="green">
            Transaction

Complete. Transaction Number
            {txid}

          </p>
        </State>
        <State is="signedin.resolved">

          <p className="green">
            Transaction

Complete. Transaction Number
            {txid}

          </p>
        </State>

        <State is="signedin.error">

          <p className="red">
            Transaction

Failed:
            {error}

          </p>
        </State>
      </div>
    );
  }
}

export default withStateMachine(statechart)(Transaction);
