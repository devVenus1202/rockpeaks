import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, boolean, select } from '@storybook/addon-knobs/react';
import { Heros } from '@locales/en/Heros';
import Hero from './Hero';
import './Hero.style.scss';

const label = 'Image types';
const options = ['hero-bg-1', 'hero-bg-2', 'hero-bg-3'];
const defaultValue = 'hero-bg-1';
const groupId = 'bgClass';
const bodyText = Heros.browse.body;

storiesOf('Hero', module)
  .add('default', () => {
    const bgClass = select(label, options, defaultValue, groupId);
    const title = text('title', 'Browse', 'title');
    const body = text('text', bodyText, 'text');
    const type = boolean('has next section?', 1, 'has next section?');

    return (
      <Hero
        bgClass={bgClass}
        url=""
        title={title}
        body={body}
        nextSection="#"
        type={type}
        key={title}
      />
    );
  });
