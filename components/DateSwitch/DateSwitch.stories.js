import React from 'react';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs/react';
import { boolean } from '@storybook/addon-knobs';
import DateSwitch from './DateSwitch';

storiesOf('DateSwitch', module).add('default', () => {
  const value = text('value', 'SEPTEMBER 24th, 2016');
  const isLight = boolean('IsLight', false, false);
  return <DateSwitch value={value} theme={isLight ? 'light' : 'dark'} />;
});
