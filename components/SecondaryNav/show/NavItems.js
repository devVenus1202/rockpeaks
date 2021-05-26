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
    activeTab: 'date',
  }

  render() {
    const { activeTab, toggleTab } = this.props;
    return (
      <Nav className="tree-nav-bar" tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === 'date' })}
            onClick={() => { toggleTab('date'); }}
          >
            DATE
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === 'artist' })}
            onClick={() => { toggleTab('artist'); }}
          >
            ARTIST
          </NavLink>
        </NavItem>
      </Nav>
    );
  }
}

export { NavItems };
