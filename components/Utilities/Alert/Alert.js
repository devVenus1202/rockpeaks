import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../../../styles/_main.scss';

class Alert extends Component {
  render() {
    const { value, variant } = this.props;
    return (
      <div className={`alert alert-${variant} mb-0 mt-0`} role="alert" dangerouslySetInnerHTML={{ __html: value }} />
    );
  }
}

Alert.propTypes = {
  variant: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default Alert;
