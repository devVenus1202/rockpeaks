import React from 'react';
import { storiesOf } from '@storybook/react';
import cookie from 'cookie';
import { ApolloProvider } from 'react-apollo';
import initApollo from '@lib/initApollo';
import SearchResults from './SearchResults';

function parseCookies(req, options = {}) {
  return cookie.parse(
    req ? req.headers.cookie || '' : document.cookie,
    options
  );
}

const apolloClient = initApollo({}, {
  getToken: req => parseCookies(req).token,
});

storiesOf('SearchResults', module)
  .add('default', () => (
    <ApolloProvider client={apolloClient}>
      <SearchResults
        type={{}}
        key={{}}
      />
    </ApolloProvider>
  ));
