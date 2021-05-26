import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query, withApollo } from 'react-apollo';
import _ from 'lodash';
import ErrorMessage from '@lib/ErrorMessage';

import GET_SONGS_BY_ARTIST from '@graphql/secondaryNav/artist/ArtistSongs.graphql';
import GET_SHOWS_DATES_BY_ARTIST from '@graphql/secondaryNav/artist/ArtistSongsShows.graphql';
import GetPersonalClips from '@graphql/plex/GetPersonalClips.graphql';
import GetPlexTransCode from '@graphql/plex/GetPlexTransCode.graphql';

import JWPlayer from '@components/Utilities/VideoPlayer/JWPlayer';

import Link from 'next/link';

import { ListLoader } from '../../../Loader';
import TreeBeard from '../../../Tree';
import { getCookie } from '@helpers/session';

class PlexClipTree extends Component {
  static propTypes = {
    count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  };

  dataTree = {
    children: [
      {
        children: [],
        count: 1,
        level: 'song',
        loading: true,
        name: [<span className="title-name">Videos Matched To Clip Records</span>, <span>&nbsp;</span>, ''],
        parent: this.dataTree,
        variable: 'Videos Matched To Clip Records',
      },
    ],
    level: 'root',
    name: 'root',
    toggled: true,
  };

  treeQueries = {
    song: GET_SONGS_BY_ARTIST,
    show: GET_SHOWS_DATES_BY_ARTIST,
  };

  dataSource = {
    song: {
      variables: variable => ({
        nid: variable,
      }),
    },
    show: {
      variables: variable => ({
        nid: this.nid,
        title: variable,
      }),
    },
  };

  nid = null;

  constructor(props) {
    super(props);

    const { count } = props;

    this.state = {
      cursor: null,
      level: 'song',
      node: this.dataTree,
      play: false,
      srcURL: '',
    };

    this.toggleTree = this.toggleTree.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { count } = this.props;
    if (prevProps.count !== count) {
      this.setState({
        count,
      });
      this.dataTree.children[0].name = [
        <span className="title-name">Videos Matched To Clip Records</span>,
        <span>&nbsp;</span>,
        `(${count} clip)`,
      ];
    }
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
        if (Object.prototype.hasOwnProperty.call(elemMod, 'deepest')) elemMod.deepest = false;
      });
      nodeMod.toggled = true;
      if (hasDeepest) nodeMod.deepest = true;
    }
    this.setState({ cursor: nodeMod });
    switch (nodeMod.level) {
      case 'song':
        this.setState({ level: 'show', node: nodeMod, variable: nodeMod.variable });
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

  playPersonalClip = clip => e => {
    const { client, plexAccount } = this.props;
    const { authToken, clientId } = plexAccount;
    const { key: mediaPath, sectionKey } = clip;
    client
      .query({
        query: GetPlexTransCode,
        variables: {
          authToken,
          clientId,
          mediaPath,
          sectionKey,
        },
      })
      .then(({ data }) => {
        const { url } = data;
        if (url) {
          // window.open(url, '_blank');
          this.setState({ srcURL: url, play: true });
        }
      });
  };

  handleClosePlayer = () => {
    this.setState({ play: false });
  };

  render() {
    const { count, plexAccount } = this.props;
    const { level, node, variable, play, srcURL } = this.state;
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
      limit: `${count}`,
    };
    return (
      <Query partialRefetch fetchPolicy="cache-and-network" query={GetPersonalClips} variables={variables}>
        {({ error, data, loading }) => {
          if (error) return <ErrorMessage message={`Error! ${error.message}`} />;
          if (loading && _.keys(data).length === 0) return <ListLoader className="mt-2 mb-2 ml-2 mr-2" />;

          if (_.keys(data).length > 0) {
            const nodeMod = node;
            if (nodeMod.children.length === 0) {
              nodeMod.loading = false;
              nodeMod.deepest = true;
              const count = _.get(data, 'nodeQuery.count');

              _.transform(
                _.get(data, 'nodeQuery.entities'),
                (result, value) => {
                  const clipTitle = _.get(value, 'entityLabel', 0);
                  const clipNid = _.get(value, 'parentClip.entity.entityId', 0);
                  // const button = (
                  //   <Button
                  //     color="link"
                  //     className="btn-add-to-playlist"
                  //     onClick={e => {
                  //       e.stopPropagation();
                  //       this.addToPlaylist(status, clipNid);
                  //     }}
                  //   >
                  //     <Icon color="#b9c5d8" icon={status ? ICONS.ADD_TO_PLAYLIST : ICONS.CLIP_MISSING} />
                  //   </Button>
                  // );
                  result.push({
                    count: 1,
                    deepest: true,
                    level: 'datesShows',
                    loading: true,
                    name: [
                      <span className="show flex-grow-1 tree-clip-title">
                        <Link href={`/video/${clipNid}`} style={{ color: '#FFF' }}>
                          <a className="text-muted"> {clipTitle} </a>
                        </Link>
                        <div className="d-inline-block tree-clip-date">
                          <span>&nbsp;</span>
                          <span>&nbsp;</span>
                        </div>
                      </span>,
                      <span onClick={this.playPersonalClip(value)} style={{ color: '#FFF' }}>
                        <a className="text-muted"> Play </a>
                      </span>,
                    ],
                    parent: node,
                    linkable: ['video', clipNid],
                  });
                },
                nodeMod.children,
              );
            }
          }

          return (
            <div className="treebeard">
              <TreeBeard data={this.dataTree} onToggle={this.toggleTree} />
              <JWPlayer srcURL={srcURL} play={play} onClose={this.handleClosePlayer} />
            </div>
          );
        }}
      </Query>
    );
  }
}

export default withApollo(PlexClipTree);
