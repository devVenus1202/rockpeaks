import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import Link from 'next/link';
import _ from 'lodash';
import ErrorMessage from '@lib/ErrorMessage';

import GET_DECADES_BY_ARTIST from '@graphql/secondaryNav/artist/ArtistDatesDecades.graphql';
import GET_YEARS_BY_ARTIST from '@graphql/secondaryNav/artist/ArtistDatesYears.graphql';
import GET_DATES_SHOWS_BY_ARTIST from '@graphql/secondaryNav/artist/ArtistDatesShows.graphql';
import GET_CLIPS_DATE_ARTIST_BY_SHOW from '@graphql/secondaryNav/artist/ArtistDatesDateShowTitles.graphql';

import { Button } from 'reactstrap';
import { summerize } from '@helpers/stringHelper';
import { ICONS } from '@lib/icons';

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
    decade: GET_DECADES_BY_ARTIST,
    year: GET_YEARS_BY_ARTIST,
    datesShows: GET_DATES_SHOWS_BY_ARTIST,
    dateArtistClips: GET_CLIPS_DATE_ARTIST_BY_SHOW,
  };

  dataSource = {
    decade: {
      variables: variable => ({
        nid: variable,
      }),
    },
    year: {
      variables: variable => ({
        nid: this.nid,
        ...(variable !== 'unknown' && { year0: variable }),
        ...(variable !== 'unknown' && { year1: parseInt(variable, 10) + 1 }),
        ...(variable !== 'unknown' && { year2: parseInt(variable, 10) + 2 }),
        ...(variable !== 'unknown' && { year3: parseInt(variable, 10) + 3 }),
        ...(variable !== 'unknown' && { year4: parseInt(variable, 10) + 4 }),
        ...(variable !== 'unknown' && { year5: parseInt(variable, 10) + 5 }),
        ...(variable !== 'unknown' && { year6: parseInt(variable, 10) + 6 }),
        ...(variable !== 'unknown' && { year7: parseInt(variable, 10) + 7 }),
        ...(variable !== 'unknown' && { year8: parseInt(variable, 10) + 8 }),
        ...(variable !== 'unknown' && { year9: parseInt(variable, 10) + 9 }),
      }),
    },
    datesShows: {
      variables: variable => ({
        conditions: [
          { field: 'type', value: 'clip', operator: 'EQUAL' },
          { field: 'artist.entity.nid', value: this.nid, operator: 'EQUAL' },
          {
            field: 'field_year',
            operator: variable ? 'EQUAL' : 'IS_NULL',
            ...(variable && { value: [variable] }),
          },
        ],
      }),
    },
    dateArtistClips: {
      variables: variable => ({
        conditions: [
          { field: 'type', value: 'clip', operator: 'EQUAL' },
          {
            field: 'field_year',
            operator: variable.fieldYear ? 'EQUAL' : 'IS_NULL',
            ...(variable.fieldYear && { value: [variable.fieldYear] }),
          },
          {
            field: 'field_month',
            operator: variable.fieldMonth ? 'EQUAL' : 'IS_NULL',
            ...(variable.fieldMonth && { value: [variable.fieldMonth] }),
          },
          {
            field: 'field_day',
            operator: variable.fieldDay ? 'EQUAL' : 'IS_NULL',
            ...(variable.fieldDay && { value: [variable.fieldDay] }),
          },
          {
            field: 'show.entity.nid',
            value: [variable.showNid],
            operator: 'EQUAL',
          },
          { field: 'artist.entity.nid', value: [this.nid], operator: 'EQUAL' },
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
      level: 'decade',
      node: null,
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
      case 'decade':
        this.setState({
          level: 'year',
          node: nodeMod,
          variable: nodeMod.variable,
        });
        break;
      case 'year':
        this.setState({
          level: 'datesShows',
          node: nodeMod,
          variable: nodeMod.variable,
        });
        break;
      case 'datesShows':
        this.setState({
          level: 'dateArtistClips',
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
          if (error) return <ErrorMessage message={`Error! ${error.message}`} />;
          if (loading && _.keys(data).length === 0) return <ListLoader className="mt-2 mb-2 ml-2 mr-2" />;

          if (_.keys(data).length > 0) {
            if (level === 'decade' && _.has(data, 'decade1980') && this.dataTree.children.length === 0) {
              _.transform(
                data,
                (result, value, key) => {
                  const count = _.get(value, 'count', 0);
                  if (count !== 0) {
                    const name =
                      key.indexOf('decade') >= 0 ? (
                        `${key.replace('decade', '')}s`
                      ) : (
                        <span className="unknown">____</span>
                      );
                    const level = key.indexOf('decade') >= 0 ? 'decade' : 'year';
                    const variable = key === 'unknown' ? null : key.replace('decade', '');
                    result.push({
                      children: [],
                      level,
                      loading: true,
                      name: [
                        <span className="title-name">{summerize(name, 25)}</span>,
                        <span>&nbsp;</span>,
                        `(${count} clip${count !== 1 ? 's' : ''})`,
                      ],
                      parent: this.dataTree,
                      variable,
                    });
                  }
                },
                this.dataTree.children,
              );

              if (this.dataTree.children.length === 0) {
                return (
                  <div className="p-2rem">
                    <p>Currently, we have no album information for this artist.</p>
                  </div>
                );
              }
            }

            if (
              level === 'year' &&
              _.has(data, 'year0') &&
              variable.toString() === _.get(data, 'decade.entities[0].fieldYear', '').toString()
            ) {
              const nodeMod = node;
              if (nodeMod.children.length === 0) {
                nodeMod.loading = false;
                _.transform(
                  data,
                  (result, value, key) => {
                    const count = _.get(value, 'count', 0);
                    if (count !== 0) {
                      const name = parseInt(variable, 10) + parseInt(key.replace('year', ''), 10);
                      result.push({
                        children: [],
                        level: 'year',
                        loading: true,
                        name: [
                          <span className="title-name">{summerize(name, 25)}</span>,
                          <span>&nbsp;</span>,
                          `(${count} clip${count !== 1 ? 's' : ''})`,
                        ],
                        parent: node,
                        variable:
                          variable === 'unknown'
                            ? 'unknown'
                            : parseInt(variable, 10) + parseInt(key.replace('year', ''), 10),
                      });
                    }
                  },
                  nodeMod.children,
                );
              }
            }

            if (
              level === 'datesShows' &&
              _.has(data, 'datesShows.entities') &&
              ((!variable && !_.get(data, 'datesShows.entities[0].fieldYear')) ||
                variable.toString() === _.get(data, 'datesShows.entities[0].fieldYear', '').toString())
            ) {
              const nodeMod = node;
              if (nodeMod.children.length === 0) {
                const result = [];
                nodeMod.loading = false;
                _.transform(
                  _.get(data, 'datesShows.entities'),
                  (result, value) => {
                    const fieldYear = _.get(value, 'fieldYear', '');
                    const fieldMonth = _.get(value, 'fieldMonth', '');
                    const fieldDay = _.get(value, 'fieldDay', '');
                    const show = _.get(value, 'show.entity.show', 0);
                    const showNid = _.get(value, 'show.entity.showNid', 0);
                    const existing = _.findIndex(result, {
                      variable: {
                        fieldYear,
                        fieldMonth,
                        fieldDay,
                        showNid,
                      },
                    });
                    if (existing === -1) {
                      result.push({
                        children: [],
                        count: 1,
                        level: 'datesShows',
                        loading: true,
                        name: [
                          !fieldMonth ? (
                            <span className="unknown">__</span>
                          ) : (
                            <span className="title-name">{_.padStart(fieldMonth, 2, '0')}</span>
                          ),
                          '-',
                          !fieldDay ? (
                            <span className="unknown">__</span>
                          ) : (
                            <span className="title-name">{_.padStart(fieldDay, 2, '0')}</span>
                          ),
                          <span>&nbsp;</span>,
                          <span className="show title-name">
                            {summerize(show, 25)}
                            &nbsp;
                          </span>,
                          '(1 clip)',
                        ],
                        parent: node,
                        variable: { fieldYear, fieldMonth, fieldDay, showNid },
                      });
                    } else {
                      const resultMod = result;
                      resultMod[existing].count += 1;
                      resultMod[existing].name[5] = `(${resultMod[existing].count} clips)`;
                    }
                  },
                  result,
                );
                nodeMod.children = _.sortBy(result, ['name']);
              }
            }
            if (
              level === 'dateArtistClips' &&
              _.has(data, 'clipsByDateArtistShow.entities') &&
              variable.showNid.toString() ===
                _.get(data, 'clipsByDateArtistShow.entities[0].show.entity.showNid', '').toString()
            ) {
              const nodeMod = node;
              if (nodeMod.children.length === 0) {
                nodeMod.loading = false;
                nodeMod.deepest = true;
                _.transform(
                  _.get(data, 'clipsByDateArtistShow.entities'),
                  (result, value) => {
                    const clipTitle = _.get(value, 'clipTitle', '');
                    const status = _.get(value, 'status', false);
                    const clipNid = _.get(value, 'clipNid', 0);
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
                      deepest: true,
                      level: 'dateArtistClips',
                      name: [
                        <span className="flex-grow-1 tree-clip-title">
                          <Link href={`/video/${clipNid}`}>{summerize(clipTitle, 25)}</Link>
                        </span>,
                        button,
                      ],
                      parent: node,
                      status,
                      variable: { clipNid },
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
