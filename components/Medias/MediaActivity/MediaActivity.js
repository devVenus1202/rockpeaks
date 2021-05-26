import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Media } from 'reactstrap';
import PreviewImg from '@static/images/preview-img.jpg';
import Link from 'next/link';

import './MediaActivity.style.scss';
import ThumbImage from '@components/Utilities/ThumbImage';

class MediaActivity extends Component {
  handleImgError = event => {
    event.target.onerror = null;
    event.target.src = PreviewImg;
  };

  render() {
    const { imgUrl, title, desc, status, imgLink } = this.props;
    let imgSrc;
    if (imgUrl) {
      imgSrc = imgUrl;
    } else {
      imgSrc = PreviewImg;
    }

    return (
      <Media className="media-activity">
        <div className="d-flex">
          <div className="thumb-block mr-4">
            {imgLink ? (
              <Link href={imgLink}>
                <ThumbImage src={imgSrc} onError={this.handleImgError} alt="" />
              </Link>
            ) : (
              <ThumbImage src={imgSrc} onError={this.handleImgError} alt="" />
            )}
          </div>

          <Media body>
            <h6 className="mb-0 mt-0 title">{title}</h6>
            <p className="mb-0 h6">{desc}</p>
            <p className="mb-0">{status}</p>
          </Media>
        </div>
      </Media>
    );
  }
}

MediaActivity.defaultProps = {
  imgUrl: '',
  show: '',
};

MediaActivity.propTypes = {
  imgUrl: PropTypes.string,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
};

export default MediaActivity;
