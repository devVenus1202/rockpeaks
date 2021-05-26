import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  arrayMove,
} from 'react-sortable-hoc';
import { get as _get } from 'lodash';
import JWPlayer from '@components/Utilities/VideoPlayer/JWPlayer';
import ArrowIcon from '@static/images/icons/arrors.png';
import DeleteIcon from '@static/images/icons/delete-icon.png';
import { withContext } from '@components/HOC/withContext';
import Link from 'next/link';
import { getConcatenatedURI } from '@helpers/urlHelper';
import { decodeHtmlSpecialChars } from '@helpers/stringHelper';
import {
  getDateFromClipNode,
  getDateFromEntity,
} from '@helpers/dateTimeHelper';
import './DragList.style.scss';

const DragHandle = SortableHandle(() => <img src={ArrowIcon} alt="" />);

const SortableItem = SortableElement(({ value, onPlay, onDelete }) => {
  return (
    <div className="sortable-item-style" onClick={onPlay}>
      <div className="sortable-item-dragger">
        <DragHandle />
      </div>
      <div className="sortable-item-text">
        <p className="mb-0 text-nowrap">{value}</p>
      </div>
      <div className="sortable-item-delete">
        <img onClick={onDelete} src={DeleteIcon} alt="" />
      </div>
    </div>
  );
});

const SortableList = SortableContainer(
  ({ title, items, onPlay, onDelete, divider }) => {
    const style = divider ? 'has-divider' : '';

    return (
      <div className={`sortable-list-container ${style}`}>
        {title && (
          <div className="sortable-list-title">
            <small>{title}</small>
          </div>
        )}
        {items.map((value, index) => (
          <SortableItem
            key={`item-${index}`}
            index={index}
            value={value.title}
            onPlay={onPlay(index)}
            onDelete={onDelete(index)}
          />
        ))}
      </div>
    );
  },
);

class DragList extends Component {
  state = {
    selectedIndex: 0,
  };

  handleSortEnd = ({ oldIndex, newIndex }) => {
    const { items, onChange } = this.props;

    onChange(arrayMove(items, oldIndex, newIndex));
  };

  handlePlay = index => () => {
    this.setState({
      selectedIndex: index,
    });
  };

  handleDelete = index => () => {
    const { onRemove } = this.props;

    if (onRemove) onRemove(index);
  };

  handleClose = () => {
    const { setPlayerStatusId } = this.props;

    setPlayerStatusId(null);
  };

  handlePlayerError = error => {
    console.log('player skipped by error: ', error);
    // this.setState(prevState => ({
    //   selectedIndex: prevState.selectedIndex + 1,
    // }));
  };

  getImage = (data, fields) => {
    for (let i = 0; i < fields.length; i++) {
      let img = _get(data, fields[i]);
      if (typeof img !== 'undefined') {
        return img;
      }
    }
    return 'https://rockpeaksassets.s3.amazonaws.com/placeholders/clip-default-still-graphic.png';
  };

