import { configure } from '@storybook/react';
import { addDecorator } from '@storybook/react/dist/client/preview';
import { withKnobs } from '@storybook/addon-knobs';
import './mockRouter';

addDecorator(withKnobs);

const req = require.context('../components', true, /\.stories\.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
