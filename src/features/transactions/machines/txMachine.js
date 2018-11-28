import { Machine } from 'xstate';

import { savePendingTxToFirestore, removePendingTxFromFirestore } from '../helpers';

export const temp = () => {};

export const txStatechart = Machine(
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
            onEntry: ['removePendingTxFromFirestore'],
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
      removePendingTxFromFirestore,
    },
  },
);
