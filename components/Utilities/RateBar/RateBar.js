import React, { Component } from 'react';
import { range as _range } from 'lodash';
import PropTypes from 'prop-types';
import StarIcon from '@static/images/icons/svg/Star-Icon.svg';
import './RateBar.style.scss';

class RateBar extends Component {
  static propTypes = {
    rating: PropTypes.number.isRequired,
  };

  render() {
    const { rating } = this.props;

    return (
      <ul className="rating-list">
        {_range(0, rating).map(ind => (
          <li key={ind}>
            <img src={StarIcon} alt="" />
          </li>
        ))}
      </ul>
    );
  }
}

export default RateBar;