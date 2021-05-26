import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button } from 'reactstrap';
import { withContext } from '@components/HOC/withContext';
import ArrowCalendarDark from '@static/images/icons/svg/arrow-calendar-icon-dark.svg';
import ArrowCalendarLight from '@static/images/icons/svg/arrow-calendar-icon-light.svg';
import { ICONS } from '@lib/icons';
import Icon from '../../Icon';
import './DatePickerHeader.style.scss';

class DatePickerHeader extends Component {
  render() {
    const { onChooseDate, theme, date } = this.props;

    return (
      <div className="secondary-card-header">
        <Row>
          <Col>
            <h4 className="mb-3">
              JUMP
              <br />
              TO A DATE
            </h4>
          </Col>
          <Col>
            <a className="calendar-btn mb-3" onClick={onChooseDate}>
              <img src={theme === 'dark' ? ArrowCalendarDark : ArrowCalendarLight} alt="" />
              <Icon color="#b9c5d8" icon={ICONS.ARROW_CALENDAR} />
            </a>
          </Col>
        </Row>
        <p className="m-0 d-flex align-items-center justify-content-between">
          <span>Select month + year + day then </span>
          <Button
            color="danger"
            size="sm"
            className="p-1"
            style={{ minWidth: '2rem', borderRadius: '3px' }}
            onClick={onChooseDate}
          >
            GO
          </Button>
        </p>
      </div>
    );
  }
}

DatePickerHeader.propTypes = {
  onChooseDate: PropTypes.func.isRequired,
};

export default withContext(DatePickerHeader);
