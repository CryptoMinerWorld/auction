import { testStateMachine } from 'react-automata';
import GiftGems from '../components/GiftGems';

test.skip('GiftGems works', () => {
  testStateMachine(GiftGems);
});
