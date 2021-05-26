import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import _ from 'lodash';
import LeftArr from '@static/images/icons/left-arr.png';
import RightArr from '@static/images/icons/right-arr.png';
import './DatePagination.style.scss';

class DatePagination extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: 0,
      index: 0,
      moveValue: 57,
      initialMove: 0,
    };
    this.margin = 4;
    this.canPrev = true;
    this.canNext = true;
  }

  componentDidMount() {
    this.setState({ initialMove: -1 * this.getInitialTranslation() });
  }

  getTotalWidth = () => {
    return this.pagination.offsetWidth;
  };

  getViewWidth = () => {
    return this.getTotalWidth();
  };

  getItemWidth = () => {
    if (this.pagination.children.length > 2) {
      return this.pagination.children[1].offsetWidth;
    }
    return 0;
  };

  getItemsWidth = () => {
    const { count } = this.props;
    return (this.getItemWidth() + this.margin * 2) * count * 2 - this.margin * 2;
  };

  getInitialTranslation = () => {
    const itemsWidth = this.getItemsWidth();
    const viewWidth = this.getViewWidth();
    if (itemsWidth > viewWidth) {
      return (itemsWidth - viewWidth) / 2;
    }
    return 0;
  };

  isEnded = () => {
    const { moveValue, index, initialMove } = this.state;
    if (initialMove && moveValue * (index - 1) < initialMove) {
      // cannot next anymore
      this.canNext = false;
      return 1;
    }
    if (initialMove && moveValue * (index + 1) > -1 * initialMove) {
      // cannot prev anymore
      this.canPrev = false;
      return -1;
    }
    return 0;
  };

  onSelect = (index, value) => () => {
    const { onChange } = this.props;
    this.setState({
      index: 0,
      date: value,
    });

    onChange(value);
  };

  onNext = () => {
    const { index } = this.state;
    if (this.canNext) {
      this.canPrev = true;
      this.setState({ index: index - 1 });
    }
  };

  onPrev = () => {
    const { index } = this.state;
    if (this.canPrev) {
      this.canNext = true;
      this.setState({ index: index + 1 });
    }
  };

  renderDate = (ind, value) => {
    const { active, index, moveValue, initialMove } = this.state;
    const activeStyle = ind === active ? 'active' : '';
    let move = index * moveValue + initialMove;
    const isEnded = this.isEnded();
    if (isEnded !== 0) {
      move = isEnded === 1 ? 2 * (initialMove - 8) : 0;
    }
    const itemStyle = {
      transform: `translateX(${move}px)`,
    };

    const { theme = 'dark' } = this.props;
    return (
      <li className={`page-item ${activeStyle}`} style={itemStyle} key={ind}>
        <a className="page-link" onClick={this.onSelect(ind, value)}>
          {value.format('D')}
        </a>
      </li>
    );
  };

  render() {
    const { count, value: date } = this.props;

    return (
      <nav className="laptop-pagination">
        <ul
          className="pagination justify-content-between"
          ref={ref => {
            this.pagination = ref;
          }}
        >
          {/* <li className="page-item">
            <a
              className="page-link"
              onClick={this.onPrev}
              ref={ref => { this.prefLink = ref; }}
            >
              <img
                className="pagination-arr mr-1"
                src={LeftArr}
                alt=""
              />
              <span>Prev</span>
            </a>
          </li> */}
          {_.range(count - 1).map((num, ind) => {
            return this.renderDate(-ind - 1, moment(date).subtract(count - ind - 1, 'day'));
          })}
          {this.renderDate(0, moment(date))}
          {_.range(count).map((num, ind) => {
            return this.renderDate(ind + count + 1, moment(date).add(ind + 1, 'day'));
          })}
          {/* <li className="page-item">
            <a
              className="page-link"
              onClick={this.onNext}
              ref={ref => { this.nextLink = ref; }}
            >
              <span>Next</span>
              <img
                className="pagination-arr ml-1"
                src={RightArr}
                alt=""
              />
            </a>
          </li> */}
        </ul>
      </nav>
    );
  }
}

DatePagination.defaultProps = {
  disabledValue: null,
};

DatePagination.propTypes = {
  onChange: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired,
  value: PropTypes.instanceOf(moment).isRequired,
};

export default DatePagination;
