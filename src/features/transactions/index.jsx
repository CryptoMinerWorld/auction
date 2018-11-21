import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spin from 'antd/lib/spin';
import Icon from 'antd/lib/icon';
import { Machine } from 'xstate';
import { interpret } from 'xstate/lib/interpreter';
import { savePendingTxToFirestore } from './helpers';

const txStatechart = Machine(
  {
    id: 'tx',
    initial: 'signedOut',
    states: {
      signedOut: {
        on: {
          LOGGEDIN: 'signedin',
          TXSTARTED: 'signedin.pending',
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
            onEntry: ['savePendingTxToFirestore'],
            on: {
              TXSUCCEEDED: 'resolved',
              TXERROR: 'error',
            },
          },
          resolved: {
            after: {
              3000: 'idle',
            },
          },
          error: {
            after: {
              3000: 'idle',
            },
          },
        },
      },
    },
  },
  {
    actions: {
      savePendingTxToFirestore,
    },
  },
);

class Transaction extends PureComponent {
  static propTypes = {
    auth: PropTypes.bool,
    hash: PropTypes.string,
    txReceipt: PropTypes.string,
    txError: PropTypes.string,
    txCurrentUser: PropTypes.string,
    txMethod: PropTypes.string,
    txTokenId: PropTypes.number,
  };

  static defaultProps = {
    txReceipt: '',
    txCurrentUser: '',
    txMethod: '',
    txTokenId: null,
    auth: false,
    hash: '',
    txError: '',
  };

  state = {
    current: txStatechart.initialState,
  };

  service = interpret(txStatechart).onTransition(current => this.setState({ current }));

  componentDidMount() {
    const { auth } = this.props;
    const { send } = this.service;
    this.service.start();

    if (auth) {
      send('LOGGEDIN');
    } else if (!auth) {
      send('LOGGEDOUT');
    } else {
      console.log('txStatechart 1');
    }
  }

  componentDidUpdate(prevProps) {
    const {
      auth, hash, txReceipt, txError, txCurrentUser, txMethod, txTokenId,
    } = this.props;
    const { send } = this.service;
    if (hash !== prevProps.hash) {
      if (auth && hash) {
        send({
          type: 'TXSTARTED',
          hash,
          txCurrentUser,
          txMethod,
          txTokenId,
        });
      }
    } else if (txReceipt !== prevProps.txReceipt) {
      if (auth && txReceipt) {
        send('TXSUCCEEDED');
      }
    } else if (txError !== prevProps.txError) {
      if (auth && txError) {
        send('TXERROR');
      }
    } else if (auth !== prevProps.auth) {
      if (auth) {
        send('LOGGEDIN');
      } else if (!auth) {
        send('LOGGEDOUT');
      } else {
        console.log('txStatechart 2');
      }
    } else {
      console.log('txStatechart 3');
    }
  }

  componentWillUnmount() {
    this.service.stop();
  }

  render() {
    const { txError, hash } = this.props;
    const { current } = this.state;
    const loading = <Icon type="loading" style={{ fontSize: 24 }} spin />;

    return (
      <div className="flex aic jcs">
        {current.matches('signedin.pending') && (
          <div className="flex row aic jcs">
            <Spin indicator={loading} />
            <div className="flex col orange jcc ais pl3">
              <p className="ma0 pa0">Transaction in process...</p>
              <small className="f6 ma0 pa0">
                Tx Hash
                {` ${hash.substring(0, 4)}...${hash.substring(hash.length - 4)}`}
              </small>
            </div>
          </div>
        )}

        {current.matches('signedin.resolved') && (
          <div className="flex col green">
            <p> Transaction Complete.</p>
          </div>
        )}

        {current.matches('signedin.error') && (
          <div className="flex col red">
            <p>Transaction Failed.</p>
            <small>{txError}</small>
          </div>
        )}
      </div>
    );
  }
}

const select = store => ({
  hash: store.tx.txHash,
  txConfirmations: store.tx.txConfirmations,
  txReceipt: store.tx.txReceipt,
  txError: store.tx.txError,
  txCurrentUser: store.tx.txCurrentUser,
  txMethod: store.tx.txMethod,
  txTokenId: store.tx.txTokenId,
});

export default connect(select)(Transaction);
