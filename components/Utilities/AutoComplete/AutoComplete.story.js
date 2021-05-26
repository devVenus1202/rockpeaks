import React from 'react';
import { storiesOf } from '@storybook/react';
import AutoComplete from './AutoComplete';

const mockHandler = () => {};

storiesOf('Utilities', module).add('AutoComplete', () => (
  <AutoComplete items={['a', 'aa', 'abc', 'abcd']} onChange={mockHandler} />
));
