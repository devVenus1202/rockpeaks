import React, { Component } from 'react';
import Link from 'next/link';
import { withRouter } from 'next/router';

import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';

import PropTypes from 'prop-types';
import { ICONS } from '@lib/icons';
import DraftPanel from '@components/DraftPanel';
import { withAuthSync } from '../HOC/withAuthSync';
import Icon from '../Icon';
import { USER_NAME, USER_TOKEN, logout } from '../../helpers/auth';

import Brand from './Brand';
import Search from './Search';
import Login from './Login';
import User from './User';

export class HeaderMenu extends Component {
  static propTypes = {
    page: PropTypes.string.isRequired,
    authentication: PropTypes.object.isRequired,
    theme: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
    };
    this.login = React.createRef();
  }

  componentDidMount() {
    const { authentication } = this.props;
    const {
      router: { query },
    } = this.props;
    if (query.destination) {
      this.login.openLogin();
    } else if (query.logout === 'discourse' && authentication.isLogin) {
      logout();
      window.location.href = '/';
    }
  }

  getStyle = type => {
    const { page } = this.props;

    return page === type ? 'active' : '';
  };

  toggle() {
    const { isOpen } = this.state;
    this.setState({
      isOpen: !isOpen,
    });
  }

  render() {
    const { isOpen } = this.state;
    const { authentication, theme, user } = this.props;
    return (
      <Navbar className="navbar-expand-lg fixed-top" key={isOpen}>
        <Brand theme={theme} />
        <NavbarToggler onClick={this.toggle} className="mr-2">
          <Icon icon={ICONS.MENU} color="#8493a8" />
        </NavbarToggler>
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <Link href="/" passHref>
                <NavLink className={this.getStyle('home')}>Home</NavLink>
              </Link>
            </NavItem>
            <NavItem>
              <Link href="/browse" passHref>
                <NavLink className={this.getStyle('browse')}>Browse</NavLink>
              </Link>
            </NavItem>
            <NavItem>
              <Link href="/match" passHref>
                <NavLink className={this.getStyle('match')}>Match</NavLink>
              </Link>
            </NavItem>
            <NavItem>
              <Link href="/contribute" passHref>
                <NavLink className={this.getStyle('contribute')}>
                  Contribute
                </NavLink>
              </Link>
            </NavItem>
            <NavItem>
              <Link
                href={
                  authentication.isLogin
                    ? 'https://forum.rockpeaks.com/session/sso'
                    : 'https://forum.rockpeaks.com'
                }
              >
                <NavLink className={this.getStyle('forum')}>Forum</NavLink>
              </Link>
            </NavItem>
          </Nav>
          <Search />
        </Collapse>

        <Collapse className="user-info" isOpen={isOpen} navbar>
          {authentication.isLogin ? (
            <User userInfo={user} theme={theme} />
          ) : (
              <Login theme={theme} />
            )}
        </Collapse>
        <div style={{ display: 'none' }}>
          <Login
            theme={theme}
            isSso
            ref={component => {
              if (component) {
                this.login = component;
              }
            }}
          />
        </div>
      </Navbar>
    );
  }
}

export default withRouter(HeaderMenu);
