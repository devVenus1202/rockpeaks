import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, boolean } from '@storybook/addon-knobs/react';

import NavCarousel from '.';

storiesOf('NavCarousel', module).add('NavCarousel', () => {
  const isLight = boolean('isLight', false, false);
  const userId = text('user', 'User', 'user');
  const items = [
    {
      entityId: '411050',
      entityBundle: 'artist',
      entityLabel: 'Grateful Dead',
    },
    {
      entityId: '403921',
      entityBundle: 'show',
      entityLabel: 'Woodstock',
    },
    {
      entityId: '468400',
      entityBundle: 'artist',
      entityLabel: 'Jack Kerouac',
    },
    {
      entityId: '411650',
      entityBundle: 'artist',
      entityLabel: 'Who',
    },
    {
      entityId: '411050',
      entityBundle: 'artist',
      entityLabel: 'Grateful Dead',
    },
    {
      entityId: '403921',
      entityBundle: 'show',
      entityLabel: 'Woodstock',
    },
    {
      entityId: '468400',
      entityBundle: 'artist',
      entityLabel: 'Jack Kerouac',
    },
    {
      entityId: '411650',
      entityBundle: 'artist',
      entityLabel: 'Who',
    },
  ];
  return (
    <div className={`theme-${isLight ? 'light' : 'dark'}`}>
      <NavCarousel items={items} theme={`${isLight ? 'light' : 'dark'}`} />
    </div>
  );
});
