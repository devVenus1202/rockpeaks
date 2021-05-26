import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

export default class SelectBox extends Component {
  static propTypes = {
    items: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  render() {
    const { items, onChange } = this.props;
    return (
      <div>
        <Input
          type="select"
          onChange={e => {
            onChange(e.target.value);
          }}
        >
          {items.map(item => {
            return <option value={item.value}>{item.label}</option>;
          })}
        </Input>
      </div>
    );
  }
}
