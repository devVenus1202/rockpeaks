import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, boolean } from '@storybook/addon-knobs/react';
import TagItem from './TagItem';
import './TagItem.style.scss';

storiesOf('Utilities', module).add('TagItem', () => {
  const value = text('value', 'Rate title', 'value');
  const isLight = boolean('isLight', false, false);
  return (
    <div className={isLight ? 'theme-light' : 'theme-dark'}>
      <TagItem value={value} onRemoveItem={() => {}} />
    </div>
  );
});
