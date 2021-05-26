import React from 'react';
import moment from 'moment';
import { storiesOf } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs';
import cookie from 'cookie';
import { ApolloProvider } from 'react-apollo';
import initApollo from '@lib/initApollo';
import ContentBox from './ContentBox';

function parseCookies(req, options = {}) {
  return cookie.parse(req ? req.headers.cookie || '' : document.cookie, options);
}

const apolloClient = initApollo(
  {},
  {
    getToken: req => parseCookies(req).token,
  },
);

storiesOf('ContentBox', module).add('default', () => {
  const isLight = boolean('isLight', false, false);
  return (
    <ApolloProvider client={apolloClient}>
      <div className={isLight ? 'theme-light' : 'theme-dark'}>
        <ContentBox date={moment('20060614', 'YYYYMMDD')} category="all" types={{}} />
      </div>
    </ApolloProvider>
  );
});
