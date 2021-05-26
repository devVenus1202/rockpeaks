import React from 'react';
import moment from 'moment';
import { storiesOf } from '@storybook/react';
import { number } from '@storybook/addon-knobs/react';
import DatePagination from './DatePagination';
import './DatePagination.style.scss';

const mockHandler = () => {};

storiesOf('DatePagination', module).add('default', () => {
  const count = number('count', 15);
  const isLight = number('isLight', false, false);
  return (
    <DatePagination
      onChange={mockHandler}
      count={count}
      value={moment()}
      theme={isLight ? 'light' : 'dark'}
    />
  );
});
