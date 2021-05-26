import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ThumbImage.style.scss';

export default class ThumbImage extends Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
  };

  render() {
    const { src } = this.props;
    return (
      <div className="thumb-image thumb-container">
        <div className="thumb">
          <a>
            <div className="image-wrapper">
              <img className="nav-link-card-image" src={src} alt="" />
            </div>
          </a>
        </div>
      </div>
    );
  }
}
