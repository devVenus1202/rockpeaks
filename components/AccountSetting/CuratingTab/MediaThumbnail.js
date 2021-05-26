import React, { Component } from 'react';
import PropTypes from 'prop-types';

class MediaThumbnail extends Component {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    imgURL: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  }

  handleClick = () => {
    this.props.onClick();
  }

  render() {
    const {
      active,
      imgURL,
      value,
      status,
    } = this.props;

    const style = `d-inline-block text-center vertical-card vertical-card${active ? '-active' : ''} media-thumbnail-card`

    return (
      <a
        className={style}
        onClick={this.handleClick}
      >
        <div className="nav-link-card">
          <img
            className="nav-link-card-poster"
            src={imgURL}
            alt=""
          />
        </div>
        <br />
        {value}
        <br />
        {status}
        <i className="fa fa-angle-down" aria-hidden="true" />
      </a>
    );
  }
}

export default MediaThumbnail;