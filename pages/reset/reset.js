import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ResetPassword from '@components/ResetPassword';
import App from '@components/App';

export default class Reset extends PureComponent {
  static propTypes = {
    url: PropTypes.object.isRequired,
  };

  render() {
    const {
      url: {
        query: { uid, timestamp, hash },
      },
    } = this.props;
    return (
      <App pageClass="profile-page" page="profile">
        <ResetPassword uid={uid} timestamp={timestamp} hash={hash} />
      </App>
    );
  }
}
