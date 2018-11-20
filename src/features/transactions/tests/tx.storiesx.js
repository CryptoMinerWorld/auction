
import { storiesOf } from '@storybook/react';
import backgrounds from '@storybook/addon-backgrounds';
import React from 'react';
import { text, boolean } from '@storybook/addon-knobs/react';
import Tx from '../index';

const CenterDecorator = storyFn => <div className="w-100 h-100 flex x mt5">{storyFn()}</div>;


storiesOf('Transactions', module)
  .addDecorator(
    backgrounds([
      { name: 'light', value: '#FFF', default: true },

    ]),
  )
  .addDecorator(CenterDecorator)
  .addWithJSX('Pending', () => (
    <Tx
      auth
      tx={boolean(false)}
      receipt={text('1234')}
      confirmations={0}
      txid=""
      error=""
    />
  ));


{ /* .add('with some emoji', () => (
    <Button onClick={action('clicked')}>
      <span role="img" aria-label="so cool">
        😀 😎 👍 💯
      </span>
    </Button>
  )); */ }
