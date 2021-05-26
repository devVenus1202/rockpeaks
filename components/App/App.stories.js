import React from 'react';
import { storiesOf } from '@storybook/react';
import AppProvider from '@components/AppContext';

import App from './App';

import '@styles/_main.scss';

const userInfo = { user_email: 'test@gmail.com', user_name: 'test', user_avatar: '' };
storiesOf('App', module).add('default', () => (
  <AppProvider authentication={{ isLogin: true, userInfo }}>
    <App>
      <div>Children</div>
    </App>
  </AppProvider>
));
