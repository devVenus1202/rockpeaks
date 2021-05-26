import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get as _get } from 'lodash/object';
import { Query, withApollo } from 'react-apollo';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Spinner,
} from 'reactstrap';
import NumberFormat from 'react-number-format';
import Login from '@components/Header/Login';
import AlertBox from '@components/Utilities/AlertBox';
import { withContext } from '@components/HOC/withContext';
import VerticalCard from '@components/Utilities/VerticalCard';
import JWPlayer from '@components/Utilities/VideoPlayer/JWPlayer';
import VideoType from '@components/Utilities/VideoType';

import { getFormattedTime } from '@helpers/dateTimeHelper';
import CreatePublicClip from '@graphql/clip/CreatePublic.graphql';

import GET_PUBLIC_CLIP_DETAIL from '@graphql/clip/PublicClip.graphql';
import GET_ARCHIVE_CLIP_DETAIL from '@graphql/clip/ArchiveClip.graphql';
import GET_PERSONAL_CLIP_DETAIL from '@graphql/clip/PersonalClip.graphql';
import AddToDefaultPlaylist from '@graphql/playlist/AddToDefaultPlaylist.graphql';
import GetPlexTransCode from '@graphql/plex/GetPlexTransCode.graphql';
import GetPlexQualityOptions from '@graphql/plex/GetPlexQualityOptions.graphql';

import PlayIcon from '@static/images/icons/svg/Play-Icon.svg';
import Padlock from '@static/images/icons/svg/padlock.svg';
import TimeIconDark from '@static/images/icons/dark/Time-Icon.svg';
import TimeIconLight from '@static/images/icons/light/Time-Icon.svg';
import VideoIconDark from '@static/images/icons/dark/Video-Icon.svg';
import VideoIconLight from '@static/images/icons/light/Video-Icon.svg';

import { ICONS } from '@lib/icons';

import Icon from '../../Icon';
import VideoImageBox from '../VideoImageBox';

class VideoPlayer extends Component {
  state = {
    play: false,
    showDetailModal: false,
    youtubeURL: '',
    submitAvailable: false,
    showSuccess: false,
    showFailed: false,
    isUpdating: false,
    playlist: null,
  };

  static propTypes = {
    imgURL: PropTypes.string.isRequired,
    type: PropTypes.number.isRequired,
    nid: PropTypes.number.isRequired,
    client: PropTypes.object.isRequired,
    clip: PropTypes.object.isRequired,
    clipId: PropTypes.string.isRequired,
    info: PropTypes.object.isRequired,
    theme: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    selectedType: PropTypes.string.isRequired,
    isArchived: PropTypes.bool.isRequired,
    isPersonal: PropTypes.bool.isRequired,
    isPublished: PropTypes.bool.isRequired,
    plexAccount: PropTypes.object.isRequired,
    onChangeType: PropTypes.func.isRequired,
  };

  clipDetailQueries = [
    GET_PUBLIC_CLIP_DETAIL,
    GET_PERSONAL_CLIP_DETAIL,
    GET_ARCHIVE_CLIP_DETAIL,
  ];

  handlePlay = event => {
    const { client, clipId, clip, info } = this.props;
    console.log(this.props);

    if (client) {
      client.mutate({
        mutation: AddToDefaultPlaylist,
        variables: {
          playlistType: 'history',
          entityId: clipId,
        },
      });
    }
    let playlist = [];
    playlist.push({
      file: info.url,
      image: clip.thumbnail,
      title: info.clipTitle,
      default: true,
      meta: {
        duration: {
          s: _get(info, 'durationSecs', 0),
          m: _get(info, 'durationMins', 0),
          h: _get(info, 'durationHours', 0),
        },
        in_point: {
          s: _get(info, 'inSecs', 0),
          m: _get(info, 'inMins', 0),
          h: _get(info, 'inHours', 0),
        },
        out_point: {
          s: _get(info, 'outSecs', 0),
          m: _get(info, 'outMins', 0),
          h: _get(info, 'outHours', 0),
        },
      },
    });
    this.setState({ play: true, playlist: playlist });
  };

  handlePlayPersonalClip = (clip, plexAccount, clipImageUrl) => e => {
    const { client } = this.props;
    const { authToken, clientId } = plexAccount;
    if (!clip) return;
    const { key: mediaPath, sectionUuid } = clip;
    client
      .query({
        query: GetPlexQualityOptions,
        variables: {
          authToken,
          clientId,
          mediaPath,
          sectionUuid,
        },
      })
      .then(({ data }) => {
        const { qualityOptions } = data;
        if (qualityOptions) {
          // window.open(url, '_blank');
          console.log(clip);
          const playlist = [];
          qualityOptions.forEach(item => {
            playlist.push({
              file: item.transcodeVideoUrl,
              image: clipImageUrl,
              title: item.name,
              default: item.default,
              resolution: item.videoResolution,
            });
            // if (item.default) {
            //   const { transcodeVideoUrl } = item;
            // }
          });
          this.setState({ playlist, play: true });
        }
      });
  };

