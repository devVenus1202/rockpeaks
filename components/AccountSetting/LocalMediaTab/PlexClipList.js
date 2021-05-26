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

class PlexClipList extends Component {
  static propTypes = {};

  state = {
    open: false,
    play: false,
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
    const { key: mediaPath, sectionKey } = clip;
    client
      .query({
        query: GetPlexQualityOptions,
        variables: {
          authToken,
          clientId,
          mediaPath,
          sectionKey,
        },
      })
      .then(({ data }) => {
        const { qualityOptions } = data;
        if (qualityOptions) {
          // window.open(url, '_blank');
          qualityOptions.forEach(item => {
            if (item.default) {
              const { transcodeVideoUrl } = item;
              this.setState({ srcURL: transcodeVideoUrl, play: true });
            }
          });
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
    const { count, header } = this.props;
    const { open, play, srcURL, page } = this.state;
    const pageCount = 10;
    const variables = {
      filter: {
        conditions: [
          {
            field: 'status',
            value: '1',
            operator: 'EQUAL',
          },
          {
            field: 'uid',
            value: getCookie('user_id'),
            operator: 'EQUAL',
          },
          {
            field: 'type',
            value: 'personal_clip',
            operator: 'EQUAL',
          },
        ],
      },
      limit: pageCount,
      offset: (page - 1) * pageCount,
    };
    return (
      <Card className={open ? 'expend' : ''}>
        <CardHeader onClick={this.toggle} data-type="collapseBanner" className="d-flex justify-content-between">
          <strong>{header}</strong>
          {open && <i className="fa fa-angle-down" aria-hidden="true" style={{ fontSize: '1.5em' }} />}
          {!open && <i className="fa fa-angle-right" aria-hidden="true" style={{ fontSize: '1.5em' }} />}
        </CardHeader>
        <Collapse isOpen={open}>
          <CardBody>
            <div className=" center-aligned">
              {count > 0 && (
                <PaginationBar
                  totalItems={count}
                  pageSize={pageCount}
                  onSelect={this.handlePaging}
                  maxPaginationNumbers={5}
                  activePage={page}
                  firstComponent="&laquo;"
                  lastComponent="&raquo;"
                  prevComponent="&#8249;"
                  nextComponent="&#8250;"
                />
              )}
            </div>
            <Query partialRefetch fetchPolicy="cache-and-network" query={GetPersonalClips} variables={variables}>
              {({ error, data, loading }) => {
                if (error) return <ErrorMessage message={`Error! ${error.message}`} />;
                if (loading) return <ListLoader classNameName="mt-2 mb-2 ml-2 mr-2" />;

                const count = _.get(data, 'nodeQuery.count');
                const clips = _.get(data, 'nodeQuery.entities');

                return (
                  <div className="treebeard">
                    {clips.map(item => {
                      const clipTitle = _.get(item, 'entityLabel', 0);
                      const clipNid = _.get(item, 'parentClip.entity.entityId', 0);
                      return (
                        <div className="d-flex p-3 justify-content-around">
                          <span className="show flex-grow-1 tree-clip-title">
                            <Link href={`/video/${clipNid}`} style={{ color: '#FFF' }}>
                              <a className="text-muted"> {clipTitle} </a>
                            </Link>
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
                );
              }}
            </Query>
          </CardBody>
        </Collapse>
        <JWPlayer srcURL={srcURL} play={play} onClose={this.handleClosePlayer} />
      </Card>
    );
  }
}

export default withApollo(PlexClipList);
