import React from 'react';
import cookie from 'cookie';
import { ApolloConsumer } from 'react-apollo';
import PropTypes from 'prop-types';

import redirect from '@lib/redirect';
import checkLoggedIn from '@lib/checkLoggedIn';

import App from '@components/App';

export default class Index extends React.Component {
  static propTypes = {
    loggedInUser: PropTypes.object.isRequired,
  };

  static async getInitialProps(context) {
    const { loggedInUser } = await checkLoggedIn(context.apolloClient);
    if (!loggedInUser.user) {
      // If not signed in, send them somewhere more useful
      redirect(context, '/signin');
    }

    return { loggedInUser };
  }

  signout = apolloClient => () => {
    document.cookie = cookie.serialize('token', '', {
      maxAge: -1, // Expire the cookie immediately
    });

    // Force a reload of all the current queries now that the user is
    // logged in, so we don't accidentally leave any state around.
    apolloClient.cache.reset().then(() => {
      // Redirect to a more useful page when signed out
      redirect({}, '/signin');
    });
  };

  render() {
    //     const { loggedInUser: { user: { name } } } = this.props;
    const name = 'User';
    return (
      <ApolloConsumer>
        {client => (
          <div>
            <App>
              Hello {name}
              <br />
              <button type="submit" onClick={this.signout(client)}>
                Sign out
              </button>
            </App>
          </div>
        )}
      </ApolloConsumer>
    );
  }
}
