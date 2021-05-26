import React from 'react';
import { storiesOf } from '@storybook/react';
import cookie from 'cookie';
import { ApolloProvider } from 'react-apollo';
import initApollo from '@lib/initApollo';
import AppProvider from '@components/AppContext';
import Carousel from './Carousel';
import './Carousel.style.scss';

function parseCookies(req, options = {}) {
  return cookie.parse(
    req ? req.headers.cookie || '' : document.cookie,
    options,
  );
}

const apolloClient = initApollo(
  {},
  {
    getToken: req => parseCookies(req).token,
  },
);

const userInfo = { user_email: 'test@gmail.com', user_name: 'test', user_avatar: '' };
storiesOf('Carousel', module).add('default', () => (
  <ApolloProvider client={apolloClient}>
    <AppProvider authentication={{ isLogin: true, userInfo }}>
      <Carousel nid="403973" title="ROCKPALAST" type="show" />
    </AppProvider>
  </ApolloProvider>
));
