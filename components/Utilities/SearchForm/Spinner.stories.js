import React from 'react';
import { storiesOf } from '@storybook/react';
import SearchForm from '.';

import '@styles/_main.scss';

storiesOf('Utilities/SearchForm', module).add('default', () => {
  return <SearchForm />;
});
