import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, number } from '@storybook/addon-knobs/react';
import PaginationBar from './PaginationBar';
import './PaginationBar.style.scss';

storiesOf('Utilities', module).add('PaginationBar', () => {
  const pages = number('pages', 5, 'pages');

  return <PaginationBar pages={pages} />;
});
