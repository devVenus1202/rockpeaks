import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  FormGroup,
  Input,
  Button,
} from 'reactstrap';
import './SearchForm.style.scss';

export default class SearchForm extends Component {
  render() {
    const { value, onChange } = this.props;

    return (
      <Form className="search-form m-0 search-form-style">
        <FormGroup>
          <Input
            value={value}
            onChange={onChange}
            type="text"
            placeholder="search"
            required
          />
          <Button
            type="button"
          >
            <i className="fa fa-search" aria-hidden="true" />
          </Button>
        </FormGroup>
      </Form>
    );
  }
}

SearchForm.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
};

SearchForm.defaultProps = {
  onSubmit: null,
};
