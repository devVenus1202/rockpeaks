import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import _ from 'lodash';
import Link from 'next/link';

import ErrorMessage from '@lib/ErrorMessage';

import GET_ALBUMS_BY_ARTIST from '@graphql/secondaryNav/artist/ArtistAlbums.graphql';
import GET_SONGS_BY_ALBUM_BY_ARTIST from '@graphql/secondaryNav/artist/ArtistAlbumsSongs.graphql';
import GET_SHOWS_BY_SONGS_BY_ALBUM_BY_ARTIST from '@graphql/secondaryNav/artist/ArtistAlbumsSongsShows.graphql';

import { Button } from 'reactstrap';
import { ICONS } from '@lib/icons';
import { summerize } from '@helpers/stringHelper';

import { ListLoader } from '../../Loader';
import Icon from '../../Icon';
import TreeBeard from '../../Tree';

class AlbumTree extends Component {
  static propTypes = {
    nid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  };

  dataTree = {
    children: [],
    level: 'root',
    name: 'root',
    toggled: true,
  };

  treeQueries = {
    album: GET_ALBUMS_BY_ARTIST,
    song: GET_SONGS_BY_ALBUM_BY_ARTIST,
    show: GET_SHOWS_BY_SONGS_BY_ALBUM_BY_ARTIST,
  };

  dataSource = {
    album: {
      variables: variable => ({
        nid: variable,
      }),
    },
    song: {
      variables: variable => ({
        nid: variable,
      }),
    },
    show: {
      variables: variable => ({
        nid: variable,
      }),
    },
  };

  nid = null;

  constructor(props) {
    super(props);

    const { nid } = props;

    this.nid = nid;

    this.state = {
      cursor: null,
      level: 'album',
      node: this.dataTree,
      variable: nid,
    };

    this.toggleTree = this.toggleTree.bind(this);
  }

  toggleTree = (node, toggled) => {
    const { cursor } = this.state;
    if (cursor) {
      cursor.active = false;
    }
    const nodeMod = node;
    nodeMod.active = true;
    const hasDeepest = Object.prototype.hasOwnProperty.call(nodeMod, 'deepest');
    if (nodeMod.children) {
      if (hasDeepest) nodeMod.deepest = toggled;
      nodeMod.toggled = toggled;
    }
    if (nodeMod.toggled && nodeMod.parent) {
      // closing all opened siblings, per request
      nodeMod.parent.children.forEach(elem => {
        const elemMod = elem;
        elemMod.toggled = false;
        if (Object.prototype.hasOwnProperty.call(elemMod, 'deepest'))
          elemMod.deepest = false;
      });
      nodeMod.toggled = true;
      if (hasDeepest) nodeMod.deepest = true;
    }
    this.setState({ cursor: nodeMod });
    switch (nodeMod.level) {
      case 'album':
        this.setState({
          level: 'song',
          node: nodeMod,
          variable: nodeMod.variable,
        });
        break;
      case 'song':
        this.setState({
          level: 'show',
          node: nodeMod,
          variable: nodeMod.variable,
        });
        break;
      default:
        break;
    }
  };

  addToPlaylist = (status, clipId) => {
    if (status) {
      this.props.addToPlaylist(clipId);
    }
  };

