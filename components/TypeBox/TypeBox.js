import React, { Component } from 'react';
import update from 'react-addons-update';
import PropTypes from 'prop-types';
import { get as _get } from 'lodash';
import { find as _find } from 'lodash';
import { Query } from 'react-apollo';
import SearchForm from '@components/Utilities/SearchForm';
import { Button, Form, FormGroup, CustomInput } from 'reactstrap';
import QueryFilter from '@helpers/QueryFilter';
import { withContext } from '@components/HOC/withContext';
import GET_CLIP_TYPES from '@graphql/types/ClipTypes.graphql';
import GET_DISC_TYPES from '@graphql/types/DiscTypes.graphql';
import GET_SHOW_TYPES from '@graphql/types/ShowTypes.graphql';
import GET_MASTER_GENRE from '@graphql/MasterGenre.graphql';
import TypeBoxLoader from './TypeBoxLoader';
import './TypeBox.style.scss';

class TypeBox extends Component {
  query = {
    clip: {
      query: GET_CLIP_TYPES,
      type: 'clip_type',
    },
    disc: {
      query: GET_DISC_TYPES,
      type: 'disc_type',
    },
    show: {
      query: GET_SHOW_TYPES,
      type: 'show_type',
    },
    all: {
      query: GET_CLIP_TYPES,
      type: 'clip_type',
    },
    artist: {
      query: GET_MASTER_GENRE,
      type: 'master_genre',
    },
    genre: {
      query: GET_MASTER_GENRE,
      type: 'master_genre',
    },
  };

  static propTypes = {
    category: PropTypes.string.isRequired,
    filter: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    types: PropTypes.object.isRequired,
    theme: PropTypes.string.isRequired,
  };

  static defaultProps = {
    filter: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      searchValue: '',
      selectAll: 1,
      types: [],
    };

    this.onChangeTypes = this.onChangeTypes.bind(this);
    this.onSelectAll = this.onSelectAll.bind(this);
  }

  onSearch = event => {
    const searchValue = event.target.value;
    this.setState({ searchValue });
  };

  onChange = () => {
    const { category, onChange } = this.props;
    const { types } = this.state;
    const filter = {};
    filter[this.query[category].type] = types
      .filter(item => item.checked)
      .map(item => item.name.toLowerCase());
    onChange(filter);
  };

  onChangeTypes = ind => event => {
    const { types } = this.state;
    const { checked } = event.target;
    const index = types.findIndex(entity => entity.tid === ind);
    this.setState(
      {
        selectAll: 0,
        types: update(types, {
          [index]: {
            $merge: { checked },
          },
        }),
      },
      this.onChange,
    );
  };

  onSelectAll = event => {
    const { types } = this.state;
    const updatedTypes = [...types];
    const checked = _get(event, 'target.checked', false);

    updatedTypes.forEach(entity => {
      const entityMod = entity;
      entityMod.checked = checked;
    });
    this.setState(
      { selectAll: checked ? 1 : 2, types: updatedTypes },
      this.onChange,
    );
  };

  isMatching = (value, keyword) => {
    return value.toLowerCase().includes(keyword.toLowerCase());
  };

  renderTypes = () => {
    const { filter: filterProp, category, theme } = this.props;

    const filter = new QueryFilter();
    filter.addCondition('vid', this.query[category].type);

    if (this.query[category] === null) {
      return '';
    }

    const primaryColor = theme === 'light' ? '#fff' : '#3d4d65';
    const secondaryColor = theme === 'light' ? '#A5A4A0' : '#b9c5d8';

    return (
      <Query
        onCompleted={data => {
          const types = _get(data, 'taxonomyTermQuery.entities', []);
          const { type } = this.query[category];
          const filterValue = _get(filterProp, type, []);
          types.forEach(element => {
            const elementMod = element;
            elementMod.checked =              filterValue.length > 0
                ? filterValue.indexOf(elementMod.name.toLowerCase()) > -1
                : true;
          });
          this.setState({ types, selectAll: filterValue.length > 0 ? 2 : 1 });
        }}
        query={this.query[category].query}
        variables={{ filter: filter.data() }}
      >
        {({ loading, error }) => {
          if (loading) {
            return (
              <TypeBoxLoader
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
              />
            );
          }
          if (error) return '';

          const { searchValue, selectAll, types } = this.state;
          const filteredTypes = types.filter(entity => this.isMatching(entity.name, searchValue),
          );
          return (
            <React.Fragment>
              <FormGroup key="-1">
                <CustomInput
                  type="checkbox"
                  onClick={this.onSelectAll}
                  checked={selectAll === 1}
                  key="-1"
                  label="All"
                  id={`${category}-type-all`}
                />
              </FormGroup>
              {filteredTypes.map((entity, ind) => {
                const { name, tid, checked } = entity;
                return (
                  <FormGroup key={ind}>
                    <CustomInput
                      checked={checked}
                      className="type-box-checkbox"
                      id={`type-${tid}`}
                      key={ind}
                      label={name}
                      onClick={this.onChangeTypes(tid)}
                      type="checkbox"
                    />
                  </FormGroup>
                );
              })}
            </React.Fragment>
          );
        }}
      </Query>
    );
  };

  render() {
    const { category } = this.props;
    const { searchValue } = this.state;
    let title = category === 'all' ? 'clip' : category;
    title =      category === 'artist'
        ? `${title.toUpperCase()} GENRES`
        : `${title.toUpperCase()} TYPES`;
    return (
      <div className="typebox-wrapper">
        <div className="secondary-card">
          <div className="secondary-card-header">
            <Button
              className="clear-button float-right"
              onClick={this.onSelectAll}
              outline
              size="sm"
              type="submit"
            >
              clear
            </Button>
            <h4 className="m-0">{title}</h4>
          </div>
          <div className="secondary-card-body">
            <SearchForm value={searchValue} onChange={this.onSearch} />
            <Form className="m-0">{this.renderTypes()}</Form>
          </div>
        </div>
      </div>
    );
  }
}

export default withContext(TypeBox);
