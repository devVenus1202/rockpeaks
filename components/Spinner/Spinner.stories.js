import React from 'react';
import { storiesOf } from '@storybook/react';
import Spinner from '.';

import '@styles/_main.scss';

storiesOf('Spinner', module).add('default', () => {
  return <Spinner />;
});
