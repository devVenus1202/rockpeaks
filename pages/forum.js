import React from 'react';
import App from '@components/App';

export default props => (
  <App>
    <article>
      <h1>Forum</h1>
      <p>
        <a href="http://dev.apollodata.com">Apollo</a> is a GraphQL client that
        allows you to easily query the exact data you need from a GraphQL
        server. In addition to fetching and mutating data, Apollo analyzes your
        queries and their results to construct a client-side cache of your data,
        which is kept up to date as further queries and mutations are run,
        fetching more results from the server.
      </p>
    </article>
  </App>
);
