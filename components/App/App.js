import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

import Header from '@components/Header';
import Footer from '@components/Footer';
import { withContext } from '@components/HOC/withContext';
import AlertBox from '@components/Utilities/AlertBox';

import {
  auth,
  isValidToken,
  logout,
  isLoggedIn,
  isLogout,
  isClearCookie,
} from '@helpers/auth';
import { getCookie, setCookie, removeCookie } from '@helpers/session';

const messages = [
  'You have been automatically logged out because another user session has been detected from this browser.',
  'You have been logged out of the site due to inactivity.',
  'You have been logged out of the site already.',
];
class App extends Component {
  state = {
    showLogoutAlert: false,
    intervalId: 0,
    message: -1,
  };

  componentDidMount() {
    window.addEventListener('focus', this.onFocus);
    window.addEventListener('storage', this.onChangeStorage);
    const intervalId = setInterval(this.checkToken, 1000);
    this.setState({ intervalId });
    const state = this.getLogoutState();
    const { message } = this.state;
    if (message !== state) {
      this.setState({ message: state, showLogoutAlert: true });
    }
  }

  onChangeStorage = e => {
    if (e.key === 'access_token' && e.oldValue && !e.newValue) {
      logout();
      window.location.reload();
    }
  };

  onFocus = () => {
    const { user } = this.props;
    const { showLogoutAlert } = this.state;
    const userInfo = auth();
    if (isLoggedIn() && isValidToken() && !user.user_name) {
      window.location.reload();
      return;
    }
    // if (
    //   !showLogoutAlert &&
    //   user.user_name &&
    //   !isLoggedIn() &&
    //   this.getLogoutState() === -1
    // ) {
    //   this.setLogoutState(2);
    //   removeCookie('is_logout');
    //   window.location.reload();
    //   return;
    // }

    // if (isClearCookie()) {
    //   window.location.reload();
    //   return;
    // }
    if (user.user_name && isValidToken()) {
      if (user.user_name !== userInfo.user_name) {
        this.setLogoutState(0);
        window.location.reload();
        return;
      }
    }
    this.checkToken();
  };

  checkToken = () => {
    if (isLoggedIn() && !isValidToken()) {
      logout();
      this.setLogoutState(1);
      window.location.reload();
    }
  };

  closeAlert = () => {
    this.setState({ showLogoutAlert: false });
    this.removeLogoutState();
  };

  removeLogoutState = () => {
    removeCookie('logout');
  };

  setLogoutState = state => {
    setCookie('logout', state);
  };

  getLogoutState = () => {
    const state = getCookie('logout');
    if (!state) {
      return -1;
    }
    return parseInt(state);
  };

  componentWilUnmount() {
    window.removeEventListener('focus', this.onFocus);
    clearInterval(this.state.intervalId);
  }

  onAlertShown = () => {
    this.removeLogoutState();
  }

  render() {
    const {
      children,
      pageClass,
      headerType,
      page,
      authentication,
      theme = 'dark',
      user,
    } = this.props;
    const { showLogoutAlert, message } = this.state;
    return (
      <div className={`${pageClass} theme-${theme}`}>
        <Header
          type={headerType}
          page={page}
          authentication={authentication}
          theme={theme}
          user={user}
        />
        <main className="main">{children}</main>
        <Footer />
        <Modal
          className={`alert-modal theme-${theme}`}
          isOpen={showLogoutAlert}
        >
          {showLogoutAlert && (
            <AlertBox
              type="warning"
              text={messages[message]}
              onClose={this.closeAlert}
              onLoad={this.onAlertShown}
            />
          )}
        </Modal>
      </div>
    );
  }
}

App.defaultProps = {
  pageClass: '',
  headerType: false,
  page: 'unassigned',
};

App.propTypes = {
  page: PropTypes.string,
  pageClass: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  headerType: PropTypes.bool,
  theme: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  authentication: PropTypes.object.isRequired,
};

export default withContext(App);
