import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import _ from 'lodash';
import Link from 'next/link';

import ErrorMessage from '@lib/ErrorMessage';

import GET_SHOWS_BY_ARTIST from '@graphql/secondaryNav/artist/ArtistShows.graphql';
import GET_SONGS_BY_SHOW_BY_ARTIST from '@graphql/secondaryNav/artist/ArtistShowsSongs1.graphql';

import { Button } from 'reactstrap';
import { ICONS } from '@lib/icons';
import { summerize } from '@helpers/stringHelper';

import { ListLoader } from '../../Loader';
import Icon from '../../Icon';
import TreeBeard from '../../Tree';

class DateTree extends Component {
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
    show: GET_SHOWS_BY_ARTIST,
    song: GET_SONGS_BY_SHOW_BY_ARTIST,
  };

  dataSource = {
    show: {
      variables: variable => ({
        nid: variable,
      }),
    },
    song: {
      variables: variable => ({
        nid: this.nid,
        showNid: variable,
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
      level: 'show',
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
        if (Object.prototype.hasOwnProperty.call(elemMod, 'deepest')) elemMod.deepest = false;
      });
      nodeMod.toggled = true;
      if (hasDeepest) nodeMod.deepest = true;
    }
    this.setState({ cursor: nodeMod });
    switch (nodeMod.level) {
      case 'show':
        this.setState({ level: 'song', node: nodeMod, variable: nodeMod.variable });
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
          if (error) return <ErrorMessage message={`Error! ${error.message}`} />;
          if (loading && _.keys(data).length === 0) return <ListLoader className="mt-2 mb-2 ml-2 mr-2" />;
          if (_.keys(data).length > 0) {
            if (level === 'show' && _.has(data, 'showsByArtist.entities')) {
              const nodeMod = node;
              if (nodeMod.children.length === 0) {
                const result = [];
                nodeMod.loading = false;
                _.transform(
                  _.get(data, 'showsByArtist.entities'),
                  (result, value) => {
                    const show = _.get(value, 'show.entity.show', '');
                    const showNid = _.get(value, 'show.entity.showNid', false);
                    const existing = _.findIndex(result, {
                      variable: showNid,
                    });
                    if (showNid) {
                      if (existing === -1 && showNid) {
                        result.push({
                          children: [],
                          count: 1,
                          level: 'show',
                          loading: true,
                          name: [
                            <span className="title-name">{summerize(show, 30)}</span>,
                            <span>&nbsp;</span>,
                            '(1 clip)',
                          ],
                          parent: node,
                          variable: showNid,
                        });
                      } else {
                        const resultMod = result;
                        resultMod[existing].count += 1;
                        resultMod[existing].name[2] = `(${resultMod[existing].count} clips)`;
                      }
                    }
                  },
                  result,
                );

                if (result.length === 0) {
                  return (
                    <div className="p-2rem">
                      <p>Currently, we have no album information for this artist.</p>
                    </div>
                  );
                }

                nodeMod.children = result; //_.sortBy(result, ['name']);
              }
            }
            if (
              level === 'song' &&
              _.has(data, 'songsByShowByArtist.entities') &&
              variable.toString() === _.get(data, 'songsByShowByArtist.entities[0].show.entity.showNid', '').toString()
            ) {
              const nodeMod = node;
              if (nodeMod.children.length === 0) {
                nodeMod.loading = false;
                nodeMod.deepest = true;
                _.transform(
                  _.get(data, 'songsByShowByArtist.entities'),
                  (result, value) => {
                    const fieldYear = _.get(value, 'fieldYear', '');
                    const fieldMonth = _.get(value, 'fieldMonth', '');
                    const fieldDay = _.get(value, 'fieldDay', '');
                    const clipTitle = _.get(value, 'clipTitle', 0);
                    const clipNid = _.get(value, 'clipNid', 0);
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
                        <Icon color="#b9c5d8" icon={status ? ICONS.ADD_TO_PLAYLIST : ICONS.CLIP_MISSING} />
                      </Button>
                    );
                    result.push({
                      count: 1,
                      deepest: true,
                      level: 'song',
                      loading: true,
                      name: [
                        <span className="show flex-grow-1 tree-clip-title">
                          <Link href={`/video/${clipNid}`}>{summerize(clipTitle, 30)}</Link>

                          <div className="d-inline-block tree-clip-date">
                            <span>&nbsp;</span>
                            {!fieldMonth ? <span className="unknown">__</span> : _.padStart(fieldMonth, 2, '0')}
                            {'-'}
                            {!fieldDay ? <span className="unknown">__</span> : _.padStart(fieldDay, 2, '0')}
                            <span>&nbsp;</span>
                            {!fieldYear ? <span className="unknown">__</span> : fieldYear}
                            <span>&nbsp;</span>
                          </div>
                        </span>,
                        button,
                      ],
                      parent: node,
                      variable: clipNid,
                      lastLevel: true,
                      linkable: ['video', clipNid, clipTitle],
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

export default DateTree;
