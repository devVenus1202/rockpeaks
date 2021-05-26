import React from 'react';
import { storiesOf } from '@storybook/react';
import DateInput from './DateInput';

const mockHandler = () => {};

storiesOf('AddClipForm/DateInput', module)
  .add('default', () => (
    <DateInput
      setClipField={mockHandler}
      onNext={mockHandler}
      onBack={mockHandler}
    />
  ));
