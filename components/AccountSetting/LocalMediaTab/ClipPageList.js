import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Collapse } from 'reactstrap';
import PropTypes from 'prop-types';
import { Query, withApollo } from 'react-apollo';
import { getCookie } from '@helpers/session';

import Link from 'next/link';

import _ from 'lodash';
import ErrorMessage from '@lib/ErrorMessage';
import JWPlayer from '@components/Utilities/VideoPlayer/JWPlayer';
import PaginationBar from '@components/Utilities/Pagination';

import GET_SONGS_BY_ARTIST from '@graphql/secondaryNav/artist/ArtistSongs.graphql';
import GET_SHOWS_DATES_BY_ARTIST from '@graphql/secondaryNav/artist/ArtistSongsShows.graphql';
import GetPersonalClips from '@graphql/plex/GetPersonalClips.graphql';
import GetPlexTransCode from '@graphql/plex/GetPlexTransCode.graphql';

import GetPlexQualityOptions from '@graphql/plex/GetPlexQualityOptions.graphql';

import { ListLoader } from '../../Loader';

import { get as _get } from 'lodash';

class ClipPageList extends Component {
  static propTypes = {
    client: PropTypes.object.isRequired,
    plexAccount: PropTypes.object.isRequired,
    count: PropTypes.number.isRequired,
    header: PropTypes.object.isRequired,
    clips: PropTypes.array.isRequired,
  };

  state = {
    open: false,
    play: false,
    playlist: [],
    srcURL: '',
    page: 1,
  };

  toggle = () => {
    this.setState(prevState => {
      return { open: !prevState.open };
    });
  };

  playPersonalClip = clip => e => {
    const { client, plexAccount } = this.props;
    const { authToken, clientId } = plexAccount;
    const { key: mediaPath, sectionUuid } = clip;
    console.log(clip);

    // Add VTT thumbnails.
    let tracks = []
    const archiveClip = _get(clip, 'archiveClip.entity', {})
    const metadataStatus = _get(archiveClip, 'metadataStatus', false)
    const vttFile = _get(archiveClip, 'VTT', false)
    if (metadataStatus && vttFile) {
      tracks = [{
        file: vttFile,
        kind: 'thumbnails'
      }]
    }

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
          const playlist = [];
          qualityOptions.forEach(item => {
            playlist.push({
              file: item.transcodeVideoUrl,
              image: clip.clipImageUrl,
              title: item.name,
              default: item.default,
              resolution: item.videoResolution,
              tracks: tracks,
            });
            if (item.default) {
              const { transcodeVideoUrl } = item;
            }
          });
          console.log(playlist)
          this.setState({ playlist, play: true });
        }
      });
  };

  handleClosePlayer = () => {
    this.setState({ play: false });
  };

  handlePaging = page => {
    this.setState({ page });
  };

  render() {
    const { count, header, clips } = this.props;
    const { open, play, srcURL, page, playlist } = this.state;
    const pageCount = 10;
    const pageClips = clips ? clips.slice((page - 1) * pageCount, page * pageCount) : [];
    console.log(clips)
    console.log(playlist)
    return (
      <Card className={open ? 'expend' : ''}>
        <CardHeader
          onClick={this.toggle}
          data-type="collapseBanner"
          className="d-flex justify-content-between mr-3 ml-3 pr-3 pl-3"
        >
          <strong>{header}</strong>
          {open && <i className="fa fa-angle-down" aria-hidden="true" style={{ fontSize: '1.5em' }} />}
          {!open && <i className="fa fa-angle-right" aria-hidden="true" style={{ fontSize: '1.5em' }} />}
        </CardHeader>
        <Collapse isOpen={open}>
          <CardBody className="mr-3 ml-3 pr-3 pl-3 pt-0">
            <div className="">
              {count > 0 && (
                <PaginationBar
                  totalItems={count}
                  pageSize={pageCount}
                  onSelect={this.handlePaging}
                  maxPaginationNumbers={10}
                  activePage={page}
                  firstComponent="&laquo;"
                  lastComponent="&raquo;"
                  prevComponent="&#8249;"
                  nextComponent="&#8250;"
                />
              )}
            </div>
            <div className="treebeard">
              {clips &&
                pageClips.map((item, index) => {
                  const clipTitle = _.get(item, 'title', '');
                  const clipNid = _.get(item, 'parentClip.entity.entityId', 0);
                  return (
                    <div className="d-flex pt-3 pb-3 justify-content-around">
                      <span className="show flex-grow-1 tree-clip-title">
                        {clipNid ? (
                          <Link href={`/video/${clipNid}`} style={{ color: '#FFF' }}>
                            <a className="text-muted">
                              <span>[{(page - 1) * pageCount + index + 1}]</span>{' '}
                              <span style={{ paddingLeft: '10px' }}>{clipTitle}</span>
                            </a>
                          </Link>
                        ) : (
                          <>
                            <span>[{(page - 1) * pageCount + index + 1}]</span>{' '}
                            <span style={{ paddingLeft: '10px' }}>{clipTitle}</span>
                          </>
                        )}

                        <div className="d-inline-block tree-clip-date">
                          <span>&nbsp;</span>
                          <span>&nbsp;</span>
                        </div>
                      </span>
                      <span onClick={this.playPersonalClip(item)} style={{ color: '#FFF', cursor: 'pointer' }}>
                        <a className="text-muted"> Play </a>
                      </span>
                    </div>
                  );
                })}
            </div>
          </CardBody>
        </Collapse>
        <JWPlayer
            // srcURL={srcURL}
            play={play}
            playlist={playlist}
            withMetadata={true}
            onClose={this.handleClosePlayer} />
      </Card>
    );
  }
}

export default withApollo(ClipPageList);
