import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { storiesOf } from '@storybook/react';
import { select } from '@storybook/addon-knobs/react';
import cookie from 'cookie';
import initApollo from '@lib/initApollo';
import TypeBox from './TypeBox';
import TypeBoxLoader from './TypeBoxLoader';

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

storiesOf('TypeBox', module)
  .add('default', () => {
    const categories = ['genre', 'all', 'clip', 'disc', 'artist', 'show'];
    const category = select('category', categories, 'clip', 'category');

    return (
      <ApolloProvider client={apolloClient}>
        <TypeBox
          category={category}
          onChange={mockHandler}
          types={{}}
        />
      </ApolloProvider>
    );
  });

  storiesOf('TypeBox/TypeBoxLoader', module)
  .add('default', () => (
    <TypeBoxLoader />
  ));