  render() {
    const { items, playlistTitle, divider, openedPlayerId } = this.props;
    const { selectedIndex } = this.state;
    const playlist = [];

    items.length > 0 &&
      items.forEach((clip, index) => {
        if (clip.flaggedEntity && clip.flaggedEntity.entity) {
          const { publicClipNodes } = clip.flaggedEntity.entity;

          let file = 'Inactive';
          let meta = {};
          if (publicClipNodes.length > 0) {
            // Set default.
            file = _get(publicClipNodes[0], 'entity.url', null);

            // Try to find any active public clip. Otherwise, use first public clip by default.
            let activePublicClips = publicClipNodes.filter(publicClip => {
              let status = _get(publicClip, 'entity.status', false);
              return status === true;
            });
            if (activePublicClips.length > 0) {
              // Sort by id.
              activePublicClips.sort((a, b) =>
                a.targetId < b.targetId ? 1 : -1,
              );
              file = _get(activePublicClips[0], 'entity.url', null);
              meta = {
                duration: {
                  s: _get(activePublicClips[0], 'entity.durationSecs', 0),
                  m: _get(activePublicClips[0], 'entity.durationMins', 0),
                  h: _get(activePublicClips[0], 'entity.durationHours', 0),
                },
                in_point: {
                  s: _get(activePublicClips[0], 'entity.inSecs', 0),
                  m: _get(activePublicClips[0], 'entity.inMins', 0),
                  h: _get(activePublicClips[0], 'entity.inHours', 0),
                },
                out_point: {
                  s: _get(activePublicClips[0], 'entity.outSecs', 0),
                  m: _get(activePublicClips[0], 'entity.outMins', 0),
                  h: _get(activePublicClips[0], 'entity.outHours', 0),
                },
              };
            }

            if (file === null) file = 'Inactive';
          }

          const isActive = file !== 'Inactive';
          const defaultValue = isActive && index >= selectedIndex;
          const imgURL = this.getImage(clip.flaggedEntity.entity, [
            'smartStillImage640x480.uri',
            'fieldStillImage.url',
            'legacyImage.url.path',
          ]);

          // Add VTT thumbnails.
          let tracks = [];
          //clip.flaggedEntity.entity.archiveClipNodes["0"].entity.metadataStatus
          const archiveClip = _get(
            clip.flaggedEntity.entity,
            'archiveClipNodes["0"].entity',
            {},
          );
          const metadataStatus = _get(archiveClip, 'metadataStatus', false);
          const vttFile = _get(archiveClip, 'VTT', false);
          if (metadataStatus && vttFile) {
            tracks = [
              {
                file: vttFile,
                kind: 'thumbnails',
              },
            ];
          }

          const artist = _get(clip.flaggedEntity.entity, 'artist', {});
          const show = _get(clip.flaggedEntity.entity, 'show', {});
          const label = (
            <div className="disc-label">
              <Link
                href={getConcatenatedURI(
                  'video',
                  clip.flaggedEntity.entity.entityId,
                  artist ? artist.entity.title : '',
                  show ? show.entity.title : '',
                  clip.flaggedEntity.entity.clipTitle,
                )}
              >
                <a className="text-muted">
                  {decodeHtmlSpecialChars(clip.flaggedEntity.entity.clipTitle)}
                </a>
              </Link>
              <span className="p-1">|</span>
              {artist && (
                <Link
                  href={getConcatenatedURI(
                    'artists',
                    artist.entity.entityId,
                    artist.entity.title,
                  )}
                  className="text-muted"
                >
                  <a className="text-muted">
                    {decodeHtmlSpecialChars(artist.entity.title)}
                  </a>
                </Link>
              )}
              <span className="p-1">|</span>
              {show && (
                <Link
                  href={getConcatenatedURI(
                    'shows',
                    show.entity.entityId,
                    show.entity.title,
                  )}
                >
                  <a className="text-muted">
                    {decodeHtmlSpecialChars(show.entity.title)}
                  </a>
                </Link>
              )}
              <span className="p-1">|</span>
              <span>
                <Link
                  href={`/browse/calendar?date=${getDateFromEntity(
                    clip.flaggedEntity.entity,
                    false,
                  )}`}
                >
                  <a className="text-muted">
                    {getDateFromClipNode(clip.flaggedEntity.entity)}
                  </a>
                </Link>
              </span>
            </div>
          );
          playlist.push({
            default: defaultValue,
            title: label,
            file,
            image: imgURL,
            tracks,
            meta,
          });
        }
      });

    return (
      <>
        {playlist.length > 0 && (
          <SortableList
            items={playlist}
            onSortEnd={this.handleSortEnd}
            onPlay={() => {}}
            onDelete={this.handleDelete}
            lockAxis="y"
            divider={divider}
            useDragHandle
          />
        )}
        {playlist && (
          <JWPlayer
            playlistTitle={playlistTitle}
            playlist={playlist}
            id="draglist-player"
            play={openedPlayerId === 'draglist-player'}
            // srcURL={playlist[selectedIndex]}
            onClose={this.handleClose}
            handleError={this.handlePlayerError}
          />
        )}
      </>
    );
  }
}

DragList.defaultProps = {
  divider: false,
};

DragList.propTypes = {
  playlistTitle: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  divider: PropTypes.bool,
  openedPlayerId: PropTypes.string.isRequired,
  setPlayerStatusId: PropTypes.func.isRequired,
};

export default withContext(DragList);
