import { testStateMachine } from 'react-automata';
import Tx from '../index';
import { findPendingTransactions } from '../txActions';

// jest.mock('../txActions', () => ({
//   resolveTXStatus: jest.fn(),
// }));

describe('transaction bar', () => {
  test('transactions module works', () => {
    testStateMachine(Tx);
  });

  test('th tx bar is hidden when there is no transaction', () => {});

  test('txbar marks a item as pending as soon as a transaction begins', () => {});

  test('txbar updates the number of confirmations as they a happen', () => {});

  test('txbar marks disappears a few seconds after it is resolved', () => {});

  test('txbar shows you a reason for the error when it errors out', () => {});
});

describe('transaction reconciliation function', () => {
  test('recon function does nothing if there are zero pending transaction', async () => {
    // const dbQuery = jest.fn(() => new Promise(resolve => resolve([4, 4, 3])));
    const queryBlockchain = jest.fn();
    const dbQuery = jest.fn(() => []);
    const dbWrite = jest.fn();
    const dbDelete = jest.fn();
    const resolveTXStatus = jest.fn();
    await findPendingTransactions('userId', queryBlockchain, dbQuery, dbWrite, dbDelete, resolveTXStatus);
    expect(dbQuery).toBeCalled();
    expect(resolveTXStatus).not.toBeCalled();
  });


  test('recon function fires resolve function if pending transaction exist', async () => {
    const queryBlockchain = jest.fn();
    const dbQuery = jest.fn(() => [1, 2, 3]);
    const dbWrite = jest.fn();
    const dbDelete = jest.fn();
    const resolveTXStatus = jest.fn();
    await findPendingTransactions('userId', queryBlockchain, dbQuery, dbWrite, dbDelete, resolveTXStatus);
    expect(dbQuery).toBeCalled();
    expect(resolveTXStatus).toBeCalled();
  });


  test('recon function fires when a user signs in', () => {

  });

  test('recon function find any pending transactins on a given user', () => {});

  test('recon function resolves the pending status on a function', () => {});
  // resolveTXStatus = (pendingTransactions, dbWrite, dbDelete, queryBlockchain)

  // findPendingTransactions = (userId, queryBlockchain, dbQuery, dbWrite, dbDelete)
});
