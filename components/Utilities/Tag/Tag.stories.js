import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, number } from '@storybook/addon-knobs/react';
import Tag from './Tag';
import './Tag.style.scss';

storiesOf('Utilities', module).add('Tag', () => {
  const value = text('value', 'Rate title', 'value');
  const rate = number('rate', 5, 'rate');

  return <Tag value={value} onRemoveItem={rate} />;
});
