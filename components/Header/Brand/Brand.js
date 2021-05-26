import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavbarBrand } from 'reactstrap';
import DarkLogo from '../../../public/static/images/logo@2x.png';
import LightLogo from '../../../public/static/images/light-logo.svg';
// imported at _app level
// import './Brand.style.scss';

class Brand extends Component {
  render() {
    const { theme } = this.props;
    return (
      <NavbarBrand href="/">
        <img className="brand-img" src={theme === 'dark' ? DarkLogo : LightLogo} alt="RockPeaks" />
      </NavbarBrand>
    );
  }
}

Brand.propTypes = {
  theme: PropTypes.string.isRequired,
};

export default Brand;
