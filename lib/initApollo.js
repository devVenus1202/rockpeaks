import { ApolloClient, InMemoryCache } from 'apollo-boost';
import { createHttpLink } from 'apollo-link-http';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from 'apollo-link-context';
import fetch from 'isomorphic-unfetch';

let apolloClient = null;

const URI = process.env.GRAPHQL_URI;
const TOKEN = process.env.GRAPHQL_TOKEN;

// const URI =  'http://54.175.150.193/graphql';

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch;
}

function create(initialState, { getToken }) {
  const httpLink = createUploadLink({
    uri: URI,
    credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
    opts: {
      mode: 'no-cors',
    },
  });

  const authLink = setContext((_, { headers }) => {
    const token = getToken();
    // token = TOKEN;
    return {
      headers: {
        ...headers,
        'JWT-Authorization': token ? `Bearer ${token}` : undefined,
      },
    };
  });

  // TODO: check token auth
  const link = authLink.concat(httpLink);
  // link = httpLink;

  const defaultOptions = {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  };

  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    // link: authLink.concat(httpLink),
    link,
    cache: new InMemoryCache().restore(initialState || {}),
    defaultOptions,
  });
}

export default function initApollo(initialState, options) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState, options);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState, options);
  }

  return apolloClient;
}
