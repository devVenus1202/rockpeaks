import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Col, Row, Form, Input } from 'reactstrap';
import _ from 'lodash';
import { months } from '@constants/dateTime';
import DatePickerHeader from './DatePickerHeader';
import Calendar from './Calendar';
import './DatePicker.style.scss';

class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: props.value,
    };
  }

  setMonth = event => {
    const { value, onChange } = this.props;
    value.month(event.target.value);

    this.setState({ selectedDate: value });
    // onChange(value);
  };

  setYear = event => {
    const { value, onChange } = this.props;
    value.year(event.target.value);

    this.setState({ selectedDate: value });
    // onChange(value);
  };

  setDate = momentData => {
    const { onChoose } = this.props;

    this.setState({ selectedDate: momentData });
    // onChoose(momentData);
  };

  onChooseDate = () => {
    const { onChoose } = this.props;
    const { selectedDate } = this.state;
    onChoose(selectedDate);
  };

  renderYears = () => {
    const curYear = moment().year();
    const years = _.range(1925, curYear + 1);

    return years.map(year => {
      return (
        <option value={year} key={year}>
          {year}
        </option>
      );
    });
  };

  renderMonths = () => {
    return months.map((month, ind) => {
      return (
        <option value={ind} key={ind}>
          {month}
        </option>
      );
    });
  };

  render() {
    const { value } = this.props;
    const curMonth = value.month();
    const curYear = value.year();
    const { selectedDate } = this.state;
    return (
      <div className="secondary-card">
        <DatePickerHeader onChooseDate={this.onChooseDate} />
        <div className="secondary-card-body secondary-card-body-calendar">
          <Form className="m-0 px-3">
            <Row>
              <Col md={7}>
                <Input
                  className="mb-3 mr-0"
                  value={curMonth}
                  onChange={this.setMonth}
                  type="select"
                  id="calendar-month-select"
                  name="calendar-month-select"
                >
                  {this.renderMonths()}
                </Input>
              </Col>
              <Col md={5}>
                <Input
                  className="mb-3 mr-0"
                  value={curYear}
                  onChange={this.setYear}
                  type="select"
                  id="calendar-year-select"
                  name="calendar-year-select"
                >
                  {this.renderYears()}
                </Input>
              </Col>
            </Row>
          </Form>
          <Calendar date={selectedDate.toDate()} onChange={this.setDate} />
        </div>
      </div>
    );
  }
}

DatePicker.defaultProps = {
  value: moment(),
};

DatePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  onChoose: PropTypes.func.isRequired,
  value: PropTypes.instanceOf(Date),
};

export default DatePicker;
