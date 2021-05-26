import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';
import { Query, withApollo } from 'react-apollo';
import { get as _get } from 'lodash';

import QueryFilter from '@helpers/QueryFilter';

import GET_CLIP_TYPES from '@graphql/types/ClipTypes.graphql';
import GET_CLIP_PRODUCTIONS from '@graphql/types/ClipProduction.graphql';

export default class ClipType extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  handleChange = event => {
    const { onChange } = this.props;
    onChange(event.target.value);
  };

  render() {
    const filter = new QueryFilter();
    filter.addCondition('vid', 'clip_type');
    filter.addCondition('name', 'Non-Music', 'NOT_EQUAL');
    filter.addCondition('name', 'Music', 'NOT_EQUAL');
    const { value } = this.props;
    return (
      <Query query={GET_CLIP_TYPES} variables={{ filter: filter.data() }}>
        {({ loading, error, data }) => {
          if (loading) {
            return (
              <Input
                type="select"
                onChange={this.handleChange}
                id="clip-type-selector"
                name="clip-type-selector"
                value={value}
                defaultValue={value}
              >
                <option value={0} key={1}>
                  - None -
                </option>
                <option value={value} key={value}>
                  {value}
                </option>
              </Input>
            );
          }
          if (error) return '';

          const types = _get(data, 'taxonomyTermQuery.entities', []);
          return (
            <Input
              type="select"
              onChange={this.handleChange}
              id="clip-type-selector"
              name="clip-type-selector"
              value={value}
              defaultValue={value}
            >
              <option value="none" key="none">
                - None -
              </option>
              {types.map((type, ind) => {
                const { name } = type;
                return value === type ? (
                  <option value={name} key={ind} selected>
                    {name}
                  </option>
                ) : (
                  <option value={name} key={ind}>
                    {name}
                  </option>
                );
              })}
            </Input>
          );
        }}
      </Query>
    );
  }
}

export const ClipProduction = props => {
  const filter = new QueryFilter();
  filter.addCondition('vid', 'clip_production');

  const handleChange = event => {
    const { onChange } = props;
    if (onChange) onChange(event.target.value);
  };
  const { value } = props;
  return (
    <Query query={GET_CLIP_PRODUCTIONS} variables={{ filter: filter.data() }}>
      {({ loading, error, data }) => {
        if (loading) {
          return (
            <Input
              type="select"
              onChange={handleChange}
              id="clip-production-selector"
              name="clip-production-selector"
              value={value}
            >
              <option value={0} key={1}>
                - None -
              </option>
              <option value={value} key={value}>
                {value}
              </option>
            </Input>
          );
        }
        if (error) return '';

        const types = _get(data, 'taxonomyTermQuery.entities', []);
        return (
          <Input
            type="select"
            onChange={handleChange}
            id="clip-production-selector"
            name="clip-production-selector"
            value={value}
          >
            <option value="none" key="none">
              - None -
            </option>
            {types.map((type, ind) => {
              const { name } = type;
              return (
                <option value={name} key={ind}>
                  {name}
                </option>
              );
            })}
          </Input>
        );
      }}
    </Query>
  );
};
