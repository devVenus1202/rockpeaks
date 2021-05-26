import React from 'react';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs/react';
import { boolean } from '@storybook/addon-knobs';
import cookie from 'cookie';
import { ApolloProvider } from 'react-apollo';
import initApollo from '@lib/initApollo';
import CreatePlaylistForm from './CreatePlaylistForm';

function parseCookies(req, options = {}) {
  return cookie.parse(req ? req.headers.cookie || '' : document.cookie, options);
}

const apolloClient = initApollo(
  {},
  {
    getToken: req => parseCookies(req).token,
  },
);

storiesOf('CreatPlaylistForm', module).add('default', () => {
  const value = text('value', 'SEPTEMBER 24th, 2016');
  const isLight = boolean('IsLight', false, false);
  return (
    <ApolloProvider client={apolloClient}>
      <div className={isLight ? 'theme-light' : 'theme-dark'}>
        <CreatePlaylistForm />
      </div>
    </ApolloProvider>
  );
});
