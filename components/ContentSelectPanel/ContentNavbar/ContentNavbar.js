import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Navbar, Nav, NavLink, NavItem } from 'reactstrap';
import { ICONS } from '@lib/icons';
import { withContext } from '@components/HOC/withContext';
// import All from '@static/images/icons/all.png';
// import AllActive from '@static/images/icons/all-active.png';
// import Clip from '@static/images/icons/clip.png';
// import ClipActive from '@static/images/icons/clip-active.png';
// import Disc from '@static/images/icons/disc.png';
// import DiscActive from '@static/images/icons/disc-active.png';
// import Artist from '@static/images/icons/artist.png';
// import ArtistActive from '@static/images/icons/artist-active.png';
// import Show from '@static/images/icons/show.png';
// import ShowActive from '@static/images/icons/show-active.png';
import './ContentNavbar.style.scss';
import Icon from '../../Icon';

class ContentNavbar extends Component {
  onSelectCategory = value => () => {
    const { selectCategory, selectable } = this.props;
    if (selectable) {
      selectCategory(value);
    }
  };

  render() {
    const { value, selectable, theme } = this.props;
    const selectStyle = !selectable ? 'disabled-navbar' : '';
    const defaultColor = theme === 'dark' ? '#8293A7' : '#544A3B';
    const activeColor = theme === 'dark' ? '#fff' : '#000';
    return (
      <Navbar className={`secondary-nav ${selectStyle}`}>
        <Nav className="secondary-nav">
          <NavItem onClick={this.onSelectCategory('all')} active={value === 'all'}>
            <NavLink className="secondary-nav-link">
              <div className="default">
                <Icon size={30} icon={ICONS.ALL} color={defaultColor} />
              </div>
              <div className="active">
                <Icon size={30} icon={ICONS.ALL} color={activeColor} />
              </div>
              {/* <img className="default" src={All} alt="" />
              <img className="active" src={AllActive} alt="" /> */}
              All
            </NavLink>
          </NavItem>
          <NavItem onClick={this.onSelectCategory('clip')} active={value === 'clip'}>
            <NavLink className="secondary-nav-link">
              {/* <img className="default" src={Clip} alt="" /> */}
              {/* <img className="active" src={ClipActive} alt="" /> */}
              <div className="default">
                <Icon size={30} icon={ICONS.CLIP} color={defaultColor} />
              </div>
              <div className="active">
                <Icon size={30} icon={ICONS.CLIP} color={activeColor} />
              </div>
              Clips
            </NavLink>
          </NavItem>
          <NavItem onClick={this.onSelectCategory('disc')} active={value === 'disc'}>
            <NavLink className="secondary-nav-link">
              {/* <img className="default" src={Disc} alt="" />
              <img className="active" src={DiscActive} alt="" /> */}
              <div className="default">
                <Icon size={30} icon={ICONS.DISC} color={defaultColor} />
              </div>
              <div className="active">
                <Icon size={30} icon={ICONS.DISC} color={activeColor} />
              </div>
              Discs
            </NavLink>
          </NavItem>
          <NavItem onClick={this.onSelectCategory('artist')} active={value === 'artist'}>
            <NavLink className="secondary-nav-link">
              {/* <img className="default" src={Artist} alt="" />
              <img className="active" src={ArtistActive} alt="" /> */}
              <div className="default">
                <Icon size={30} icon={ICONS.ARTIST} color={defaultColor} />
              </div>
              <div className="active">
                <Icon size={30} icon={ICONS.ARTIST} color={activeColor} />
              </div>
              Artists
            </NavLink>
          </NavItem>
          <NavItem onClick={this.onSelectCategory('show')} active={value === 'show'}>
            <NavLink className="secondary-nav-link">
              {/* <img className="default" src={Show} alt="" />
              <img className="active" src={ShowActive} alt="" /> */}
              <div className="default">
                <Icon size={30} icon={ICONS.TV} color={defaultColor} />
              </div>
              <div className="active">
                <Icon size={30} icon={ICONS.TV} color={activeColor} />
              </div>
              Shows
            </NavLink>
          </NavItem>
        </Nav>
      </Navbar>
    );
  }
}

ContentNavbar.defaultProps = {
  selectable: false,
};

ContentNavbar.propTypes = {
  selectCategory: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  selectable: PropTypes.bool,
};

export default withContext(ContentNavbar);
