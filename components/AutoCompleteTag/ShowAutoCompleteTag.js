import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';

import AutoComplete from '@components/Utilities/AutoComplete';

import GET_AUTOCOMPLETE from '@graphql/search/ExtendedAutoComplete.graphql';

export default class ShowAutoCompleteTag extends Component {
  static propTypes = {
    showId: PropTypes.string.isRequired,
    showLabel: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.showLabel || '',
      showId: props.showId || '',
    };
    this.prevItems = [];
  }

  handleChangeShow = value => {
    this.setState({ value, showId: '' });
  };

  selectItem = item => {
    this.setState({ value: item.value, showId: item.id });
    const { onSelect } = this.props;
    if (onSelect) {
      onSelect(item.id, item.value);
    }
  };

  render() {
    const { value, isMatched } = this.state;
    const variables = {
      target_type: 'node',
      bundle: 'show',
      value,
    };

    return (
      <Query
        query={GET_AUTOCOMPLETE}
        variables={variables}
        fetchPolicy="network-only"
      >
        {({ loading, error, data }) => {
          let items;
          if (loading || error) items = this.prevItems;
          else if (data) {
            if (isMatched && this.prevItems.length > 0) {
              items = this.prevItems;
            } else {
              items = data.extendedAutocomplete;
              this.prevItems = items;
            }
          }

          return (
            <AutoComplete
              loading={!!value && loading && !isMatched}
              items={items}
              onChange={this.handleChangeShow}
              onKeyPress={this.handleKeyPress}
              value={value}
              onSelect={this.selectItem}
            />
          );
        }}
      </Query>
    );
  }
}
