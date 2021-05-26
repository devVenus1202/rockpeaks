import React from 'react';
import { storiesOf } from '@storybook/react';
import AppProvider from '@components/AppContext';
import apolloStorybookDecorator from 'apollo-storybook-react';

import { boolean } from '@storybook/addon-knobs/react';
import AccountSetting from './AccountSetting';

import '@styles/_main.scss';

const userInfo = { user_email: 'test@gmail.com', user_name: 'test', user_avatar: '' };
const typeDefs = `
  type Query {
    helloWorld: String
  }

  schema {
    query: Query
  }
`;

const mocks = {
  Query: () => {
    return {
      helloWorld: () => {
        return 'Hello from Apollo!!';
      },
    };
  },
};

storiesOf('AccountSetting', module)
  .addDecorator(
    apolloStorybookDecorator({
      typeDefs,
      mocks,
    }),
  )
  .add('default', () => {
    const theme = boolean('light', false, false);
    return (
      <AppProvider authentication={{ isLogin: true, userInfo }}>
        <AccountSetting isOpen theme={theme ? 'light' : 'dark'}>
          <div>Children</div>
        </AccountSetting>
      </AppProvider>
    );
  });
