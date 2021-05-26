import React from 'react';
import { ApolloProvider } from 'react-apollo';
import cookie from 'cookie';
import initApollo from '@lib/initApollo';
import { storiesOf } from '@storybook/react';
import Show from './Show';

function parseCookies(req, options = {}) {
  return cookie.parse(
    req ? req.headers.cookie || '' : document.cookie,
    options
  );
}

const apolloClient = initApollo({}, {
  getToken: req => parseCookies(req).token,
});

const mockHandler = () => {};

storiesOf('AddClipForm/Show', module)
  .add('default', () => {
    return (
      <ApolloProvider client={apolloClient}>
        <Show
          setClipField={mockHandler}
          onNext={mockHandler}
          onBack={mockHandler}
        />
      </ApolloProvider>
    );
  });
