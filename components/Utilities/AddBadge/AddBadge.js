import React, { Component } from 'react';
import { remove as _remove } from 'lodash';
import PropTypes from 'prop-types';
import { Row, Col, FormGroup, Button, Input } from 'reactstrap';
import './AddBadge.style.scss';

class AddBadge extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
    };
  }

  onChangeText = event => {
    this.setState({ text: event.target.value });
  };

  onAddItem = () => {
    const { onChange, value } = this.props;
    const { text } = this.state;

    if (!value.includes(text)) {
      value.push(text);
      onChange(value);
      this.setState({ text: '' });
    }
  };

  onRemoveItem = item => () => {
    const { onChange, value } = this.props;

    _remove(value, val => {
      return val === item;
    });

    onChange(value);
  };

  renderBadges = () => {
    const { value } = this.props;

    return (
      <div className="mb-3 item-container">
        {value.map((item, ind) => {
          return (
            <div className="alert alert-light alert-dismissible fade show custom-alert" role="alert" key={ind}>
              {item}
              <button className="close text-light" onClick={this.onRemoveItem(item)} type="button" data-dismiss="alert">
                <span aria-hidden="true">×</span>
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    const { text } = this.state;

    return (
      <React.Fragment>
        {this.renderBadges()}
        <Row>
          <Col md={6}>
            <FormGroup>
              <Input value={text} onChange={this.onChangeText} type="text" placeholder="Tag" required />
            </FormGroup>
          </Col>
        </Row>
        <Button className="mb-4" onClick={this.onAddItem} type="button" color="warning">
          add
        </Button>
      </React.Fragment>
    );
  }
}

AddBadge.propTypes = {
  value: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default AddBadge;
