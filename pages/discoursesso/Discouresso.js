import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import DiscourseLogin from '@graphql/discourse/DiscourseLogin.graphql';
import Router from 'next/router';

class Discouresso extends Component {
  static propTypes = {
    url: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,
  };

  // static async getInitialProps({ ctx }) {
  //   if (ctx) {
  //     console.log('Server');
  //     return {};
  //   }
  //   console.log('Client');
  //   return ctx;
  // }

  async UNSAFE_componentWillMount() {
    const {
      url: { query },
    } = this.props;
    const { client } = this.props;
    const { data, error, loading } = await client.mutate({ mutation: DiscourseLogin, variables: query });
    if (data) {
      const {
        discourseLogin: { redirectUrl, error },
      } = data;
      if (redirectUrl) {
        // Router.push(redirectUrl);
        window.location.href = redirectUrl;
      }
    }
  }

  render() {
    const {
      url: { query },
    } = this.props;
    return <div />;
  }
}

export default withApollo(Discouresso);
