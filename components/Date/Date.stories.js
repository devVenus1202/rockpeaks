import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import Date from '.';

import '@styles/_main.scss';

storiesOf('Date', module).add(
  'default',
  withInfo()(() => (
    <div>
      <Date year="2017" month={null} day={null} />
      <Date year="2017" month="03" day={null} />
      <Date year="2017" month="11" day="01" />
    </div>
  )),
);
