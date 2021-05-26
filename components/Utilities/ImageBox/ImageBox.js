import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PreviewImg from '@static/images/preview-img.jpg';

class ImageBox extends Component {
  handleImgError = event => {
    event.target.onerror = null;
    event.target.src = PreviewImg;
  }

  render() {
    const { src } = this.props;
    return (
      <img
        src={src}
        onError={this.handleImgError}
        alt=""
      />
    );
  }
}

ImageBox.propTypes = {
  src: PropTypes.string.isRequired,
};

export default ImageBox;
