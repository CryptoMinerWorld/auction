import React from 'react';
import { storiesOf } from '@storybook/react';
import MiniGemBox from '../MiniGemBox';
import backgrounds from "@storybook/addon-backgrounds";


const CenterDecorator = (storyFn) => (
  <div className='w-100 h-100 flex x'>
    { storyFn() }
  </div>
);

storiesOf('Mini Gem Box', module)
.addDecorator(backgrounds([
  { name: "twitter", value: "#00aced", default: true },
  { name: "facebook", value: "#3b5998" },
]))
.addDecorator(CenterDecorator)
.add('With Background', () => (
  <MiniGemBox level={1} grade={3} rate={19} />
));
