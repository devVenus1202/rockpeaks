import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class player extends Component {
  static propTypes = {
    prop: PropTypes,
  };

  render() {
    return <div />;
  }

  componentDidMount() {
    const {
      url: {
        query: { nid, title },
      },
    } = this.props;
  }
}