  handleClose = () => {
    this.setState({ play: false });
  };

  showMoreInfo = () => {
    this.setState({ showDetailModal: true });
  };

  handleSubmit = () => {
    const { clip, client } = this.props;
    const { youtubeURL } = this.state;
    if (youtubeURL) {
      this.setState({ isUpdating: true });
      client
        .mutate({
          mutation: CreatePublicClip,
          variables: {
            parent_clip: clip.nid,
            clip_title: clip.title || '',
            url: youtubeURL,
          },
        })
        .then(({ data }) => {
          if (data) {
            if (data.createPublicClip) {
              if (data.createPublicClip.errors.length === 0) {
                this.setState({ showSuccess: true, isUpdating: false });
              }
            } else {
              this.setState({ showFailed: true, isUpdating: false });
            }
          } else {
            this.setState({ showFailed: true, isUpdating: false });
          }
          this.toggle();
        });
    }
  };

  toggle = () => {
    this.setState(prevState => ({
      showDetailModal: !prevState.showDetailModal,
    }));
  };

  toLogin = () => {
    this.login.openLogin();
  };

  handleChangeURLPaste = e => {
    this.setState({
      youtubeURL: e.target.value,
      submitAvailable: !!e.target.value.trim(),
    });
  };

  handleKeyChange = e => {};

  closeAlert = () => {
    const { showSuccess } = this.state;
    this.setState({ showSuccess: false, showFailed: false }, () => {
      if (showSuccess) window.location.reload();
    });
  };

  search = () => {
    const { clip } = this.props;
    window.open(
      `https://www.youtube.com/results?search_query=${clip.title} ${
        clip.artist ? clip.artist.title : ''
      } ${clip.show ? clip.show.title : ''} ${clip.date}`,
      '_blank', // <- This is what makes it open in a new window.
    );
  };

  formatBitrate = bitrate => {
    return bitrate && <a href="#">{parseInt(bitrate / 1000)} kb/s</a>;
  };

