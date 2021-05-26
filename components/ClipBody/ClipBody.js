import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';
import { get as _get, isEmpty as _isEmpty } from 'lodash';
import { Query } from 'react-apollo';

import { VideoPlayer } from '@components/Utilities/VideoPlayer';
import { TagItem } from '@components/Utilities/Tag';
import VideoType from '@components/Utilities/VideoType';
import VideoTags from '@components/Utilities/VideoTags';
import ShowDetail from '@components/Show/ShowDetail';

import { getDateFromClipNode } from '@helpers/dateTimeHelper';
import GetReviewsRequest from '@graphql/review/GetClipReviews.graphql';
import ClipContent from './ClipContent';
import './ClipBody.style.scss';

const PUBLIC_TYPE = 1;
const PERSONAL_TYPE = 2;
const ARCHIVE_TYPE = 3;

class ClipBody extends Component {
  static propTypes = {
    data: PropTypes.object,
    plexAccount: PropTypes.object.isRequired,
  };

  state = {
    selectedType: -1,
  };

  getVideoData = () => {
    const { data } = this.props;
    console.log(data);

    if (data.publicClipNodes && data.publicClipNodes.length > 0) {
      let activePublicClip = null;
      data.publicClipNodes.forEach(item => {
        const status = _get(item, 'entity.status', false);
        if (!activePublicClip && status) {
          activePublicClip = item;
        }
      });

      if (activePublicClip) {
        return {
          type: 0,
          isPublished: true,
          nid: activePublicClip.targetId,
        };
      }
      return {
        type: 0,
        isPublished: false,
        nid: _get(data, 'publicClipNodes.0.targetId'),
      };
    }
    if (data.personalClipNodes && data.personalClipNodes.length > 0) {
      return {
        type: 1,
        nid: _get(data, 'personalClipNodes.0.targetId'),
      };
    }
    if (data.archiveClipNodes && data.archiveClipNodes.length > 0) {
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

  handleChangeType = type => {
    this.setState({ selectedType: type });
  };

  checkPublic = clips => {
    let activePublicClip = {};

    if (clips.length === 0) {
      return {};
    }

    clips.forEach(item => {
      const status = _get(item, 'entity.status', false);
      const url = _get(item, 'entity.url', null);

      if (!activePublicClip.entity && status && url) {
        activePublicClip = item.entity;
        activePublicClip.targetId = item.targetId;
      }
    });

    return activePublicClip.targetId ? activePublicClip : clips[0].entity;
  };

  checkArchive = clips => {
    let activeArchiveClip = {};

    const archiveClipsWithMetadata = clips.filter(item => {
      const metadataStatus = _get(item, 'entity.metadataStatus', false);
      return metadataStatus === true;
    });

    if (archiveClipsWithMetadata.length > 0) {
      activeArchiveClip = archiveClipsWithMetadata[0].entity;
      activeArchiveClip.targetId = archiveClipsWithMetadata[0].targetId;
      return activeArchiveClip;
    }

    clips.forEach(item => {
      const status = _get(item, 'entity.status', false);
      if (!activeArchiveClip.entity && status) {
        activeArchiveClip = item.entity;
        activeArchiveClip.targetId = item.targetId;
      }
    });
    return activeArchiveClip;
  };

  checkPersonal = clips => {
    let activePersonalClip = {};
    clips.forEach(item => {
      const status = _get(item, 'entity.status', false);
      if (!activePersonalClip.entity && status) {
        activePersonalClip = item.entity;
        activePersonalClip.targetId = item.targetId;
      }
    });
    return activePersonalClip;
  };

  getImage = (data, fields) => {
    for (let i = 0; i < fields.length; i++) {
      const img = _get(data, fields[i]);
      if (typeof img !== 'undefined') {
        return img;
      }
    }
    return 'https://rockpeaksassets.s3.amazonaws.com/placeholders/clip-default-still-graphic.png';
  };

  render() {
    const { data } = this.props;
    const clipNid = _get(data, 'nid', '');
    const clipTitle = _get(data, 'clipTitle', '');
    const clipShow = _get(data, 'show.entity.title', '');
    const clipArtist = _get(data, 'artist.entity.title', '');
    const clipArtistNid = _get(data, 'artist.entity.nid', null);
    const clipShowNid = _get(data, 'show.entity.nid', null);
    const clipBodyProcessed = _get(data, 'body.value', '');
    const clipShowTitle = _get(data, 'show.entity.title', null);
    const date = getDateFromClipNode(data);
    const clipTags = _get(data, 'clipTags', []);
    const ranking = _get(data, 'legacyRanking', 0);
    const { type, nid } = this.getVideoData(); // Returns right public clip, OK.
    const publicClips = _get(data, 'publicClipNodes', []);
    const archiveClips = _get(data, 'archiveClipNodes', []);
    const personalClips = _get(data, 'personalClipNodes', []);

    const playerImgURL = this.getImage(data, [
      'smartStillImage640x480.uri',
      'fieldStillImage.url',
      'legacyImage.url.path',
    ]);

    const { plexAccount } = this.props;
    const plexAccountInfo = _get(plexAccount, 'plexAccount', null);

    const activePublicClip = this.checkPublic(publicClips); // Why doind this job twice?
    const isPublished = activePublicClip
      ? activePublicClip.url
        ? activePublicClip.status
        : false
      : false;
    const activeArchiveClip = this.checkArchive(archiveClips);
    const isArchived = activeArchiveClip ? activeArchiveClip.status : false;
    const activePersonalClip = this.checkPersonal(personalClips);
    const isPersonal = activePersonalClip
      ? activePersonalClip.status && plexAccountInfo
      : false;

    let metadataStatus = false;
    let vttFile = false;
    if (typeof activeArchiveClip === 'object' && !_isEmpty(activeArchiveClip)) {
      metadataStatus = _get(activeArchiveClip, 'metadataStatus', false);
      vttFile = _get(activeArchiveClip, 'VTT', false);
    }

    let { selectedType } = this.state;

    if (selectedType < 0 && isPersonal) {
      selectedType = PERSONAL_TYPE;
    }

    if (selectedType < 0 && isPublished) {
      selectedType = PUBLIC_TYPE;
    }

    if (selectedType < 0 && isArchived) {
      selectedType = ARCHIVE_TYPE;
    }

    let activeClip = {};
    switch (selectedType) {
      case PUBLIC_TYPE:
        activeClip = activePublicClip;
        activeClip.metadataStatus = metadataStatus;
        activeClip.vttFile = vttFile;
        break;
      case ARCHIVE_TYPE:
        activeClip = activeArchiveClip;
        break;
      case PERSONAL_TYPE:
        activeClip = activePersonalClip;
        activeClip.metadataStatus = metadataStatus;
        activeClip.vttFile = vttFile;
        break;
      default:
        activeClip = _get(publicClips, '0.entity', {});
    }

    if (!activeClip) activeClip = {};

    const variables = {
      filter: {
        conditions: [
          {
            field: 'clip',
            value: clipNid,
            operator: 'EQUAL',
          },
          {
            field: 'status',
            value: true,
            operator: 'EQUAL',
          },
          {
            field: 'type',
            value: 'review',
            operator: 'EQUAL',
          },
        ],
      },
    };
    return (
      <Row className="clip-body-style">
        <Col xl={3} lg={4} md={5} sm={12} xs={12}>
          <VideoPlayer
            imgURL={playerImgURL}
            type={selectedType}
            nid={activeClip.targetId || nid} //
            clipId={clipNid}
            info={activeClip}
            clip={{
              nid: clipNid,
              title: clipTitle,
              show: { nid: clipShowNid, title: clipShowTitle },
              artist: { nid: clipArtistNid, title: clipArtist },
              thumbnail: playerImgURL,
              fieldYear: data.fieldYear,
              fieldMonth: data.fieldMonth,
              fieldDay: data.fieldDay,
              date,
            }}
            // type={isPublished ? type : -1}
            selectedType={selectedType}
            isPublished={isPublished}
            isArchived={isArchived}
            isPersonal={isPersonal}
            plexAccount={plexAccountInfo}
            onChangeType={this.handleChangeType}
          />
          {/* <VideoType
            type={isPublished ? type : -1}
            selectedType={selectedType}
            isPublished={isPublished}
            isArchived={isArchived}
            isPersonal={isPersonal}
            onChangeType={this.handleChangeType}
          /> */}
          {/* <VideoTags nid={clipNid} tags={clipTags} /> */}
          <Query query={GetReviewsRequest} variables={variables}>
            {({ data, loading, error }) => {
              const reviewList = _get(data, 'nodeQuery.entities', []);
              if (loading || error) {
                return <div />;
              }
              const tags = [];
              reviewList.forEach(item => {
                item.clipTags.forEach(tag => {
                  tags.push(<TagItem value={tag.entity.entityLabel} />);
                });
              });
              return <div style={{ maxWidth: '310px' }}>{tags}</div>;
            }}
          </Query>
        </Col>
        <Col xl={9} lg={8} md={7} sm={12} xs={12}>
          <ClipContent
            title={clipTitle}
            nid={clipNid}
            artist={clipArtist}
            show={clipShow}
            artistNid={clipArtistNid}
            showNid={clipShowNid}
            body={clipBodyProcessed}
            ranking={Math.floor(ranking / 20)}
            date={date}
            url={isPublished ? _get(activePublicClip, 'url', '') : ''}
          />
        </Col>
      </Row>
    );
  }
}

export default ClipBody;
