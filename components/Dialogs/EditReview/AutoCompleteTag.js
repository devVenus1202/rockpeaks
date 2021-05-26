import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Fragment, Label, Button } from 'reactstrap';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';

class AutoCompleteTag extends React.Component {
  state = {
    allowNew: false,
    isLoading: false,
    multiple: false,
    options: [],
  };

  handleSearch = query => {
    this.setState({ isLoading: true });
    // makeAndHandleRequest(query).then(({ options }) => {
    //   this.setState({
    //     isLoading: false,
    //     options,
    //   });
    // });
  };

  render() {
    return (
      <Fragment>
        <AsyncTypeahead
          {...this.state}
          labelKey="tag"
          onSearch={this.handleSearch}
          placeholder="Search for a Github user..."
          renderMenuItemChildren={(option, props) => <div key={option.id} user={option} />}
        />
      </Fragment>
    );
  }
}
export default AutoCompleteTag;
