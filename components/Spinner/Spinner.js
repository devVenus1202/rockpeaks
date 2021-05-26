import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Spinner.style.scss';

class Spinner extends Component {
  static propTypes = {
    className: PropTypes.string,
  };

  static defaultProps = {
    className: '',
  }

  render() {
    const spins = new Array(12);
    spins.fill(null);
    const { className } = this.props;
    const divs = spins.map((val, i) => <div key={i} />);
    return (
      <div className={`d-flex justify-content-center align-items-center ${className}`}>
        <div className="spinner">
          {divs}
        </div>
      </div>
    );
  }
}

export default Spinner;
