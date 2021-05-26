import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Container } from 'reactstrap';
import { Router } from '@root/routes.esm';
import App from '@components/App';
import ContentSelectPanel from '@components/ContentSelectPanel';
import TypeBox from '@components/TypeBox';
import './Browse.style.scss';
import SearchResults from '@components/SearchResults';

class BrowseTable extends React.Component {
  static propTypes = {
    type: PropTypes.string,
    searchValue: PropTypes.string,
    page: PropTypes.number,
    url: PropTypes.object.isRequired,
  };

  static defaultProps = {
    type: 'all',
    searchValue: '',
    page: 1,
  };

  nodeType = {
    all: 'all',
    artists: 'artist',
    discs: 'disc',
    shows: 'show',
    video: 'clip',
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

    const {
      url: {
        query: {
          filter: filterProp,
          key: keyProp,
          page: pageProp,
          sort: sortProp,
          type: typeProp,
        },
      },
    } = this.props;

    const type = typeProp ? this.nodeType[typeProp] : 'all';
    const page =      pageProp
      && Number.isInteger(parseInt(pageProp, 10))
      && parseInt(pageProp, 10) > 0
        ? parseInt(pageProp, 10)
        : 1;
    const searchValue = keyProp;
    const filter = filterProp ? JSON.parse(filterProp) : null;
    const sort = sortProp || undefined;

    this.state = {
      filter,
      genres: {},
      page,
      searchValue,
      sort,
      type,
    };
    this.totalCount = 0;
  }

  onSelectCategory = type => {
    this.setState({ filter: null, type, page: 1 }, this.updateUrl);
  };

  onChangeView = view => () => {
    if (view === 'calendar') {
      Router.pushRoute('/browse/calendar');
    }
  };

  onChangeType = filter => {
    this.setState({ filter }, this.updateUrl);
  };

  updateSort = sort => {
    this.setState({ sort }, this.updateUrl);
  };

  updatePage = page => {
    this.setState({ page }, this.updateUrl);
  };

  updateSearchValue = searchValue => {
    this.setState({ page: 1, searchValue }, this.updateUrl);
  };

  updateUrl = () => {
    const { filter, page: pageParam, searchValue, sort, type } = this.state;
    const param = {
      key: searchValue !== '' ? searchValue : null,
      page: pageParam,
      sort,
      type: this.nodeTypesReverse[type].toLowerCase().replace('clips', 'video'),
    };
    if (filter) param.filter = JSON.stringify(filter);
    Router.pushRoute('browse', param);
  };

  render() {
    const { filter, genres, page, searchValue, sort, type } = this.state;
    const typeBox =      type !== 'all' ? (
      <Col className="fixed-col col-md-auto">
        <Row noGutters>
          <Col>
            <TypeBox
              filter={filter}
              category={type}
              types={genres}
              onChange={this.onChangeType}
            />
          </Col>
        </Row>
      </Col>
      ) : null;
    return (
      <App pageClass="browse-page" page="browse">
        <ContentSelectPanel
          category={type}
          view="table"
          onSelectCategory={this.onSelectCategory}
          onChangeView={this.onChangeView}
        />
        <div className="section pb-0 browse-section-style">
          <Container>
            <Row>
              {typeBox}
              <Col>
                <SearchResults
                  filter={filter}
                  page={parseInt(page, 10)}
                  searchValue={searchValue}
                  sort={sort}
                  type={type}
                  updatePage={this.updatePage}
                  updateSort={this.updateSort}
                  updateSearchValue={this.updateSearchValue}
                  updateUrl={this.updateUrl}
                />
              </Col>
            </Row>
          </Container>
        </div>
      </App>
    );
  }
}

export default BrowseTable;
