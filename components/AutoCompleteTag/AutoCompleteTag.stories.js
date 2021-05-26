import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, number } from '@storybook/addon-knobs/react';
import cookie from 'cookie';
import { ApolloProvider } from 'react-apollo';
import initApollo from '@lib/initApollo';

import AutoCompleteTag from './AutoCompleteTag';
import './AutoCompleteTag.style.scss';

function parseCookies(req, options = {}) {
  return cookie.parse(req ? req.headers.cookie || '' : document.cookie, options);
}

const apolloClient = initApollo(
  {},
  {
    getToken: req => parseCookies(req).token,
  },
);

storiesOf('AutoCompleteTag', module).add('async', () => {
  const value = text('value', 'Rate title', 'value');
  const rate = number('rate', 5, 'rate');

  return (
    <ApolloProvider client={apolloClient}>
      <AutoCompleteTag value={value} rating={rate} />
    </ApolloProvider>
  );
});
