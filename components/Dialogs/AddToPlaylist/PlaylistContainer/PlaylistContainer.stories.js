import React from 'react';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs/react';
import { boolean } from '@storybook/addon-knobs';
import cookie from 'cookie';
import { ApolloProvider } from 'react-apollo';
import initApollo from '@lib/initApollo';
import PlaylistContainer from './PlaylistContainer';

function parseCookies(req, options = {}) {
  return cookie.parse(req ? req.headers.cookie || '' : document.cookie, options);
}

const apolloClient = initApollo(
  {},
  {
    getToken: req => parseCookies(req).token,
  },
);

storiesOf('PlaylistContainer', module).add('default', () => {
  const value = text('value', 'SEPTEMBER 24th, 2016');
  const isLight = boolean('IsLight', false, false);
  const playlists = [{ title: 'History' }, { title: 'Watch Later' }, { title: 'Favourites' }];
  return (
    <ApolloProvider client={apolloClient}>
      <PlaylistContainer playlists={playlists} />
    </ApolloProvider>
  );
});