  render() {
    const { level, node, variable } = this.state;

    return (
      <Query
        partialRefetch
        fetchPolicy="cache-and-network"
        query={this.treeQueries[level]}
        variables={this.dataSource[level].variables(variable)}
      >
        {({ error, data, loading }) => {
          if (error)
            return <ErrorMessage message={`Error! ${error.message}`} />;
          if (loading && _.keys(data).length === 0)
            return <ListLoader className="mt-2 mb-2 ml-2 mr-2" />;

          if (_.keys(data).length > 0) {
            if (
              level === 'album' &&
              _.has(data, 'albumsByArtist.entities') &&
              this.dataTree.children.length === 0
            ) {
              const nodeMod = node;
              if (nodeMod.children.length === 0) {
                nodeMod.loading = false;
                const result = [];
                _.transform(
                  _.get(data, 'albumsByArtist.entities'),
                  (result, value) => {
                    const clipsCount = _.get(value, 'clips.count', '');
                    const albumNid = _.get(
                      value,
                      'albumRelease.entity.albumNid',
                      '',
                    );
                    const albumTitle = _.get(
                      value,
                      'albumRelease.entity.albumTitle',
                      '',
                    );
                    const fieldYear = _.get(
                      value,
                      'albumRelease.entity.fieldYear',
                      '',
                    );
                    const icon = <Icon color="#b9c5d8" icon={ICONS.DISC} />;
                    const existing = _.findIndex(result, {
                      variable: albumNid,
                    });
                    if (parseInt(clipsCount, 10) > 0 && existing === -1) {
                      result.push({
                        children: [],
                        count: 1,
                        level: 'album',
                        loading: true,
                        year: fieldYear,
                        name: [
                          <span className="flex-grow-1 title-name">
                            {albumTitle}
                          </span>,
                          <span className="pl-2">
                            {!fieldYear ? (
                              <span className="unknown">____</span>
                            ) : (
                              _.padStart(fieldYear, 4, '0')
                            )}
                          </span>,
                          <span className="pl-2 pr-2 album-round-disc-icon">
                            {icon}
                          </span>,
                        ],
                        parent: node,
                        variable: albumNid,
                      });
                    }
                  },
                  result,
                );

                if (result.length === 0) {
                  return (
                    <div className="p-2rem">
                      <p>
                        Currently, we have no album information for this artist.
                      </p>
                    </div>
                  );
                }

                nodeMod.children = _.sortBy(result, ['year']);
              }
            }

            if (
              level === 'song' &&
              _.has(data, 'songsByAlbumsByArtist') &&
              variable.toString() ===
                _.get(
                  data,
                  'songsByAlbumsByArtist.entities[0].albumRelease.entity.albumNid',
                  '',
                ).toString()
            ) {
              const nodeMod = node;
              if (nodeMod.children.length === 0) {
                nodeMod.loading = false;
                _.transform(
                  _.get(data, 'songsByAlbumsByArtist.entities'),
                  (result, value) => {
                    const count = _.get(value, 'clips.count', 0);
                    if (count !== 0) {
                      const songNid = _.get(value, 'canonicalNid', '');
                      const songTitle = _.get(value, 'title', '');
                      result.push({
                        children: [],
                        level: 'song',
                        loading: true,
                        name: [
                          <span className="title-name">
                            {summerize(songTitle, 30)}
                          </span>,
                        ],
                        parent: node,
                        variable: songNid,
                      });
                    }
                  },
                  nodeMod.children,
                );
              }
            }

            if (
              level === 'show' &&
              _.has(data, 'showsBySongByAlbumByArtist.entities') &&
              variable.toString() ===
                _.get(
                  data,
                  'showsBySongByAlbumByArtist.entities[0].canonicalRecording.entity.canonicalNid',
                  '',
                ).toString()
            ) {
              const nodeMod = node;
              if (nodeMod.children.length === 0) {
                nodeMod.loading = false;
                nodeMod.deepest = true;
                _.transform(
                  _.get(data, 'showsBySongByAlbumByArtist.entities'),
                  (result, value) => {
                    const fieldYear = _.get(value, 'fieldYear', '');
                    const fieldMonth = _.get(value, 'fieldMonth', '');
                    const fieldDay = _.get(value, 'fieldDay', '');
                    const show = _.get(value, 'show.entity.title', 0);
                    const showId = _.get(value, 'show.entity.entityId', 0);
                    const clipNid = _.get(value, 'clipNid', 0);
                    const clipTitle = _.get(value, 'clipTitle', 0);
                    const status = _.get(value, 'status', 0);
                    const button = (
                      <Button
                        color="link"
                        className="btn-add-to-playlist"
                        onClick={e => {
                          e.stopPropagation();
                          this.addToPlaylist(status, clipNid);
                        }}
                      >
                        <Icon
                          color="#b9c5d8"
                          icon={
                            status ? ICONS.ADD_TO_PLAYLIST : ICONS.CLIP_MISSING
                          }
                        />
                      </Button>
                    );
                    result.push({
                      count: 1,
                      deepest: true,
                      level: 'datesShows',
                      loading: true,
                      name: [
                        <span className="show flex-grow-1 tree-clip-title">
                          {/* {summerize(show, 30)} */}
                          <Link href={`/video/${clipNid}`}>
                            {summerize(show, 30)}
                          </Link>
                          <div className="d-inline-block tree-clip-date">
                            <span>&nbsp;</span>
                            {!fieldMonth ? (
                              <span className="unknown">__</span>
                            ) : (
                              _.padStart(fieldMonth, 2, '0')
                            )}
                            {'-'}
                            {!fieldDay ? (
                              <span className="unknown">__</span>
                            ) : (
                              _.padStart(fieldDay, 2, '0')
                            )}
                            <span>&nbsp;</span>
                            {!fieldYear ? (
                              <span className="unknown">__</span>
                            ) : (
                              fieldYear
                            )}
                            <span>&nbsp;</span>
                          </div>
                        </span>,
                        button,
                      ],
                      parent: node,
                      variable: { fieldYear, fieldMonth, fieldDay, showId },
                      lastLevel: true,
                      linkable: ['video', clipNid],
                    });
                  },
                  nodeMod.children,
                );
              }
            }
          }
          return (
            <div className="treebeard">
              <TreeBeard data={this.dataTree} onToggle={this.toggleTree} />
            </div>
          );
        }}
      </Query>
    );
  }
}

export default AlbumTree;
