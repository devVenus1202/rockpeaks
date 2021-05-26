import React, { Component } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { withApollo, Query } from 'react-apollo';
import GetAutoCompeleteResult from '@graphql/search/AutoCompleteExtend.graphql';
import { transformArray } from '@helpers/arrayHelper';
import './AutoCompleteTag.style.scss';

class AutoCompleteTag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allowNew: true,
      isLoading: false,
      multiple: false,
      options: [],
      query: '',
    };
    this._typeahead = React.createRef();
  }

  handleSearch = query => {
    this.setState({ isLoading: true });

    this.props.client
      .query({
        query: GetAutoCompeleteResult,
        variables: {
          target_type: 'taxonomy_term',
          bundle: 'clip_tags',
          string: query,
        },
      })
      .then(({ data: { extendedAutocomplete: autocomplete } }) => {
        const options = transformArray(autocomplete, [
          { source: 'entityId', target: 'id' },
          { source: 'entityTitle', target: 'label' },
        ]);
        this.setState({
          isLoading: false,
          options,
          query,
        });
        this._typeahead
          .getInstance()
          .getInput()
          .focus();
      });
  };

  handleInputChange = (input, e) => {};

  handleChange = selectedOptions => {
    const { onChangeTag } = this.props;
    if (onChangeTag) {
      // this._typeahead.getInstance().getInput().value = '';
      this._typeahead.getInstance().clear();
      onChangeTag(selectedOptions);
    }
  };

  render() {
    const { isLoading } = this.state;
    return (
      <AsyncTypeahead
        {...this.state}
        labelKey="label"
        onSearch={this.handleSearch}
        disabled={isLoading}
        placeholder=""
        renderMenuItemChildren={(option, props) => (
          <div key={option.id}>{option.label}</div>
        )}
        style={{ width: '100%' }}
        className="autocomplete"
        minLength={3}
        // onInputChange={this.handleInputChange}
        onChange={this.handleChange}
        // ref={ref => (this._typeahead = ref)}
        // inputRef={this._typeahead}
        ref={typeahead => (this._typeahead = typeahead)}
      />
    );
  }
}
export default withApollo(AutoCompleteTag);
