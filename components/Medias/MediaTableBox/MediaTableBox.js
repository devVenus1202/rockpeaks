import React, { Component } from 'react';
import { Router } from '@root/routes.esm';

import PropTypes from 'prop-types';
import { Media } from 'reactstrap';
import { getConcatenatedURI } from '@helpers/urlHelper';
import PreviewImg from '@static/images/preview-img.jpg';
import ClipIcon from '@static/images/icons/svg/Clips-Icon-nav.svg';
import DiscIcon from '@static/images/icons/svg/Discs-Icon-nav.svg';
import ArtistIcon from '@static/images/icons/svg/Artist-Icon-nav.svg';
import ShowIcon from '@static/images/icons/svg/Show-Icon-nav.svg';
import './MediaTableBox.style.scss';

class MediaTableBox extends Component {
  handleImgError = event => {
    event.target.onerror = null;
    event.target.src = PreviewImg;
  };

  clickMedia = () => {
    const { type, data, onClick } = this.props;
    if (onClick) {
      onClick();
    }
  };

  handleClickLink = (...values) => event => {
    event.stopPropagation();
    Router.pushRoute(getConcatenatedURI(...values));
  };

  handleGotoCalendar = date => event => {
    event.stopPropagation();
    Router.pushRoute(`/browse/calendar?date=${date}`);
  };

  renderContent = () => {
    const { type, data } = this.props;

    if (type === 'clip') {
      const { nid, artistnid, artist, shownid, show, date, dateValue } = data;

      return (
        <ul className="media-list clip-media-list">
          <li>
            <a onClick={this.handleClickLink('artists', artistnid)}>{artist}</a>
          </li>
          <li>
            <a onClick={this.handleClickLink('shows', shownid)}>{show}</a>
          </li>
          <li>
            <a onClick={this.handleGotoCalendar(dateValue)}>{date}</a>
          </li>
        </ul>
      );
    }

    if (type === 'disc') {
      const { discType, clipsCountActive, clipsCountTotal } = data;

      return (
        <ul className="media-list">
          <li>
            <a href="#">{`Type: ${discType}`}</a>
          </li>
          <li>
            <a href="#">{`Total Clips: ${clipsCountTotal}`}</a>
          </li>
          <li>
            <a href="#">{`Active Clips: ${clipsCountActive}`}</a>
          </li>
        </ul>
      );
    }

    if (type === 'artist') {
      const { clipsCountTotal, clipsCountActive } = data;

      return (
        <ul className="media-list">
          <li>
            <a href="#">{`Total Clips: ${clipsCountTotal}`}</a>
          </li>
          <li>
            <a href="#">{`Active Clips: ${clipsCountActive}`}</a>
          </li>
          <li>
            <a href="#">{`Missing Clips: ${clipsCountTotal - clipsCountActive}`}</a>
          </li>
        </ul>
      );
    }

    if (type === 'show') {
      const { clipsCountActive, clipsCountTotal } = data;

      return (
        <ul className="media-list">
          <li>
            <a href="#">{`Total Clips: ${clipsCountTotal}`}</a>
          </li>
          <li>
            <a href="#">{`Active Clips: ${clipsCountActive}`}</a>
          </li>
          <li>
            <a href="#">{`Missing Clips: ${clipsCountTotal - clipsCountActive}`}</a>
          </li>
        </ul>
      );
    }
    return '';
  };

  render() {
    const { type, data } = this.props;

    const { clipActive, title } = data;
    let { imgURL } = data;
    if (imgURL === null) {
      imgURL = PreviewImg;
    }

    const mediaIcons = {
      clip: ClipIcon,
      disc: DiscIcon,
      artist: ArtistIcon,
      show: ShowIcon,
    };

    let clipEnabled = '';
    if (clipActive && parseInt(clipActive, 10) < 1) {
      clipEnabled = 'clip-missing';
    }

    return (
      <Media className="media-tablebox-style" onClick={this.clickMedia}>
        <div className={`align-self-start mr-3 position-relative ${clipEnabled}`}><img className="" src={imgURL} onError={this.handleImgError} alt="" /></div>
        <Media className="align-self-center" body>
          <div className="row">
            <div className="col-md-8">
              <h5 className="mt-0 ">{title}</h5>
              {this.renderContent()}
            </div>
            <div className="col-md-4 align-self-center">
              <div className="text-lg-right text-left">
                <a className="icon-content-types" href="#0">
                  <img src={mediaIcons[type]} alt="" />
                </a>
              </div>
            </div>
          </div>
        </Media>
      </Media>
    );
  }
}

MediaTableBox.propTypes = {
  onClick: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
};

export default MediaTableBox;
