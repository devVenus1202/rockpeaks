import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RateBar from '@components/Utilities/RateBar';
import './RatingBox.style.scss';

class RatingBox extends Component {
  static propTypes = {
    rating: PropTypes.number.isRequired,
    value: PropTypes.string.isRequired,
  };

  render() {
    const { rating, value } = this.props;

    return (
      <div className="rating-box">
        <p className="h4 mb-1">{value}</p>
        <RateBar rating={rating} />
      </div>
    );
  }
}

export default RatingBox;