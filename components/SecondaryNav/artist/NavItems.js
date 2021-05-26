import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';

class NavItems extends Component {
  static propTypes = {
    activeTab: PropTypes.string,
    toggleTab: PropTypes.func.isRequired,
  };

  static defaultProps = {
    activeTab: 'song',
  }

  render() {
    const { activeTab, toggleTab } = this.props;
    return (
      <Nav className="tree-nav-bar" tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === 'song' })}
            onClick={() => { toggleTab('song'); }}
          >
            SONG
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === 'album' })}
            onClick={() => { toggleTab('album'); }}
          >
            ALBUM
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === 'show' })}
            onClick={() => { toggleTab('show'); }}
          >
            SHOW
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === 'date' })}
            onClick={() => { toggleTab('date'); }}
          >
            DATE
          </NavLink>
        </NavItem>
      </Nav>
    );
  }
}

export { NavItems };
