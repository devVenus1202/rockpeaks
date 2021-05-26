import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, number } from '@storybook/addon-knobs/react';
import RateBar from './RateBar';
import './RateBar.style.scss';


storiesOf('Utilities', module)
  .add('RateBar', () => {
    const rate = number('rate', 5, 'rate');

    return <RateBar rating={rate} />
  });
