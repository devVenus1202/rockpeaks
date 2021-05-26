import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
// import './Header.style.scss';
import HeaderMenu from './HeaderMenu';

class Header extends Component {
  render() {
    const { type, page, authentication, theme, user } = this.props;
    const headerStyle = `header ${type ? 'header-dark' : 'header-bright'} `;
    return (
      <header className={`${headerStyle} theme-${theme}`}>
        <HeaderMenu page={page} authentication={authentication} theme={theme} user={user} />
      </header>
    );
  }
}

Header.defaultProps = {
  type: false,
  authentication: { isLogin: false, userInfo: {} },
  theme: 'dark',
  user: {},
};

Header.propTypes = {
  type: PropTypes.bool,
  page: PropTypes.string.isRequired,
  authentication: PropTypes.object,
  theme: PropTypes.string,
  user: PropTypes.object,
};

export default withRouter(Header);
