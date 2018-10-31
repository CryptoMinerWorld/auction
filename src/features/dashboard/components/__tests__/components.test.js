import { testStateMachine } from 'react-automata';
import { Resync } from '../ResyncButton';

jest.mock('firebase');

test.skip('Resync button works', () => {
  testStateMachine(Resync);
});
