import React from 'react';
import PropTypes from 'prop-types';
import './VideoImageBox.style.scss';

const VideoImageBox = props => {
  const { url, onClick } = props;
  return (
    <div className="video-image-box" onClick={onClick}>
      <div className="thumb">
        <div className="image-wrapper">
          <img src={url} alt="" />
        </div>
      </div>
    </div>
  );
};

VideoImageBox.propTypes = {
  url: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default VideoImageBox;