  render() {
    const {
      imgURL,
      info,
      theme,
      user,
      clip,
      type,
      selectedType,
      isArchived,
      isPersonal,
      isPublished,
      plexAccount,
      onChangeType,
    } = this.props;

    const {
      play,
      showDetailModal,
      showSuccess,
      showFailed,
      isUpdating,
      playlist,
    } = this.state;

    const srcURL = _get(info, 'url', null);
    const hour = _get(info, 'durationHours', null);
    const min = _get(info, 'durationMins', null);
    const sec = _get(info, 'durationSecs', null);
    const duration = getFormattedTime(hour, min, sec);
    const verticalResolution = _get(info, 'verticalResolution', '');
    const bitrate = _get(info, 'bitrate', '');
    const viewCount = _get(info, 'viewCount', '');
    const commentCount = _get(info, 'commentCount', '');
    const removedDate = _get(info, 'removedDate.date', '');
    const removedReason = _get(info, 'removedReason', '');
    const metadataStatus = _get(info, 'metadataStatus', false);
    const vttFile = _get(info, 'vttFile', false);

    const showArchive = user.user_roles
      ? user.user_roles.includes('rp_editor')
      : false;

    return (
      <div>
        <div className="uploaded-file-video bigger video-btn-wrapper">
          <a className="play-video-btn">
            {/* <img src={imgURL} alt="" /> */}
            <VideoImageBox url={imgURL} />
            <div
              className={`play-video-icon-box ${(selectedType === 1 ||
                selectedType === -1) &&
                !isPublished &&
                'inactive'}`}
              onClick={() => {
                if (selectedType === 1 && isPublished) {
                  this.handlePlay();
                }
                if (selectedType === 2 && isPersonal) {
                  this.handlePlayPersonalClip(info, plexAccount, imgURL);
                }
              }}
            >
              {/* Public Clip */}
              {selectedType === 1 && isPublished && (
                <img
                  className="play-video-icon"
                  onClick={this.handlePlay}
                  src={PlayIcon}
                  alt=""
                />
              )}
              {(selectedType === 1 || selectedType === -1) && !isPublished && (
                <>
                  <p className="inactive-btn">Inactive</p>
                  <p className="more" onClick={this.showMoreInfo}>
                    More
                  </p>
                </>
              )}
              {selectedType === 2 && isPersonal && (
                <img
                  className="play-video-icon"
                  onClick={this.handlePlayPersonalClip(
                    info,
                    plexAccount,
                    imgURL,
                  )}
                  src={PlayIcon}
                  alt=""
                />
              )}
              {selectedType === 2 && !isPersonal && (
                <img className="play-video-icon" src={Padlock} alt="" />
              )}
              {selectedType === 3 && (
                <img className="play-video-icon" src={Padlock} alt="" />
              )}
            </div>
          </a>
        </div>

        <VideoType
          type={type}
          selectedType={selectedType}
          isPublished={isPublished}
          isArchived={isArchived}
          isPersonal={isPersonal}
          onChangeType={onChangeType}
          showArchive={showArchive}
        />

        <ul className="list-icon-item left-icon mb-3">
          <li className="clip-duration-item">
            <a href="#">
              <img
                src={theme === 'light' ? TimeIconLight : TimeIconDark}
                alt=""
              />
              {duration}
            </a>
          </li>
          <li className="clip-video-item">
            <a href="#">
              <img
                src={theme === 'light' ? VideoIconLight : VideoIconDark}
                alt=""
              />
              {verticalResolution}
            </a>
          </li>
          <li className="clip-video-item">{this.formatBitrate(bitrate)}</li>
        </ul>

        <ul className="list-icon-item left-icon mb-3">
          {viewCount && (
            <li className="clip-duration-item">
              <NumberFormat
                value={viewCount}
                displayType={'text'}
                thousandSeparator={true}
              />{' '}
              views on{' '}
              {srcURL && (
                <a href={srcURL} target="_blank" className="youtube_link">
                  YouTube
                </a>
              )}
              {!srcURL && <span>YouTube</span>}
              {commentCount && (
                <>
                  ,{' '}
                  <NumberFormat
                    value={commentCount}
                    displayType={'text'}
                    thousandSeparator={true}
                  />{' '}
                  comments
                </>
              )}
            </li>
          )}
        </ul>

        <JWPlayer
          playlist={playlist}
          play={play}
          // srcURL={srcURL || this.state.srcURL}
          onClose={this.handleClose}
          videoImageURL={imgURL}
          metadataStatus={metadataStatus}
          vttFile={vttFile}
        />
        <Modal
          className={`more-modal theme-${theme}`}
          isOpen={showDetailModal}
          toggle={this.toggle}
        >
          <ModalHeader toggle={this.toggle}>
            <Icon color="#b9c5d8" icon={ICONS.CLIP_MISSING} size="20" />
            <span className="pl-2">Missing Video</span>
          </ModalHeader>
          <ModalBody className="p-3 pt-3">
            <div className="row m-1">
              <div className="col-md-12">
                <p className="mb-4">
                  Missing Since:
                  <div>{removedDate ? removedDate.split(' ')[0] : ''}</div>
                </p>
                <p className="mb-4">
                  Reason:{' '}
                  <div
                    dangerouslySetInnerHTML={{ __html: removedReason }}
                  ></div>
                </p>
              </div>
            </div>
            <div className="row m-1">
              <div className="col-md-8">
                <p className="mb-4">
                  If you have a second, try doing a search to see if there is
                  another copy on YouTube.
                </p>
                <Button className="mb-4" color="danger" onClick={this.search}>
                  Search
                </Button>

                {!user.user_id && (
                  <>
                    <p className="mb-4">
                      Please log-in if you've located an{' '}
                      <i
                        className="exact-match"
                        style={{ color: theme === 'dark' ? 'white' : 'black' }}
                      >
                        exact match{' '}
                      </i>
                      on YouTube and want to add it.
                    </p>
                    <Button
                      className="mb-4"
                      color="danger"
                      onClick={this.toLogin}
                    >
                      Login
                    </Button>
                  </>
                )}

                {user.user_id && (
                  <>
                    <p className="mb-4">
                      If you've located an{' '}
                      <i
                        className="exact-match"
                        style={{ color: theme === 'dark' ? 'white' : 'black' }}
                      >
                        exact match{' '}
                      </i>
                      on YouTube, paste in the URL below. <br />
                      Please make sure it matches the data at right:
                    </p>
                    <Input
                      className="mb-4 "
                      onChange={this.handleChangeURLPaste}
                      onKeyDown={this.handleKeyChange}
                    />
                  </>
                )}
              </div>
              <div className="col-md-3 offset-1">
                <div>
                  <VerticalCard clip={clip} />
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              className="ml-auto"
              color="danger"
              type="button"
              outline
              onClick={this.toggle}
            >
              Cancel
            </Button>
            <Button
              color="danger"
              type="submit"
              onClick={this.handleSubmit}
              disabled={!this.state.submitAvailable}
            >
              {!isUpdating && 'Submit'}
              {isUpdating && <Spinner size="sm" className="spinner-login" />}
            </Button>
          </ModalFooter>
        </Modal>
        <Modal
          className={`alert-modal theme-${theme}`}
          isOpen={showSuccess || showFailed}
        >
          {showSuccess && (
            <AlertBox
              type="success"
              text="Update Successful"
              onClose={this.closeAlert}
            />
          )}
          {showFailed && (
            <AlertBox
              type="warning"
              text="Update Failed"
              onClose={this.closeAlert}
            />
          )}
        </Modal>
        <div style={{ display: 'none' }}>
          <Login
            theme={theme}
            ref={component => {
              if (component) {
                this.login = component;
              }
            }}
          />
        </div>
      </div>
    );
  }
}

export default withContext(withApollo(VideoPlayer));
