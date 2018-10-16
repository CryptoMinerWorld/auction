import { testStateMachine } from 'react-automata';
import {TestGiftGems} from '../components/GiftGems';

test('GiftGems works', () => {
  testStateMachine(TestGiftGems);
});
