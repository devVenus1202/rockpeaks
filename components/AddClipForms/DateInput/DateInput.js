import React, { Component } from 'react';
import { range as _range } from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Input, Button, Form, FormGroup, Row, Col } from 'reactstrap';
import { months } from '@constants/dateTime';
import ImageBox from '@components/Utilities/ImageBox';
import VideoDescription from '../VideoDescription';
const text1 =
  'Set the date this clip was recorded (preferred) or released / broadcast.Fill in as much information as you have, leaving unknown values set to “Unknown”.';
const nextId = '3B';
class DateInput extends Component {
  setDateField = fieldName => event => {
    const { setClipField } = this.props;
    setClipField(fieldName, event.target.value);
  };

  renderYears = () => {
    const curYear = moment().year();
    const years = _range(curYear + 1, 1925);

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
        <option value={ind + 1} key={ind}>
          {month}
        </option>
      );
    });
  };

  render() {
    const { onNext, onBack, fieldYear, fieldMonth, fieldDay, videoInfo } = this.props;

    return (
      <div>
        <div className="form-wrapper">
          <div className="narrow-container ">
            <p className="text-muted lead mb-4">{text1}</p>
            <div>
              <Row>
                <Col md={3}>
                  <FormGroup>
                    <h6 className="label-title">Day:</h6>
                    <Input type="select" onChange={this.setDateField('field_day')} name="Day" value={fieldDay}>
                      <option value="">Unknown</option>
                      {_range(31).map((num, ind) => (
                        <option value={num + 1} key={ind}>
                          {num + 1}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <h6 className="label-title">Month:</h6>
                    <Input type="select" onChange={this.setDateField('field_month')} name="Year" value={fieldMonth}>
                      <option value="">Unknown</option>
                      {this.renderMonths()}
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <h6 className="label-title">Year:</h6>
                    <Input type="select" onChange={this.setDateField('field_year')} name="Year" value={fieldYear}>
                      <option value="">Unknown</option>
                      {this.renderYears()}
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={3} />
              </Row>
            </div>
          </div>
          <VideoDescription videoInfo={videoInfo} />
        </div>
        <div className="text-right">
          <Button className="mx-4" type="button" onClick={onBack} color="danger" outline>
            Back
          </Button>
          <Button className="ml-4" type="button" onClick={() => onNext(nextId)} color="danger">
            next
          </Button>
        </div>
      </div>
    );
  }
}

DateInput.propTypes = {
  setClipField: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default DateInput;
