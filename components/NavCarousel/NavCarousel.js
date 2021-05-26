import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import { get } from 'lodash';
import { Nav, NavItem, NavLink, Tooltip } from 'reactstrap';
import { Router } from '@root/routes.esm';

import { withContext } from '@components/HOC/withContext';
import LoadIntoPlayerIcon from '@static/images/icons/svg/Load-Into-Player.svg';
import SaveAsDiscIcon from '@static/images/icons/svg/Save-As-Disc.svg';

import { ICONS } from '@lib/icons';
import Icon from '../Icon';
import './NavCarousel.style.scss';

class NavCarousel extends Component {
  static propTypes = {
    items: PropTypes.object.isRequired,
    onChangeTab: PropTypes.func.isRequired,
    setPlayerStatusId: PropTypes.func.isRequired,
    defaultActiveTab: PropTypes.number,
  };

  // state = {
  //   activeTab: -1,
  //   showTooltip1: false,
  //   showTooltip2: false,
  // };

  constructor(props) {
    super(props);
    const { defaultActiveTab } = props;
    this.state = {
      activeTab: defaultActiveTab,
      showTooltip1: false,
      showTooltip2: false,
    };
  }

  handleChangeTab = activeTab => () => {
    const { activeTab: oldActiveTab } = this.state;

    if (oldActiveTab === activeTab) {
      this.setState({
        activeTab: -1,
      });
    } else {
      this.setState({ activeTab });
    }

    const { items, onChangeTab } = this.props;
    if (onChangeTab) {
      onChangeTab(activeTab, items[activeTab]);
    }
  };

  showTooltip = type => () => {
    if (type) {
      this.setState({
        showTooltip1: true,
      });
    } else {
      this.setState({
        showTooltip2: true,
      });
    }
  };

  hideTooltip = type => () => {
    if (type) {
      this.setState({
        showTooltip1: false,
      });
    } else {
      this.setState({
        showTooltip2: false,
      });
    }
  };

  next = e => {
    e.preventDefault();
    this.slider.slickNext();
  };

  previous = e => {
    e.preventDefault();
    this.slider.slickPrev();
  };

  gotoLink = link => () => {
    // Router.replaceRoute(link);
    window.location.href = link;
  };

  loadIntoPlayer = title => {
    const { setPlayerStatusId } = this.props;

    setPlayerStatusId('draglist-player', title);
  };

  handleSaveDisc = playlist => {
    window.location.href = `/adddisc/${playlist}`;
    // Router.pushRoute(`/adddisc/${playlist}`);
  };

  render() {
    const sliderSettings = {
      arrows: true,
      initialSlide: 0,
      infinite: false,
      lazyLoad: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 4,
    };
    const {
      items,
      theme,
      isShowDropdown,
      hideActionButtons,
      selectedTab,
    } = this.props;
    const { activeTab, showTooltip1, showTooltip2 } = this.state;
    return (
      <Nav className="nav-tabs-secondary nav-carousel slick-carousel-wrap" tabs>
        <button
          type="submit"
          className="btn btn-link prev"
          onClick={this.previous}
        >
          <Icon
            size={32}
            icon={ICONS.CHEVRON_LEFT}
            color={theme === 'dark' ? '#fff' : '#F79127'}
          />
        </button>
        <button type="submit" className="btn btn-link next" onClick={this.next}>
          <Icon
            size={32}
            icon={ICONS.CHEVRON_RIGHT}
            color={theme === 'dark' ? '#fff' : '#F79127'}
          />
        </button>
        <Slider
          ref={c => {
            this.slider = c;
          }}
          {...sliderSettings}
        >
          {items.map((item, index) => {
            const title = get(item, 'title', '');
            const nid = get(item, 'nid', '');
            const count = get(item, 'clipsCount', 0);
            const link = get(item, 'link', '');
            const isActive = selectedTab
              ? selectedTab === index
              : activeTab === index;
            const activeStyle = isActive ? ' active-nav-link' : '';

            const imageUri = get(
              item,
              'still_image',
              'https://rockpeaksassets.s3.amazonaws.com/user_playlists/quadrant_stills/playlist-default.png',
            );

            return (
              <NavItem key={nid}>
                <NavLink
                  className={`playlist-nav-link ${activeStyle}`}
                  // onClick={link ? this.gotoLink(link) : this.handleChangeTab(index)}
                  onClick={count > 0 && this.handleChangeTab(index)}
                  active={activeTab === index}
                >
                  <div className="nav-link-card-wrapper">
                    <div className="nav-link-card">
                      <div className="thumb-container">
                        <div className="thumb">
                          <a>
                            <div className="image-wrapper">
                              <img
                                className="nav-link-card-image"
                                src={imageUri}
                                alt=""
                              />
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                    <br />
                    <p className="card-title">{title}</p>
                    <div className="card-content">
                      {isActive && !hideActionButtons && (
                        <>
                          <button
                            className="load-into-player-btn"
                            type="button"
                            id="load-into-player-btn"
                            onClick={e => {
                              e.stopPropagation();
                              this.loadIntoPlayer(title);
                            }}
                            onMouseEnter={this.showTooltip(true)}
                            onMouseLeave={this.hideTooltip(true)}
                          >
                            <Icon
                              size={20}
                              icon={ICONS.LOADTOPLAYLIST}
                              color="#b9c5d8"
                            />
                          </button>
                          <Tooltip
                            className="playlist-button-tooltip"
                            placement="bottom"
                            target="load-into-player-btn"
                            isOpen={showTooltip1}
                          >
                            Load Into Player
                          </Tooltip>
                        </>
                      )}
                      <div className="clip-label-wrapper">
                        <p>
                          {count > 0
                            ? `${count}${count > 1 ? ' clips' : ' clip'}`
                            : 'No Clip'}
                        </p>
                        {isShowDropdown && (
                          <i className="fa fa-angle-down" aria-hidden="true" />
                        )}
                      </div>
                      {isActive && !hideActionButtons && (
                        <>
                          <button
                            className="save-as-disc-btn"
                            type="button"
                            id="save-as-disc-btn"
                            onMouseEnter={this.showTooltip(false)}
                            onMouseLeave={this.hideTooltip(false)}
                            onClick={() => {
                              this.handleSaveDisc(nid);
                            }}
                          >
                            <img src={SaveAsDiscIcon} alt="load" />
                          </button>
                          <Tooltip
                            className="playlist-button-tooltip"
                            placement="bottom"
                            target="save-as-disc-btn"
                            isOpen={showTooltip2}
                          >
                            Save As Disc
                          </Tooltip>
                        </>
                      )}
                    </div>
                  </div>
                </NavLink>
              </NavItem>
            );
          })}
        </Slider>
      </Nav>
    );
  }
}
NavCarousel.defaultProps = {
  defaultActiveTab: -1,
};
export default withContext(NavCarousel);
