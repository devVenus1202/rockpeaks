import React, { Component } from 'react';
import Slider from 'react-slick';

export default class Slider extends Component {
  static propTypes = {
    settings: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
  };

  render() {
    const { settings, items } = this.props;

    return (
      <Slider {...settings}>
        {items.map((item, index) => {
          return <div key={index}>{item}</div>;
        })}
      </Slider>
    );
  }
}
