import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ButtonGroup, Button } from 'reactstrap';
import { withContext } from '@components/HOC/withContext';

class DateSwitch extends Component {
  render() {
    const { value, theme = 'dark' } = this.props;
    return (
      <ButtonGroup className="all-width" size="lg" role="group">
        <Button className={`btn-${theme}`} type="button" disabled>
          earlier
        </Button>
        <Button className={`btn-${theme} active`} type="button">
          {value}
        </Button>
        <Button className={`btn-${theme}`} type="button" disabled>
          LATER
        </Button>
      </ButtonGroup>
    );
  }
}

DateSwitch.propTypes = {
  value: PropTypes.string.isRequired,
  theme: PropTypes.string,
};
DateSwitch.defaultProps = {
  theme: 'dark',
};
export default withContext(DateSwitch);
