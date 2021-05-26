import React, { Component } from 'react';
import { Link } from '@root/routes.esm';
import PropTypes from 'prop-types';

import { get as _get, findIndex as _findIndex } from 'lodash';
import { Query } from 'react-apollo';
import {
  Button,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  InputGroup,
  InputGroupButtonDropdown,
  Form,
  Row,
  UncontrolledDropdown,
} from 'reactstrap';

import GET_CONTENT_DETAILS from '@graphql/contents/AllContentsDetails.graphql';
import SEARCH_RESULTS from '@graphql/search/SearchResults.graphql';

import QueryFilter from '@helpers/QueryFilter';
import { getDateFromEntity } from '@helpers/dateTimeHelper';
import MediaTableBox from '@components/Medias/MediaTableBox';
import MediaTableBoxLoader from '@components/Medias/MediaTableBox/MediaTableBoxLoader';
import PaginationBar from '@components/Utilities/Pagination';
import './SearchResults.style.scss';

class SearchResults extends Component {
  static propTypes = {
    filter: PropTypes.obj,
    page: PropTypes.number,
    searchValue: PropTypes.string,
    sort: PropTypes.string,
    type: PropTypes.string.isRequired,
    updatePage: PropTypes.func.isRequired,
    updateSearchValue: PropTypes.func.isRequired,
    updateSort: PropTypes.func.isRequired,
    updateUrl: PropTypes.func.isRequired,
  };

  static defaultProps = {
    filter: {},
    page: 1,
    searchValue: '',
    sort: 'upd',
  };

  sortOptions = [
    { key: 'rel', name: 'Relevance', queryParam: null },
    {
      key: 'nto',
      name: 'Newest to Oldest',
      queryParam: [{ field: 'created', value: 'desc' }],
    },
    {
      key: 'otn',
      name: 'Oldest to Newest',
      queryParam: [{ field: 'created', value: 'asc' }],
    },
    {
      key: 'upd',
      name: 'Recently Updated',
      queryParam: [{ field: 'changed', value: 'desc' }],
    },
    {
      key: 'alph',
      name: 'Alphabetical',
      queryParam: [{ field: 'title', value: 'asc' }],
    },
  ];

  nodeTypes = {
    All: 'all',
    Artists: 'artist',
    Clips: 'clip',
    Discs: 'disc',
    Shows: 'show',
  };

  nodeTypesReverse = {
    all: 'All',
    artist: 'Artists',
    clip: 'Clips',
    disc: 'Discs',
    show: 'Shows',
  };

  constructor(props) {
    super(props);

    const { searchValue, sort } = props;

    this.state = {
      inputValue: searchValue,
      limit: 10,
      activeSort: (searchValue !== '') ? 'rel' : sort,
    };
    this.totalCount = 0;
  }

  onSortChange = key => () => {
    const { updateSort } = this.props;
    this.setState({ activeSort: key }, updateSort(key));
  };

  onInputChange = event => {
    const searchValue = event.target.value;
    const { activeSort } =  this.state;
    const sort = (searchValue !== '') ? 'rel' : 'upd';
    this.setState({ inputValue: searchValue, activeSort: sort });
  };

  getClipImage = (data, fields) => {
    for (let i = 0; i < fields.length; i++) {
      const img = _get(data, fields[i]);
      if (typeof img !== 'undefined') {
        return img;
      }
    }
    return 'https://rockpeaksassets.s3.amazonaws.com/placeholders/clip-default-still-graphic.png';
  };

