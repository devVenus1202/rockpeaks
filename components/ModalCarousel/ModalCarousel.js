import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import { get } from 'lodash';
import { Query } from 'react-apollo';
import { Nav, NavItem, NavLink, Tooltip } from 'reactstrap';

import Date from '@components/Date';
import ThumbImage from '@components/Utilities/ThumbImage';
import VerticalCard from '@components/Utilities/VerticalCard';
import { withContext } from '@components/HOC/withContext';
import GetClipDetail from '@graphql/clip/ClipDetail.graphql';
import Link from 'next/link';
import { getConcatenatedURI, getCalendarLink } from '@helpers/urlHelper';
import { getDateFromEntity } from '@helpers/dateTimeHelper';
import { decodeHtmlSpecialChars } from '@helpers/stringHelper';
import { ICONS } from '@lib/icons';

import Icon from '../Icon';

import './ModalCarousel.style.scss';

class ModalCarousel extends Component {
  static propTypes = {
    clips: PropTypes.object.isRequired,
    theme: PropTypes.string.isRequired,
  };

  state = {
    activeTab: -1,
  };

  next = () => {
    this.slider.slickNext();
  };

  previous = () => {
    this.slider.slickPrev();
  };

  handleChangeTab = activeTab => () => {
    const { activeTab: oldActiveTab } = this.state;

    if (oldActiveTab === activeTab) {
      this.setState({
        activeTab: -1,
      });
    } else {
      this.setState({ activeTab });
    }

    const { clips, onChangeTab } = this.props;
    if (onChangeTab) {
      onChangeTab(activeTab, clips[activeTab]);
    }
  };

  getImage = (data, fields) => {
    for (let i = 0; i < fields.length; i++) {
      const img = get(data, fields[i]);
      if (typeof img !== 'undefined') {
        return img;
      }
    }
    return 'https://rockpeaksassets.s3.amazonaws.com/placeholders/clip-default-still-graphic.png';
  };

  renderItem = (index, item) => {
    const {
      theme,
      isShowDropdown,
      hideActionButtons,
      selectedTab,
    } = this.props;
    const { activeTab } = this.state;
    const nid = get(item, 'clip.0.entity.entityId', '');
    const clip = get(item, 'clip.0.entity', {});
    const title = get(item, 'title', '');
    const { artist, show, fieldYear, fieldMonth, fieldDay, date } = clip;
    const isActive = selectedTab ? selectedTab === index : activeTab === index;
    const activeStyle = isActive ? ' active-nav-link' : '';
    const imageUri = this.getImage(clip, [
      'smartStillImage640x480.uri',
      'fieldStillImage.url',
      'legacyImage.url.path',
    ]);

    return (
      <NavItem key={nid}>
        <NavLink
          className={`review-nav-link ${activeStyle}`}
          // onClick={link ? this.gotoLink(link) : this.handleChangeTab(index)}
          onClick={this.handleChangeTab(index)}
          active={activeTab === index}
        >
          <div className="nav-link-card-wrapper text-left">
            <div className="nav-link-card">
              <ThumbImage src={imageUri} />
            </div>
            <Link
              href={getConcatenatedURI(
                'video',
                nid,
                artist ? artist.entity.title : '',
                show ? show.entity.title : '',
                clip.clipTitle,
              )}
            >
              <a>
                <p className="card-text mb-2 title mt-2">{clip.clipTitle}</p>
              </a>
            </Link>
            {artist && (
              <Link
                href={getConcatenatedURI(
                  'artists',
                  artist.entity.entityId,
                  artist.entity.title,
                )}
              >
                <a>
                  <p className="card-text">
                    {decodeHtmlSpecialChars(artist.entity.title)}
                  </p>
                </a>
              </Link>
            )}
            {show && (
              <Link
                href={getConcatenatedURI(
                  'shows',
                  show.entity.entityId,
                  show.entity.title,
                )}
              >
                <a>
                  <p className="card-text">
                    {decodeHtmlSpecialChars(show.entity.title)}
                  </p>
                </a>
              </Link>
            )}
            <Link
              href={getCalendarLink(
                getDateFromEntity({ fieldYear, fieldMonth, fieldDay }, false),
              )}
            >
              <a>
                <p className="card-text">
                  <Date day={fieldDay} month={fieldMonth} year={fieldYear} />
                </p>
              </a>
            </Link>
            <div className="card-content">
              <div className="clip-label-wrapper">
                {isShowDropdown && (
                  <i className="fa fa-angle-down" aria-hidden="true" />
                )}
              </div>
            </div>
          </div>
        </NavLink>
      </NavItem>
    );
  };

  render() {
    const sliderSettings = {
      arrows: false,
      initialSlide: 0,
      infinite: false,
      lazyLoad: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 4,
    };
    const { clips, theme } = this.props;
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
          {clips.map((item, index) => {
            return this.renderItem(index, item);
          })}
        </Slider>
      </Nav>
    );
  }
}
export default withContext(ModalCarousel);
