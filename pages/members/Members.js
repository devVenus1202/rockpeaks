import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Profile from '@components/Profile';

class Members extends Component {
  static propTypes = {
    url: PropTypes.object.isRequired,
  };

  render() {
    const {
      url: {
        query: { uid },
      },
    } = this.props;
    return <Profile uid={uid} />;
  }
}
export default Members;
