import App from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import React from 'react';
import { ApolloProvider } from 'react-apollo';

import '@styles/_main.scss';
import '@components/Header/Header.style.scss';
import '@components/Header/Brand/Brand.style.scss';

import AppProvider from '@components/AppContext';
import withApollo from '@lib/withApollo';
import { auth, USER_TOKEN, isValidToken, logout } from '@helpers/auth';
import { isEmpty } from '@helpers/validation';
import * as analytics from '@lib/analytics';

Router.events.on('routeChangeComplete', url => analytics.pageview(url));

class RockPeaksApp extends App {
  static async getInitialProps({ ctx }) {
    if (ctx) {
      let composedInitialProps = {};
      if (this.getInitialProps) {
        composedInitialProps = await this.getInitialProps(ctx);
      }

      const url = {
        pathname: ctx.pathname,
        path: ctx.asPath,
        query: ctx.query,
      };

      let userInfo = auth(ctx.req);

      if (userInfo.user_name && !isValidToken(ctx.req)) {
        logout();
        userInfo = auth(ctx.req);
      }

      composedInitialProps = {
        ...composedInitialProps,
        url,
        authentication: {
          userInfo,
          isLogin: !isEmpty(userInfo[USER_TOKEN]),
        },
      };
      return composedInitialProps;
    }
    return ctx;
  }


  render() {
    const { Component, pageProps, apolloClient, url, authentication } = this.props;
    const newProps = {
      ...pageProps,
      url,
      authentication,
    };
    return (
      <>
        <Head>
          <title>RockPeaks</title>
        </Head>
        <ApolloProvider client={apolloClient}>
          <AppProvider authentication={authentication}>
            <Component {...newProps} />
          </AppProvider>
        </ApolloProvider>
      </>
    );
  }
}

export default withApollo(RockPeaksApp);
