import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ErrorMessage extends Component {
  static propTypes = {
    message: PropTypes.string.isRequired,
  };

  render() {
    const { message } = this.props;
    return (
      <aside>
        {message}
        <style>
          {`aside {
        padding: 1.5em;
        font-size: 14px;
        color: white;
        background-color: red;
        }`}
        </style>
      </aside>
    );
  }
}

export default ErrorMessage;
