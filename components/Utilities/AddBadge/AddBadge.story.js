import React from 'react';
import { storiesOf } from '@storybook/react';
import AddBadge from './AddBadge';

const mockHandler = () => {};

storiesOf('Utilities/AddBadge', module)
  .add('default', () => (
    <AddBadge
      value=""
      onChange={mockHandler}
    />
  ));
