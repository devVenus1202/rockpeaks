import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './AlertBox.style.scss';

const icons = { success: 'fa-check-circle', warning: 'fa-warning' };
class Alert extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  };

  static defautlProps = {
    type: 'success',
  };

  componentDidMount() {
    window.addEventListener('load', this.onLoad);
  }

  componentWilUnmount() {
    window.removeEventListener('load', this.onLoad);
  }

  onLoad = () => {
    if (typeof this.props.onLoad !== 'undefined') {
      this.props.onLoad();
    }
  }
  
  render() {
    const { type = 'success', text, onClose } = this.props;

    console.log('text', text);
    return (
      <div
        className={`alert alert-${type} alert-dismissible fade show lone-message mb-0 mt-0`}
        role="alert"
      >
        <i
          className={`mr-2 text-${type} fa ${icons[type]}`}
          aria-hidden="true"
        />
        {text || this.props.children}
        <button
          className={`close text-${type}`}
          type="button"
          onClick={() => {
            onClose();
          }}
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
    );
  }
}

export default Alert;
