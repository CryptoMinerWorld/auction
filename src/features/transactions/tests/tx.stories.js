
import { storiesOf } from '@storybook/react';


import React from 'react';
import Tx from '../index';


storiesOf('Transactions', module)
  .add('logged out', () => <Tx />)
  .add('logged in', () => <Tx auth />);


{ /* .add('with some emoji', () => (
    <Button onClick={action('clicked')}>
      <span role="img" aria-label="so cool">
        😀 😎 👍 💯
      </span>
    </Button>
  )); */ }
