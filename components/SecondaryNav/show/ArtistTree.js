import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import _ from 'lodash';
import ErrorMessage from '@lib/ErrorMessage';

import GET_ARTISTS_BY_SHOW_TOTAL from '@graphql/secondaryNav/show/ShowArtistsTotal.graphql';
import GET_ARTISTS_BY_SHOW_ALL from '@graphql/secondaryNav/show/ShowArtistsAll.graphql';
import GET_ARTISTS_BY_SHOW_ALPHABET from '@graphql/secondaryNav/show/ShowArtistsAlphabet.graphql';
import GET_ARTISTS_BY_SHOW_BY_LETTER from '@graphql/secondaryNav/show/ShowArtistsLetters.graphql';
import GET_ARTISTS_BY_SHOW_TITLES from '@graphql/secondaryNav/show/ShowArtistsTitles.graphql';

import { Button } from 'reactstrap';
import { ICONS } from '@lib/icons';
import { ListLoader } from '../../Loader';
import Icon from '../../Icon';
import TreeBeard from '../../Tree';

import { summerize } from '@helpers/stringHelper';

class ArtistTree extends Component {
  static propTypes = {
    nid: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
  };

  ARTISTS_ALPHABET_TRESHOLD = 15;

  dataTree = {
    children: [],
    level: 'root',
    name: 'root',
    toggled: true,
    totalClips: -1,
  };

  treeQueries = {
    artistsTotal: GET_ARTISTS_BY_SHOW_TOTAL,
    artistsAll: GET_ARTISTS_BY_SHOW_ALL,
    artistsAlphabet: GET_ARTISTS_BY_SHOW_ALPHABET,
    artistsByLetter: GET_ARTISTS_BY_SHOW_BY_LETTER,
    artistClips: GET_ARTISTS_BY_SHOW_TITLES,
  };

