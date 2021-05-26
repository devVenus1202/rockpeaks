import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ReactJWPlayer from 'react-jw-player';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import Icon from '@components/Icon';

import CheckedIcon from '@static/images/icons/svg/Checked-Circle-Icon-Normal.svg';
import CloseIcon from '@static/images/icons/svg/Close-Circle-Icon-Normal.svg';
import Playlist from '@static/images/icons/svg/Playlist.svg';
import PlayingIcon from '@static/images/icons/svg/Playing.svg';
import InactiveIcon from '@static/images/icons/svg/Clip-Missing.svg';
import './JWPlayer.style.scss';
import { ICONS } from '@lib/icons';

import { get as _get } from 'lodash/object';

const hasDocument = typeof document === 'object' && document !== null;
const bodyEl = hasDocument && document.body;

class JWPlayer extends Component {
  static propTypes = {
    srcURL: PropTypes.string,
    playlist: PropTypes.array,
    playlistTitle: PropTypes.string,
    play: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    handleError: PropTypes.func,
  };

  static defaultProps = {
    playlist: [],
    playlistTitle: null,
    handleError: () => {},
    withMetadata: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false,
      playlistOpen: false,
      curIndex: -1,
      defaultUrl: '',
      showHeader: false,
      playlist: [],
      playlistCurrentItem: 0,
      seekingStatus: true,
    };

