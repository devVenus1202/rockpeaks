import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';
import { get as _get } from 'lodash';
import { VideoPlayer } from '@components/Utilities/VideoPlayer';
import VideoType from '@components/Utilities/VideoType';
import VideoTags from '@components/Utilities/VideoTags';
import { getDateFromClipNode } from '@helpers/dateTimeHelper';
import ClipContent from './ClipContent';
import './ClipBody.style.scss';

class ClipBody extends Component {
  static propTypes = {
    data: PropTypes.object,
  };

  getVideoData = () => {
    const { data } = this.props;

    if (data.publicClipNodes.length > 0) {
      return {
        type: 0,
        nid: _get(data, 'publicClipNodes.0.targetId'),
      };
    }
    if (data.personalClipNodes.length > 0) {
      return {
        type: 1,
        nid: _get(data, 'personalClipNodes.0.targetId'),
      };
    }
    if (data.archiveClipNodes.length > 0) {
      return {
        type: 2,
        nid: _get(data, 'archiveClipNodes.0.targetId'),
      };
    }
    return {
      type: 0,
      nid: 0,
    };
  };

  getImage = (data, fields) => {
    for (let i = 0; i < fields.length; i++) {
      const img = _get(data, fields[i]);
      if (typeof img !== 'undefined') {
        return img;
      }
    }
    return 'https://rockpeaksassets.s3.amazonaws.com/placeholders/clip-default-still-graphic.png';
  }

  render() {
    const { data } = this.props;
    const clipTitle = _get(data, 'clipTitle', '');
    const clipArtist = _get(data, 'artist.entity.title', '');
    const clipShow = _get(data, 'show.entity.title', '');
    const clipArtistNid = _get(data, 'artist.entity.nid', null);
    const clipShowNid = _get(data, 'show.entity.nid', null);
    const clipBodyProcessed = _get(data, 'body.processed', '');
    const ranking = _get(data, 'legacyRanking', 0);
    const date = getDateFromClipNode(data);
    const playerImgURL = this.getImage(data, [
      'smartStillImage640x480.uri',
      'fieldStillImage.url',
      'legacyImage.url.path',
    ]);
    const clipTags = _get(data, 'clipTags', []);
    const { type, nid } = this.getVideoData();
    const publicClips = _get(data, 'publicClipNodes.0.entity', {});
    return (
      <Row className="clip-body-style">
        <Col lg={3}>
          <VideoPlayer imgURL={playerImgURL} type={type} nid={nid} info={publicClips} />
          <VideoType type={type} />
          <VideoTags nid={nid} tags={clipTags} />
        </Col>
        <Col lg={9}>
          <ClipContent
            title={clipTitle}
            artist={clipArtist}
            show={clipShow}
            artistNid={clipArtistNid}
            showNid={clipShowNid}
            body={clipBodyProcessed}
            ranking={Math.floor(ranking / 20)}
            date={date}
          />
        </Col>
      </Row>
    );
  }
}

export default ClipBody;