  getDataForMedia = (type, entity) => {
    const clipActive = _get(entity, 'clipActive', null);
    if (type === 'clip') {
      const nid = _get(entity, 'nid', null);
      const imgURL = this.getClipImage(entity, [
        'smartStillImage640x480.uri',
        'fieldStillImage.url',
        'legacyImage.url.path',
      ]);
      const artist = _get(entity, 'artist.entity.title', null);
      const artistnid = _get(entity, 'artist.entity.nid', null);
      const date = getDateFromEntity(entity, true);
      const dateValue = getDateFromEntity(entity, false);
      const shownid = _get(entity, 'show.entity.nid', null);
      const show = _get(entity, 'show.entity.title', null);
      const title = _get(entity, 'clipTitle', null);
      return {
        artist,
        artistnid,
        clipActive,
        date,
        dateValue,
        imgURL,
        nid,
        shownid,
        show,
        title,
      };
    }

    const { title } = entity;
    const clipsCountActive = _get(entity, 'clipsCountActive', 0);
    const clipsCountTotal = _get(entity, 'clipsCountTotal', 0);

    if (type === 'disc') {
      const nid = _get(entity, 'nid', null);
      const imgURL =        _get(entity, 'discArtwork.url', null)
        || _get(entity, 'legacyImage.uri', null);
      const discType = _get(entity, 'discType.entity.entityLabel', null);
      return {
        clipsCountActive,
        clipsCountTotal,
        discType,
        imgURL,
        nid,
        title,
      };
    }

    if (type === 'artist') {
      const nid = _get(entity, 'nid', null);
      const imgURL =        _get(entity, 'artistPublicityImage.url', null)
        || _get(entity, 'legacyPublicityImage.uri', null);
      return {
        clipsCountActive,
        clipsCountTotal,
        nid,
        imgURL,
        title,
      };
    }

    if (type === 'show') {
      const nid = _get(entity, 'nid', null);
      const imgURL =        _get(entity, 'showBackgroundImage.url', null)
        || _get(entity, 'legacyImage.uri', null);
      return {
        clipsCountActive,
        clipsCountTotal,
        imgURL,
        nid,
        title,
      };
    }
    return null;
  };

  renderData = entities => {
    return entities.map((entity, index) => {
      const entityType = _get(entity, 'type.targetId', null);
      const nid = _get(entity, 'nid', null);

      const linkPref = entityType === 'clip' ? 'video' : `${entityType}s`;
      const clickHandler = () => { };

      const mediaData = this.getDataForMedia(entityType, entity);
      const route = `/${linkPref}/${nid}`;
      return (
        <React.Fragment key={index}>
          <Link passHref route={route} key={index}>
            <a className="search-results-link">
              <MediaTableBox
                onClick={clickHandler}
                type={entityType}
                data={mediaData}
                key={index}
              />
            </a>
          </Link>
          <hr />
        </React.Fragment>
      );
    });
  };

  formSubmit = e => {
    const { updateSearchValue } = this.props;
    const { inputValue } = this.state;
    updateSearchValue(inputValue);
    e.preventDefault();
    return false;
  };

  renderContents = (loading, error, data) => {
    if (loading) return <MediaTableBoxLoader />;
    if (error) {
      return '';
    }

    this.totalCount = _get(data, 'nodeQuery.count', 0);
    const entities = _get(data, 'nodeQuery.entities', []);
    if (entities.length === 0) {
      return '';
    }

    return this.renderData(entities);
  };

  handleSelectedPage = page => {
    const { updatePage } = this.props;
    updatePage(page);
  };

