import { testStateMachine } from 'react-automata';
// import { TestGiftGems } from '../components/GiftGems';

// jest.mock('firebase');

const fixtures = {
  initialData: {
    gemsContract: '0x',
    to: '123',
    from: '456',
    tokenId: '789',
  },
};

test.skip('GiftGems works', () => {
  testStateMachine(TestGiftGems, { fixtures });
});
