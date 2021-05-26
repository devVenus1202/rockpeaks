import React from 'react';
import { ApolloProvider } from 'react-apollo';
import cookie from 'cookie';
import initApollo from '@lib/initApollo';
import { storiesOf } from '@storybook/react';
import Found from './Found';

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

storiesOf('AddClipForm/Found', module)
  .add('default', () => (
    <ApolloProvider client={apolloClient}>
      <Found
        videoURL=""
        onChangeURL={mockHandler}
        setClipField={mockHandler}
        onNext={mockHandler}
        onBack={mockHandler}
      />
    </ApolloProvider>
  ));
