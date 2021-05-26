import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonGroup } from 'reactstrap';
import './SwitchType.style.scss';

class SwitchType extends Component {
  render() {
    const { type, onChange } = this.props;

    return (
      <div className="switch-type">
        <ButtonGroup>
          <Button
            active={type}
            onClick={onChange('table')}
            color={!type ? 'danger' : 'secondary'}
          >
            TABLE VIEW
          </Button>
          <Button
            onClick={onChange('calendar')}
            active={!type}
            color={type ? 'danger' : 'secondary'}
          >
            CALENDAR VIEW
          </Button>
        </ButtonGroup>
      </div>
    );
  }
}

SwitchType.defaultProps = {
  type: false,
};

SwitchType.propTypes = {
  type: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

export default SwitchType;
