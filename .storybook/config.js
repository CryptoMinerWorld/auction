import { configure, setAddon, addDecorator } from '@storybook/react';
import '../src/app/css/root.css';
import JSXAddon from 'storybook-addon-jsx';
import {withKnobs} from '@storybook/addon-knobs/react'

const req = require.context('../src', true, /.stories.js$/);

addDecorator(withKnobs)
setAddon(JSXAddon)

function loadStories() {
  req.keys().forEach(file => req(file));
}

configure(loadStories, module);
