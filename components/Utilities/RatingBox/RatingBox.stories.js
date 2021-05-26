import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, number } from '@storybook/addon-knobs/react';
import RatingBox from './RatingBox';
import './RatingBox.style.scss';


storiesOf('Utilities', module)
  .add('RatingBox', () => {
    const value = text('value', 'Rate title', 'value');
    const rate = number('rate', 5, 'rate');

    return <RatingBox value={value} rating={rate} />
  });