    this.onPlay = this.onPlay.bind(this);
    this.onError = this.onError.bind(this);
    this.onReady = this.onReady.bind(this);
    this.onVideoLoad = this.onVideoLoad.bind(this);
    this.onTime = this.onTime.bind(this);
    this.onAutoStart = this.onAutoStart.bind(this);
  }

  onReady(event) {
    console.log('jwplayer ready.');
  }

  onPlay(event) {
    console.log('jwplayer play.');
    const { playlist, playlistCurrentItem } = this.state;
    if (typeof playlist[playlistCurrentItem] !== 'undefined') {
      const player = window.jwplayer('jw-player');
      const video = playlist[playlistCurrentItem];

      // @todo Move this to shared library.
      let videoInSecs = _get(video, 'meta.in_point.s', 0);
      let videoInMins = _get(video, 'meta.in_point.m', 0);
      let videoInHours = _get(video, 'meta.in_point.h', 0);
      let videoOutSecs = _get(video, 'meta.out_point.s', 0);
      let videoOutMins = _get(video, 'meta.out_point.m', 0);
      let videoOutHours = _get(video, 'meta.out_point.h', 0);
      let videoStartTime =
        videoInSecs + videoInMins * 60 + videoInHours * 60 * 60;
      let videoEndTime =
        videoOutSecs + videoOutMins * 60 + videoOutHours * 60 * 60;

      player.seek(videoStartTime);
    }
  }

  onAutoStart(event) {
    console.log('jwplayer onAutoStart.');
  }

  onVideoLoad(event) {
    console.log('jwplayer load video.');
    this.setState({
      playlistCurrentItem: event.index,
    });
  }

  onTime(event) {
    const { playlist, playlistCurrentItem } = this.state;
    if (typeof playlist[playlistCurrentItem] !== 'undefined') {
      const player = window.jwplayer('jw-player');
      const video = playlist[playlistCurrentItem];

      // @todo Move this to shared library.
      let videoInSecs = _get(video, 'meta.in_point.s', 0);
      let videoInMins = _get(video, 'meta.in_point.m', 0);
      let videoInHours = _get(video, 'meta.in_point.h', 0);
      let videoOutSecs = _get(video, 'meta.out_point.s', 0);
      let videoOutMins = _get(video, 'meta.out_point.m', 0);
      let videoOutHours = _get(video, 'meta.out_point.h', 0);
      let videoStartTime =
        videoInSecs + videoInMins * 60 + videoInHours * 60 * 60;
      let videoEndTime =
        videoOutSecs + videoOutMins * 60 + videoOutHours * 60 * 60;

      // Stop playing if out point is reached.
      if (videoEndTime > 0) {
        if (event.position >= videoEndTime) {
          player.seek(videoEndTime);
          player.pause();
        }
      }

      // Force to play from the in point.
      if (event.position < videoStartTime) {
        player.seek(videoStartTime);
      }
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { playlist } = nextProps;

    let jwPlaylist = [];
    if (playlist !== null && playlist.length > 0) {
      // Fix playlist items.
      jwPlaylist = playlist.map(item => {
        if (item.file === 'Inactive') {
          return {
            ...item,
            status: false,
            file: 'https://youtube.com/watch?v=none',
          };
        }
        return { ...item, status: true };
      });
    }
    this.setState({ playlist: jwPlaylist });
  }

  handleRef = ref => {
    if (ref) {
      this.ref = ref;
    }
  };

  handlePlayerRef = ref => {
    if (ref) {
      this.playerRef = ref;
    }
  };

  handleClose = () => {
    const { onClose } = this.props;
    if (onClose) {
      onClose();
    }
  };

  changeOption = event => {
    const defaultUrl = event.target.value;
    this.setState({ defaultUrl });
  };

  toggle = () => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen,
    }));
  };

  showHeader = () => {
    this.setState({ showHeader: true });
  };

  hideHeader = () => {
    setTimeout(() => {
      this.setState({ showHeader: false });
    }, 2000);
  };

  togglePlaylist = () => {
    this.setState(prevState => ({
      playlistOpen: !prevState.playlistOpen,
    }));
  };

  onError = error => {
    console.log('jwplayer error: ', error);
    const { handleError } = this.props;
    const { playlist, playlistCurrentItem } = this.state;

    for (let i = playlistCurrentItem + 1; i <= playlist.length; i++) {
      if (typeof playlist[i] === 'undefined') {
        handleError(error);
        return;
      }

      const player = window.jwplayer('jw-player');
      player.playlistItem(i);
      this.setState({ playlistCurrentItem: i });
      break;
    }

    handleError(error);
  };

  render() {
    const { srcURL, play, videoImageURL, metadataStatus, vttFile } = this.props;
    const { playlistTitle, withMetadata } = this.props;

    const {
      defaultUrl,
      dropdownOpen,
      playlistOpen,
      curIndex,
      showHeader,
    } = this.state;

    let { playlist, playlistCurrentItem } = this.state;
    // console.log(playlist)

    const currentIndex = playlist
      ? playlist.findIndex(item => item.default === true)
      : -1;
    // console.log(currentIndex)

    const currentItem =
      currentIndex === -1
        ? null
        : playlist[curIndex === -1 ? currentIndex : curIndex];

    if (!play) {
      return '';
    }

    let playlistTitleValue = playlistTitle;
    if (playlist !== null && !withMetadata) {
      let tracks = [];
      if (metadataStatus && vttFile) {
        tracks = [
          {
            file: vttFile,
            kind: 'thumbnails',
          },
        ];
      }
      playlist = playlist.map(item => {
        if (tracks.length === 0) {
          return item;
        }
        return { ...item, tracks: tracks };
      });
    }

    if (playlist === null && srcURL) {
      let tracks = [];
      if (metadataStatus && vttFile) {
        tracks = [
          {
            file: vttFile,
            kind: 'thumbnails',
          },
        ];
      }
      playlist = [
        {
          file: srcURL,
          image: videoImageURL,
          tracks: tracks,
        },
      ];
    }

    return ReactDOM.createPortal(
      <div className="jw-player-container" ref={this.handleRef}>
        <div
          className={`jw-player-header ${
            showHeader ? 'show-header' : 'hidden-header'
          }`}
          onMouseMove={this.showHeader}
          onMouseLeave={this.hideHeader}
        >
          {!playlistOpen && (
            <img
              className="jw-player-close-icon"
              onClick={this.handleClose}
              src={CloseIcon}
              alt=""
            />
          )}
          {playlist && !playlistOpen && (
            // <img
            //   className="jw-player-playlist-icon"
            //   onClick={this.togglePlaylist}
            //   src={Playlist}
            //   alt=""
            // />
            <div
              className="jw-player-playlist-icon"
              onClick={this.togglePlaylist}
            >
              <Icon size={40} icon={ICONS.REVEALPLAYLIST} color="#8293A7" />
            </div>
          )}
        </div>
        {playlistOpen && (
          <div className="jw-player-playlist">
            <div className="jw-player-playlist-caption">
              <span>{playlistTitleValue}</span>
              <img
                className="jw-player-list-close"
                onClick={this.togglePlaylist}
                src={CloseIcon}
                alt=""
              />
            </div>
            <ul className="jw-player-list">
              {playlist.map((item, index) => (
                <li
                  key={index}
                  className={`jw-player-list-item ${
                    item.status === false ? '' : 'active'
                  }`}
                  onClick={() => {
                    const player = window.jwplayer('jw-player');
                    player.playlistItem(index);
                    this.setState({ playlistCurrentItem: index });
                  }}
                >
                  <div className="jw-player-list-item-container">
                    <span className="jw-player-list-number">
                      {playlistCurrentItem === index ? (
                        <img
                          className="jw-player-list-playing"
                          src={PlayingIcon}
                          alt=""
                        />
                      ) : (
                        index + 1
                      )}
                    </span>
                    <div className="jw-player-thumbnail-container">
                      {item.status === false && (
                        <>
                          <div className="jw-player-list-thumbnail-overlay" />
                          <img
                            className="jw-player-list-thumbnail-inactive"
                            src={InactiveIcon}
                            alt="Preview"
                          />
                        </>
                      )}
                      <img
                        className="jw-player-list-thumbnail"
                        src={item.image}
                        alt="Preview"
                      />
                    </div>
                    <span className="jw-player-list-title">{item.title}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* {playlist && currentItem && (
          <Dropdown
            className="jw-player-menu-icon"
            color="danger"
            size="sm"
            isOpen={dropdownOpen}
            toggle={this.toggle}
          >
            <DropdownToggle caret className="text-nowrap">
              {currentItem.resolution}
            </DropdownToggle>
            <DropdownMenu>
              {playlist.map(item => {
                return (
                  <DropdownItem onClick={this.changeOption} value={item.file}>
                    {item.title}
                    {defaultUrl === item.file && (
                      <img
                        className="checkIcon pl-2"
                        src={CheckedIcon}
                        alt=""
                      />
                    )}
                  </DropdownItem>
                );
              })}
            </DropdownMenu>
          </Dropdown>
        )} */}

        <ReactJWPlayer
          className="clip-jw-player"
          playerId="jw-player"
          playerScript="https://cdn.jwplayer.com/libraries/OwYHiPKw.js"
          playlist={playlist}
          isAutoPlay
          ref={this.handlePlayerRef}
          onError={this.onError}
          onReady={this.onReady}
          onVideoLoad={this.onVideoLoad}
          onPlay={this.onPlay}
          onTime={this.onTime}
          onAutoStart={this.onAutoStart}
        />
      </div>,
      bodyEl,
    );
  }
}

export default JWPlayer;
