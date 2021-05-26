import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Date extends Component {
  static propTypes = {
    year: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    month: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    day: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  };

  static defaultProps = {
    year: null,
    month: null,
    day: null,
  };

  pad = n => {
    const intN = parseInt(n, 10);
    return intN < 10 ? `0${intN}` : intN;
  }

  render() {
    let { day, month, year } = this.props;
    year = year || '';
    month = (month) ? ` ${this.pad(month)}` : '';
    day = (day) ? `-${this.pad(day)}` : '';
    return (
      <span>
        <span className="date-year">{year}</span>
        <span className="date-month">{month}</span>
        <span className="date-day">{day}</span>
      </span>
    );
  }
}

export default Date;
