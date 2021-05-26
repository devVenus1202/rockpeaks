import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import { get as _get } from 'lodash';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';

import { ICONS } from '@lib/icons';
import AddToPlaylist from '@components/Dialogs/AddToPlaylist';

import Icon from '../Icon';

import { TreeSwitcher as ArtistTree } from './artist/TreeSwitcher';
import { NavItems as ArtistNavItems } from './artist/NavItems';

import { TreeSwitcher as ShowTree } from './show/TreeSwitcher';
import { NavItems as ShowNavItems } from './show/NavItems';

class DropdownClips extends Component {
  static propTypes = {
    nid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string.isRequired,
    theme: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.state = {
      activeTab: null,
      dropdownOpen: false,
      selectedNid: 0,
      modalOpened: false,
      fadeOutClass: '',
    };
  }

  handleToggleModal = () => {
    const { modalOpened } = this.state;

    let nextStatus;
    if (modalOpened) {
      nextStatus = !modalOpened;
    } else {
      nextStatus = true;
    }

    this.setState({
      modalOpened: nextStatus,
    });
  };

  addToPlaylist = clipId => {
    this.setState({ modalOpened: true, selectedNid: clipId });
  };

  setOpened = () => {
    this.setState({
      dropdownOpen: true,
      fadeOutClass: '',
    });
  };

  setClosed = () => {
    this.setState({ fadeOutClass: 'fadeout' }, () => {
      setTimeout(() => {
        this.setState({
          dropdownOpen: false,
          fadeOutClass: '',
        });
      }, 450); // This delaying time reference value in secondary.nav.scss fadeout class.
    });
  };

  toggleDropdown = () => {
    const { dropdownOpen } = this.state;
    if (dropdownOpen) {
      this.setClosed();
    } else {
      this.setOpened();
    }
  };

  toggleTab = tab => {
    const { activeTab } = this.state;
    if (activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  };

  render() {
    const { nid, type, theme } = this.props;
    const { activeTab, dropdownOpen, fadeOutClass } = this.state;
    const components = {
      artist: {
        navItems: (
          <ArtistNavItems
            activeTab={activeTab || 'song'}
            toggleTab={this.toggleTab}
          />
        ),
        tree: (
          <ArtistTree
            activeTab={activeTab || 'song'}
            nid={nid}
            addToPlaylist={this.addToPlaylist}
          />
        ),
      },
      clip: {
        navItems: (
          <ArtistNavItems
            activeTab={activeTab || 'song'}
            toggleTab={this.toggleTab}
          />
        ),
        tree: (
          <ArtistTree
            activeTab={activeTab || 'song'}
            nid={nid}
            addToPlaylist={this.addToPlaylist}
          />
        ),
      },
      show: {
        navItems: (
          <ShowNavItems
            activeTab={activeTab || 'date'}
            toggleTab={this.toggleTab}
          />
        ),
        tree: <ShowTree activeTab={activeTab || 'date'} nid={nid} />,
      },
    };

    const { navItems, tree } = components[type];
    const buttonColor = theme === 'dark' ? '#8493a8' : '#374355';
    return (
      <>
        <Dropdown isOpen={dropdownOpen} toggle={this.toggleDropdown} nav>
          <DropdownToggle nav caret className={`${fadeOutClass}`}>
            <Icon color={buttonColor} icon={ICONS.CLIP} />
            Complete Clips List
            <FontAwesomeIcon
              icon={dropdownOpen && !fadeOutClass ? faCaretUp : faCaretDown}
            />
          </DropdownToggle>
          <DropdownMenu className={`dropdown-clips-menu ${fadeOutClass}`}>
            {navItems}
            <div
              className="tree-containter"
              style={{ maxHeight: '550px', overflow: 'auto' }}
            >
              {tree}
            </div>
          </DropdownMenu>
        </Dropdown>
        <AddToPlaylist
          isOpen={this.state.modalOpened}
          onToggle={this.handleToggleModal}
          clip={this.state.selectedNid}
        />
      </>
    );
  }
}
DropdownClips.defaultProps = {
  theme: 'dark',
};
export default DropdownClips;
