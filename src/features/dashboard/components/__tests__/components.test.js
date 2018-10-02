import { testStateMachine } from 'react-automata'
import {Resync} from '../ResyncButton'

test.skip('Resync button works', () => {
  testStateMachine(Resync)
})

