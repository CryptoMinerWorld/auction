import { testStateMachine } from 'react-automata';
import Tx from '../index';
import { resolveAnyPendingTx } from '../helpers';

// jest.mock('../txActions', () => ({
//   resolveTXStatus: jest.fn(),
// }));

describe.skip('transaction bar', () => {
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
  test.skip('recon function does nothing if there are zero pending transaction', async () => {
    // const dbQuery = jest.fn(() => new Promise(resolve => resolve([4, 4, 3])));
    const walletId = '123';
    const gemsContract = jest.fn();
    const auctionContract = jest.fn();
    const countryContract = jest.fn();
    const AUCTION_CONTRACT_ADDRESS = 'abc';
    const web3 = jest.fn();
    const GEM_CONTRACT_ADDRESS = '456';
    // const resolveTXStatus
    await resolveAnyPendingTx(
      walletId,
      gemsContract,
      auctionContract,
      AUCTION_CONTRACT_ADDRESS,
      GEM_CONTRACT_ADDRESS,
      web3,
      countryContract,
    );

    expect(resolveAnyPendingTx).toBeCalled();
    expect(resolveAnyPendingTx).toBeCalledWith(
      walletId,
      gemsContract,
      auctionContract,
      AUCTION_CONTRACT_ADDRESS,
      GEM_CONTRACT_ADDRESS,
      web3,
      countryContract,
    );
  });

  test.skip('recon function fires resolve function if pending transaction exist', () => {
    const walletId = '123';
    const gemsContract = jest.fn();
    const auctionContract = jest.fn();
    const countryContract = jest.fn();
    const AUCTION_CONTRACT_ADDRESS = 'abc';
    const web3 = jest.fn();
    const GEM_CONTRACT_ADDRESS = '456';
    // const resolveTXStatus
    resolveAnyPendingTx(
      walletId,
      gemsContract,
      auctionContract,
      AUCTION_CONTRACT_ADDRESS,
      GEM_CONTRACT_ADDRESS,
      web3,
      countryContract,
    );

    expect(resolveAnyPendingTx).toBeCalled();
  });

  test.skip('recon function fires when a user signs in', () => {});

  test.skip('recon function find any pending transactins on a given user', () => {});

  test.skip('recon function resolves the pending status on a function', () => {});
  // resolveTXStatus = (pendingTransactions, dbWrite, dbDelete, queryBlockchain)
  // findPendingTransactions = (userId, queryBlockchain, dbQuery, dbWrite, dbDelete)
});