  dataSource = {
    artistsTotal: {
      query: () => GET_ARTISTS_BY_SHOW_TOTAL,
      variables: variable => ({
        nid: variable,
      }),
    },
    artistsAll: {
      query: () => GET_ARTISTS_BY_SHOW_ALL,
      variables: () => ({
        nid: this.nid,
      }),
    },
    artistsAlphabet: {
      query: () => GET_ARTISTS_BY_SHOW_ALPHABET,
      variables: () => ({
        nid: this.nid,
      }),
    },
    artistsByLetter: {
      query: () => GET_ARTISTS_BY_SHOW_BY_LETTER,
      variables: variable => ({
        conditions: [
          { field: 'type', value: 'clip', operator: 'EQUAL' },
          { field: 'show.entity.nid', value: this.nid, operator: 'EQUAL' },
          ...(variable !== '#' ? [{ field: 'artist.entity.title', operator: 'LIKE', value: `${variable}%` }] : []),
          ...(variable === '#' ? [{ field: 'artist.entity.title', operator: 'NOT_LIKE', value: 'a%' }] : []),
          ...(variable === '#' ? [{ field: 'artist.entity.title', operator: 'NOT_LIKE', value: 'b%' }] : []),
          ...(variable === '#' ? [{ field: 'artist.entity.title', operator: 'NOT_LIKE', value: 'c%' }] : []),
          ...(variable === '#' ? [{ field: 'artist.entity.title', operator: 'NOT_LIKE', value: 'd%' }] : []),
          ...(variable === '#' ? [{ field: 'artist.entity.title', operator: 'NOT_LIKE', value: 'e%' }] : []),
          ...(variable === '#' ? [{ field: 'artist.entity.title', operator: 'NOT_LIKE', value: 'f%' }] : []),
          ...(variable === '#' ? [{ field: 'artist.entity.title', operator: 'NOT_LIKE', value: 'g%' }] : []),
          ...(variable === '#' ? [{ field: 'artist.entity.title', operator: 'NOT_LIKE', value: 'h%' }] : []),
          ...(variable === '#' ? [{ field: 'artist.entity.title', operator: 'NOT_LIKE', value: 'i%' }] : []),
          ...(variable === '#' ? [{ field: 'artist.entity.title', operator: 'NOT_LIKE', value: 'j%' }] : []),
          ...(variable === '#' ? [{ field: 'artist.entity.title', operator: 'NOT_LIKE', value: 'k%' }] : []),
          ...(variable === '#' ? [{ field: 'artist.entity.title', operator: 'NOT_LIKE', value: 'l%' }] : []),
          ...(variable === '#' ? [{ field: 'artist.entity.title', operator: 'NOT_LIKE', value: 'm%' }] : []),
          ...(variable === '#' ? [{ field: 'artist.entity.title', operator: 'NOT_LIKE', value: 'n%' }] : []),
          ...(variable === '#' ? [{ field: 'artist.entity.title', operator: 'NOT_LIKE', value: 'o%' }] : []),
          ...(variable === '#' ? [{ field: 'artist.entity.title', operator: 'NOT_LIKE', value: 'p%' }] : []),
          ...(variable === '#' ? [{ field: 'artist.entity.title', operator: 'NOT_LIKE', value: 'q%' }] : []),
          ...(variable === '#' ? [{ field: 'artist.entity.title', operator: 'NOT_LIKE', value: 'r%' }] : []),
          ...(variable === '#' ? [{ field: 'artist.entity.title', operator: 'NOT_LIKE', value: 's%' }] : []),
          ...(variable === '#' ? [{ field: 'artist.entity.title', operator: 'NOT_LIKE', value: 't%' }] : []),
          ...(variable === '#' ? [{ field: 'artist.entity.title', operator: 'NOT_LIKE', value: 'u%' }] : []),
          ...(variable === '#' ? [{ field: 'artist.entity.title', operator: 'NOT_LIKE', value: 'v%' }] : []),
          ...(variable === '#' ? [{ field: 'artist.entity.title', operator: 'NOT_LIKE', value: 'w%' }] : []),
          ...(variable === '#' ? [{ field: 'artist.entity.title', operator: 'NOT_LIKE', value: 'x%' }] : []),
          ...(variable === '#' ? [{ field: 'artist.entity.title', operator: 'NOT_LIKE', value: 'y%' }] : []),
          ...(variable === '#' ? [{ field: 'artist.entity.title', operator: 'NOT_LIKE', value: 'z%' }] : []),
        ],
      }),
    },
    artistClips: {
      query: () => GET_ARTISTS_BY_SHOW_TITLES,
      variables: variable => ({
        conditions: [
          { field: 'type', value: 'clip', operator: 'EQUAL' },
          { field: 'show.entity.nid', value: [this.nid], operator: 'EQUAL' },
          { field: 'artist.entity.nid', value: [variable], operator: 'EQUAL' },
        ],
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
      level: 'artistsTotal',
      node: null,
      variable: nid,
    };

    this.toggleTree = this.toggleTree.bind(this);
  }

  toggleTree = (node, toggled) => {
    const { cursor } = this.state;
    if (cursor) { cursor.active = false; }
    const nodeMod = node;
    nodeMod.active = true;
    const hasDeepest = Object.prototype.hasOwnProperty.call(nodeMod, 'deepest');
    if (nodeMod.children) {
      if (hasDeepest) nodeMod.deepest = toggled;
      nodeMod.toggled = toggled;
    }
    if (nodeMod.toggled && nodeMod.parent) { // closing all opened siblings, per request
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
      case 'artistsTotal':
        this.setState({ level: 'artistsTotal', node: nodeMod, variable: this.nid });
        break;
      case 'artistsAll':
        this.setState({ level: 'artistsAll', node: nodeMod, variable: this.nid });
        break;
      case 'artistsAlphabet':
        this.setState({ level: 'artistsAlphabet', node: nodeMod, variable: this.nid });
        break;
      case 'artistsByLetter':
        this.setState({ level: 'artistsByLetter', node: nodeMod, variable: nodeMod.variable });
        break;
      case 'artistClips':
        this.setState({ level: 'artistClips', node: nodeMod, variable: nodeMod.variable });
        break;
      default:
        break;
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
            if (
              level === 'artistsTotal'
              && _.has(data, 'artistsByShowTotal')
              && this.dataTree.totalClips === -1
            ) {
              const totalClips = parseInt(_.get(data, 'artistsByShowTotal.count', 0), 10);
              this.dataTree.totalClips = totalClips;
              this.dataTree.level = (totalClips < this.ARTISTS_ALPHABET_TRESHOLD) ? 'artistsAll' : 'artistsAlphabet';
              this.toggleTree(this.dataTree, true);
            }

            if (
              level === 'artistsAll'
              && _.has(data, 'artistsAll.entities')
              && this.dataTree.children.length === 0
            ) {
              _.transform(_.get(data, 'artistsAll.entities'), (result, value) => {
                const artist = _.get(value, 'artist.entity.artistName', '?');
                const artistNid = _.get(value, 'artist.entity.artistNid', null);
                const existing = _.findIndex(result, {
                  variable: artistNid,
                });
                if (artistNid) {
                  if (existing === -1) {
                    result.push({
                      children: [],
                      count: 1,
                      level: 'artistClips',
                      loading: true,
                      name: [
                        <span className="title-name">{summerize(artist, 25)}</span>,
                        <span>&nbsp;</span>,
                        '(1 clip)'
                      ],
                      parent: node,
                      variable: artistNid,
                    });
                  } else {
                    const resultMod = result;
                    resultMod[existing].count += 1;
                    resultMod[existing].name[2] = `(${resultMod[existing].count} clips)`;
                  }
                }
              }, this.dataTree.children);

              if (this.dataTree.children.length === 0) {
                return (
                  <div className="p-2rem">
                    <p>
                      Currently, we have no album information for this artist.
                    </p>
                  </div>
                );
              }

            }

            if (
              level === 'artistsAlphabet'
              && _.has(data, 'alphabet')
              && this.dataTree.children.length === 0
            ) {
              const nodeMod = node;
              if (nodeMod.children.length === 0) {
                nodeMod.loading = false;
                _.transform(data, (result, value, key) => {
                  const count = _.get(value, 'count', 0);
                  if (count !== 0 && key !== 'alphabet') {
                    const name = (key !== 'misc') ? key : '#';
                    result.push({
                      level: 'artistsByLetter',
                      loading: true,
                      name: [
                        <span className="title-name">{summerize(name.toUpperCase(), 25)}</span>,
                        <span>&nbsp;</span>,
                        `(${count} clip${(count !== 1) ? 's' : ''})`
                      ],
                      parent: node,
                      variable: name,
                      children: [],
                    });
                  }
                }, this.dataTree.children);
              }
            }

            if (
              level === 'artistsByLetter'
              && _.has(data, 'artistsByLetter')
              && (
                variable.toString() === _.get(data, 'artistsByLetter.entities[0].artist.entity.artistName', '').charAt(0).toLowerCase()
                || (variable.toString() === '#' && !_.get(data, 'artistsByLetter.entities[0].artist.entity.artistName', '').charAt(0).toLowerCase().match(/[a-z]/i))
              )
            ) {
              const nodeMod = node;
              if (nodeMod.children.length === 0) {
                nodeMod.loading = false;
                _.transform(_.get(data, 'artistsByLetter.entities'), (result, value) => {
                  const artist = _.get(value, 'artist.entity.artistName', '?');
                  const artistNid = _.get(value, 'artist.entity.artistNid', null);
                  const existing = _.findIndex(result, {
                    variable: artistNid,
                  });
                  if (artistNid) {
                    if (existing === -1) {
                      result.push({
                        count: 1,
                        name: [
                          <span className="title-name">{summerize(artist, 25)}</span>,
                          <span>&nbsp;</span>,
                          '(1 clip)'
                        ],
                        level: 'artistClips',
                        variable: artistNid,
                        loading: true,
                        parent: nodeMod,
                        children: [],
                      });
                    } else {
                      const resultMod = result;
                      resultMod[existing].count += 1;
                      resultMod[existing].name[2] = `(${resultMod[existing].count} clips)`;
                    }
                  }
                }, nodeMod.children);
              }
            }

            if (
              level === 'artistClips'
              && _.has(data, 'artistClips.entities')
              && variable.toString() === _.get(data, 'artistClips.entities[0].artist.entity.artistNid', '').toString()
            ) {
              const nodeMod = node;
              if (nodeMod.children.length === 0) {
                nodeMod.loading = false;
                nodeMod.deepest = true;
                _.transform(_.get(data, 'artistClips.entities'), (result, value) => {
                  const clipTitle = _.get(value, 'clipTitle', '');
                  const fieldYear = _.get(value, 'fieldYear', false);
                  const fieldMonth = _.get(value, 'fieldMonth', false);
                  const fieldDay = _.get(value, 'fieldDay', false);
                  const status = _.get(value, 'status', false);
                  const clipNid = _.get(value, 'clipNid', 0);
                  const button = <Button color="link" className="btn-add-to-playlist"><Icon color="#b9c5d8" icon={(status) ? ICONS.ADD_TO_PLAYLIST : ICONS.CLIP_MISSING} /></Button>;
                  result.push({
                    deepest: true,
                    name: [
                      <span className="flex-grow-1 tree-clip-title">
                        {summerize(clipTitle, 25)}
                        <span className="date tree-clip-date">
                          {[
                            (!fieldYear) ? <span className="unknown">__</span>  : _.padStart(fieldYear, 2, '0'),
                            ' ',
                            (!fieldMonth) ? <span className="unknown">__</span>  : _.padStart(fieldMonth, 2, '0'),
                            '-',
                            (!fieldDay) ? <span className="unknown">__</span> : _.padStart(fieldDay, 2, '0'),
                          ]}
                        </span>
                      </span>,
                      button,
                    ],
                    level: 'artistClips',
                    parent: node,
                    variable: { clipNid },
                    status,
                    lastLevel: true,
                    linkable: ['video', clipNid, clipTitle]
                  });
                }, nodeMod.children);
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

export default ArtistTree;
