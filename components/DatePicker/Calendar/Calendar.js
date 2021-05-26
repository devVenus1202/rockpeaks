import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Datetime from 'react-datetime';
import './Calendar.style.scss';

class Calendar extends Component {
  render() {
    const { date, onChange } = this.props;

    return (
      <div className="text-center calendar">
        <Datetime
          value={date}
          onChange={onChange}
          input={false}
          timeFormat={false}
        />
      </div>
    );
  }
}

Calendar.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Calendar;