  render() {
    const { filter, page, searchValue, type } = this.props;
    const { inputValue, limit, activeSort } = this.state;

    const conditionGroup = {
      conjunction: 'AND',
      groups: [],
    };
    if (type === 'all') {
      conditionGroup.groups.push({
        conjunction: 'OR',
        conditions: [
          {
            name: 'content_type',
            operator: '=',
            value: 'clip',
          },
          {
            name: 'content_type',
            operator: '=',
            value: 'artist',
          },
          {
            name: 'content_type',
            operator: '=',
            value: 'disc',
          },
          {
            name: 'content_type',
            operator: '=',
            value: 'show',
          },
        ],
      });
    } else {
      conditionGroup.groups.push({
        conditions: [
          {
            name: 'content_type',
            operator: '=',
            value: type === 'video' ? 'clip' : type,
          },
        ],
      });
    }
    let emptyFilter = false;
    if (filter) {
      const filterGroup = {
        conjunction: 'OR',
        conditions: [],
      };
      Object.keys(filter).forEach(key => {
        const filterValue = filter[key];
        filterValue.forEach(val => {
          filterGroup.conditions.push({
            name: key,
            operator: '=',
            value: val,
          });
        });
        if (filterGroup.conditions.length === 0) {
          emptyFilter = true;
        }
      });
      conditionGroup.groups.push(filterGroup);
    }

    const query = !emptyFilter ? (
      <Query
        query={SEARCH_RESULTS}
        variables={{
          conditionGroup,
          end: limit,
          fulltext:
            searchValue !== ''
              ? {
                fields: 'title',
                keys: [searchValue],
              }
              : null,
          start: (page - 1) * limit,
          sort:
            type === 'artist' && activeSort === 'alph'
              ? [{ field: 'name_sort_order', value: 'asc' }]
              : this.sortOptions[
                _findIndex(
                  this.sortOptions,
                  sortItem => sortItem.key === activeSort,
                )
              ].queryParam,
        }}
      >
        {({ loading: loadingOut, data: dataOut }) => {
          if (loadingOut) return <p>Loading...</p>;
          const { activeSort } = this.state;
          const nids = _get(dataOut, 'searchAPISearch.documents', []).map(
            entity => entity.nid,
          );
          const resultCount = _get(dataOut, 'searchAPISearch.result_count', 0);
          const filter = new QueryFilter();
          filter.addCondition('status', true);
          filter.addCondition('nid', nids, 'IN');
          const pagination =            resultCount > limit ? (
            <PaginationBar
              totalItems={resultCount}
              pageSize={limit}
              onSelect={this.handleSelectedPage}
              maxPaginationNumbers={5}
              activePage={parseInt(page, 10)}
              prevComponent="&#8249;"
              nextComponent="&#8250;"
            />
            ) : (
                <div />
              );

          return (
            <div>
              <div>
                <UncontrolledDropdown size="sm" className="float-right">
                  <DropdownToggle
                    className="search-results-sort"
                    color="link"
                    caret
                  >
                    sort options
                  </DropdownToggle>
                  <DropdownMenu right>
                    {this.sortOptions.map(item => (
                      <React.Fragment key={item.key}>
                        <DropdownItem
                          onClick={this.onSortChange(item.key)}
                          active={activeSort === item.key}
                        >
                          {item.name}
                        </DropdownItem>
                      </React.Fragment>
                    ))}
                  </DropdownMenu>
                </UncontrolledDropdown>
                <p className="mb-4">
                  Results found: &nbsp;
                  {resultCount.toLocaleString()}
                </p>
              </div>
              <Query
                query={GET_CONTENT_DETAILS}
                fetchPolicy="no-cache"
                variables={{
                  filter: filter.data(),
                }}
              >
                {({ loading, data, error }) => {
                  if (loading) return <p>Loading...</p>;
                  const entities = _get(data, 'nodeQuery.entities', []);
                  if (entities.length > 0) {
                    entities.sort(
                      (a, b) => nids.indexOf(a.entityId) - nids.indexOf(b.entityId),
                    );
                  }
                  return (
                    <Row>
                      <Col lg={12}>
                        {this.renderContents(loading, error, data)}
                      </Col>
                    </Row>
                  );
                }}
              </Query>
              {pagination}
            </div>
          );
        }}
      </Query>
    ) : (
        <p>Please select some filters</p>
      );
    return (
      <div className="mb-4">
        <Row>
          <Col lg={12}>
            <div className="content-header mb-4">
              <Form onSubmit={this.formSubmit}>
                <InputGroup>
                  <Input
                    placeholder="Search"
                    type="search"
                    value={inputValue}
                    onChange={this.onInputChange}
                  />
                  <InputGroupButtonDropdown addonType="append">
                    <Button outline type="submit">
                      <div className="fa-search fa" />
                    </Button>
                  </InputGroupButtonDropdown>
                </InputGroup>
              </Form>
            </div>
          </Col>
        </Row>
        {query}
      </div>
    );
  }
}

export default SearchResults;
