/* eslint-disable implicit-arrow-linebreak */
import React, { Component } from 'react';
import { auth } from '../../helpers/auth';

const getDisplayName = Component => Component.displayName || Component.name || 'Component';

export const withAuthSync = WrappedComponent =>
  class extends Component {
    static displayName = `withAuthSync(${getDisplayName(WrappedComponent)})`;

    static async getInitialProps(ctx) {
      const authInfo = auth(ctx);
      console.log('initialProps', authInfo);
      const componentProps =        WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx));

      return { ...componentProps, authInfo };
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
