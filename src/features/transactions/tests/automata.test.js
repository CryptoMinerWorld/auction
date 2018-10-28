import { testStateMachine } from 'react-automata';
import Tx from '../index';

test('transactions module works', () => {
  testStateMachine(Tx);
});
