import React, { Component } from 'react';
import { Router } from '@root/routes.esm';
import PropTypes from 'prop-types';
import { Media, Button } from 'reactstrap';

import { getConcatenatedURI } from '@helpers/urlHelper';
import PreviewImg from '@static/images/preview-img.jpg';

import { ICONS } from '@lib/icons';
import { decodeHtmlSpecialChars } from '@helpers/stringHelper';
import './MediaBox.style.scss';
import Link from 'next/link';
import Icon from '../../Icon';

import LazyLoad from 'react-lazyload';

class MediaBox extends Component {
  handleImgError = event => {
    event.target.onerror = null;
    event.target.src = PreviewImg;
  };

  handleClick = () => {
    const { onClick } = this.props;

    if (onClick) {
      onClick();
    }
  };

  // handleClickLink = (...values) => event => {
  //   event.stopPropagation();
  //   Router.pushRoute(getConcatenatedURI(...values));
  // };

  addToPlaylist = nid => {
    const { onAddPlaylist } = this.props;
    onAddPlaylist(nid);
  };

  render() {
    const { data } = this.props;
    const { nid, imgUrl, dateTime, artistnid, artist, shownid, show, clipTitle } = data;
    const placeholderUrl = '/static/images/clip-img-placeholder-alpha.svg';
    return (
      <Media onClick={this.handleClick} className="media-box-style">
        <a className="d-flex">
          <div className="thumb-container mr-3">
            <Button
              color="link"
              className="btn-add-to-playlist"
              onClick={e => {
                e.stopPropagation();
                //e.preventDefault();
                this.addToPlaylist(nid);
              }}
            >
              <Icon color="#b9c5d8" icon={ICONS.ADD_TO_PLAYLIST} />
            </Button>
            <a className="thumb" href={getConcatenatedURI('video', nid, artist, show, clipTitle)}>
              {/* onClick={handleClickLink('video', nid)} */}

              <div className="image-wrapper">
                <LazyLoad overflow="true">
                  <img
                    className=""
                    src={imgUrl}
                    alt={`${clipTitle} | ${artist} | ${show} `}
                    onError={this.handleImgError}
                  />
                </LazyLoad>
              </div>
            </a>
          </div>
          <Media body>
            <h5 className="mb-0 mt-0 ">{dateTime}</h5>
            <p className="mb-0">
              <Link href={getConcatenatedURI('artists', artistnid, artist)}>{decodeHtmlSpecialChars(artist)}</Link>
            </p>
            <p className="mb-0">
              <Link href={getConcatenatedURI('shows', shownid, show)}>{decodeHtmlSpecialChars(show)}</Link>
            </p>
            <p className="mb-0">
              {/* onClick={this.handleClickLink('video', nid, artist, show, clipTitle)} */}
              <Link href={getConcatenatedURI('video', nid, artist, show, clipTitle)}>
                {decodeHtmlSpecialChars(clipTitle)}
              </Link>
            </p>
          </Media>
        </a>
      </Media>
    );
  }
}

MediaBox.propTypes = {
  onClick: PropTypes.func,
  data: PropTypes.object.isRequired,
};

export default MediaBox;
