import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Profile from '@components/Profile';
import App from '@components/App';

class ProfilePage extends Component {
  static propTypes = {
    url: PropTypes.object.isRequired,
  };

  render() {
    const {
      url: {
        query: { uid },
      },
    } = this.props;
    return (
      <App pageClass="profile-page" page="profile">
        <Profile uid={uid} />
      </App>
    );
  }
}
export default ProfilePage;
