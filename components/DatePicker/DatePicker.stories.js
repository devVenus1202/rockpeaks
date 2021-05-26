import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import DatePicker from './DatePicker';
import DatePickerHeader from './DatePickerHeader';
import Calendar from './Calendar';
import './DatePicker.style.scss';

const mockHandler = () => {};

storiesOf('DatePicker', module)
  .add('default', () => (
    <DatePicker />
  ));

storiesOf('DatePicker/DatePickerHeader', module)
  .add('default', () => (
    <DatePickerHeader />
  ));

storiesOf('DatePicker/Calendar', module)
  .add('default', withInfo()(() => {
    return (
      <Calendar
        date={Date.now()}
        onChange={mockHandler}
      />
    );
  }));
