import * as React from 'react';
import Autosuggest from 'react-autosuggest';
import { Spinner } from 'reactstrap';

import PropTypes from 'prop-types';
import { decodeHtmlSpecialChars } from '@helpers/stringHelper';

import './AutoComplete.style.scss';

function getSuggestionValue(suggestion) {
  if (suggestion.value) {
    return suggestion.value;
  }
  return suggestion;
}

function renderSuggestion(suggestion) {
  if (suggestion.value) {
    return <span dangerouslySetInnerHTML={{ __html: suggestion.value }} />;
  }
  return <span dangerouslySetInnerHTML={{ __html: suggestion }} />;
}

class AutoComplete extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
    };
    this.input = React.createRef();
  }

  onChange = (event, { newValue }) => {
    const { onChange } = this.props;

    // this.setState({
    //   value: newValue,
    // });

    onChange(newValue);
  };

  onSuggestionsFetchRequested = () => {};

  onSuggestionsClearRequested = () => {};

  selectSuggestion = (e, data) => {
    const { onSelect } = this.props;
    if (onSelect) {
      onSelect(data.suggestion);
    }
  };

  setFocus = () => {
    this.input.current.focus();
  };

  renderInputComponent = inputProps => {
    const { loading } = this.props;
    return (
      <div>
        <input {...inputProps} ref={this.input} />
        {loading && <Spinner className="loading-spinner" size="sm" />}
      </div>
    );
  };

  render() {
    const { items, loading, value } = this.props;
    // const { value } = this.state;
    const inputProps = {
      className: 'form-control',
      placeholder: '',
      value: decodeHtmlSpecialChars(value),
      onChange: this.onChange,
    };

    return (
      <Autosuggest
        suggestions={items}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        renderInputComponent={this.renderInputComponent}
        inputProps={inputProps}
        onSuggestionSelected={this.selectSuggestion}
      />
    );
  }
}

AutoComplete.propTypes = {
  items: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  loading: PropTypes.bool,
};
AutoComplete.defaultProps = {
  loading: false,
  value: '',
};

export default AutoComplete;
