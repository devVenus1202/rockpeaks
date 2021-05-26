import React from 'react';
import Link from 'next/link';
import { withRouter } from 'next/router';
import Slider from 'react-slick';
import InputRange from 'react-input-range';
import { Button } from 'reactstrap';

import AddToPlaylist from '@components/Dialogs/AddToPlaylist';
import { withContext } from '@components/HOC/withContext';

import { summerize, decodeHtmlSpecialChars } from '@helpers/stringHelper';
import { handleClickLink, handleGotoCalendar } from '@helpers/routeHelper';
import { getDateFromEntity } from '@helpers/dateTimeHelper';

import { ICONS } from '@lib/icons';
import { get as _get } from 'lodash/object';
import { getConcatenatedURI } from '@helpers/urlHelper';
import Date from '../Date/index';
import Icon from '../Icon';

const SLIDER_NEXT = true;
const SLIDER_PREV = false;
// const ACTION_DOING = true;
const ACTION_DONE = false;

class SlickCarousel extends React.Component {
  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.state = {
      activeSlide: 0,
      modalOpened: false,
      selectedNid: 0,
    };
    this.sliderAction = null;
    this.sliderActionStatus = ACTION_DONE;
  }

  componentDidUpdate(prevProps) {
    const { activeTab } = this.props;
    if (activeTab !== prevProps.activeTab) {
      this.setState({ activeSlide: 0 });
      this.slider.slickGoTo(0);
    }
  }

  beforeChange = (oldIndex, newIndex) => {
    const { callback } = this.props;
    const { activeSlide } = this.state;
    const slider = _get(this, 'slider', null);
    const sliderProps = _get(this.slider, 'props', null);
    if (slider && sliderProps) {
      if (newIndex === 0 && oldIndex === 0 && activeSlide > 0) {
        callback(activeSlide - sliderProps.slidesToScroll, 'replace');
      }
      if (
        newIndex > 0
        && (sliderProps.children.length - newIndex - sliderProps.slidesToScroll) <= sliderProps.slidesToScroll
      ) {
        callback(sliderProps.children.length, 'append');
      }
    }

    if (oldIndex < newIndex) {
      this.setState(prevState => ({
        activeSlide: this.validateActiveSlide(
          prevState.activeSlide + this.slider.props.slidesToScroll,
        ),
      }));
    } else if (oldIndex > newIndex) {
      this.setState(prevState => ({
        activeSlide: this.validateActiveSlide(
          prevState.activeSlide - this.slider.props.slidesToScroll,
        ),
      }));
    }
  };

  validateActiveSlide(activeSlide) {
    const { count } = this.props;
    if (activeSlide < 0) return 0;
    if (activeSlide >= count) return count - 1;
    return activeSlide;
  }

  next() {
    const { count } = this.props;
    const { activeSlide } = this.state;

    if (activeSlide >= count - 1) {
      return;
    }

    this.slider.slickNext();
    this.sliderAction = SLIDER_NEXT;
  }

  previous() {
    const { activeSlide } = this.state;

    if (activeSlide <= 1) {
      return;
    }

    this.slider.slickPrev();
    this.sliderAction = SLIDER_PREV;
  }

  addToPlaylist = clipId => {
    this.setState({ modalOpened: true, selectedNid: clipId });
  };

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

  getImage = (entity, fields) => {
    for (let i = 0; i < fields.length; i++) {
      const img = _get(entity, fields[i]);
      if (typeof img !== 'undefined') {
        return img;
      }
    }
    return 'https://rockpeaksassets.s3.amazonaws.com/placeholders/clip-default-still-graphic.png';
  };

  render() {
    const { activeSlide } = this.state;
    const { entities, count, callback, type, theme, user } = this.props;
    const settings = {
      beforeChange: this.beforeChange,
      afterChange: this.afterChange,
      arrows: false,
      infinite: false,
      lazyLoad: true,
      speed: 500,
      slidesToShow: 7,
      slidesToScroll: 7,
      responsive: [
        {
          breakpoint: 1920,
          settings: {
            slidesToShow: 6,
            slidesToScroll: 6,
          },
        },
        {
          breakpoint: 1600,
          settings: {
            slidesToShow: 5,
            slidesToScroll: 5,
          },
        },
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 4,
          },
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
          },
        },
        {
          breakpoint: 576,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    };

    return (
      <div className="slick-carousel-wrap">
        <div className="input-range-wrap row no-gutters align-items-center mb-4">
          <div className="col">
            <InputRange
              maxValue={count}
              minValue={1}
              value={activeSlide + 1}
              onChange={value => {
                this.setState({ activeSlide: value - 1 });
              }}
              onChangeComplete={value => {
                callback(value - 1, 'replace');
                this.slider.slickGoTo(0);
              }}
            />
          </div>
          <div className="col-auto ml-4">
            <small className="clips-counter">
              {activeSlide + 1}
              <span className="text-muted">{`/${count}`}</span>
            </small>
          </div>
        </div>
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
          {...settings}
        >
          {entities.map(entity => {
            const placeholderUrl = '/static/images/clip-img-placeholder-alpha.svg';
            const imageUrl = this.getImage(entity, [
              'smartStillImage640x480.uri',
              'fieldStillImage.url',
              'legacyImage.url.path',
            ]);

            const nid = _get(entity, 'nid', null);
            const show = _get(entity, 'show.entity.entityLabel', null);
            const artist = _get(entity, 'artist.entity.entityLabel', null);
            const showNid = _get(entity, 'show.entity.nid', null);
            const artistNid = _get(entity, 'artist.entity.nid', null);
            const fieldDay = _get(entity, 'fieldDay', null);
            const fieldMonth = _get(entity, 'fieldMonth', null);
            const fieldYear = _get(entity, 'fieldYear', null);
            const clipTitle = _get(entity, 'clipTitle', null);
            const clipUrl = _get(
              entity,
              'entityUrl.path',
              getConcatenatedURI('video', nid),
            );
            const entityId = _get(entity, 'entityId', null);

            return (
              <div className="card-clip-slide" key={entityId}>
                <div className="thumb-container">
                  <Button
                    color="link"
                    className="btn-add-to-playlist"
                    onClick={e => {
                      e.stopPropagation();
                      this.addToPlaylist(nid);
                    }}
                  >
                    <Icon color="#b9c5d8" icon={ICONS.ADD_TO_PLAYLIST} />
                  </Button>
                  <a className="thumb" href={clipUrl}>
                    {/* onClick={handleClickLink('video', nid)} */}

                    <div className="image-wrapper">
                      <img
                        src={imageUrl}
                        alt={`${clipTitle} | ${artist} | ${show} | ${fieldYear}-${fieldMonth}-${fieldDay}`}
                        onError={e => {
                          e.target.onerror = null;
                          e.target.src = placeholderUrl;
                        }}
                      />
                    </div>
                  </a>
                </div>
                {/* <div
                  className="responsive-image-container"
                  onClick={handleClickLink('video', nid, artist, show, clipTitle)}
                >
                  <Button
                    color="link"
                    className="btn-add-to-playlist"
                    onClick={e => {
                      e.stopPropagation();
                      this.addToPlaylist(nid);
                    }}
                  >
                    <Icon color="#b9c5d8" icon={ICONS.ADD_TO_PLAYLIST} />
                  </Button>
                  <img
                    src={imageUrl}
                    alt={`${clipTitle} | ${artist} | ${show} | ${fieldYear}-${fieldMonth}-${fieldDay}`}
                    onError={e => {
                      e.target.onerror = null;
                      e.target.src = placeholderUrl;
                    }}
                  />
                </div> */}
                <div className="card-body">
                  <h5 className="card-title">
                    <Link href={clipUrl}>
                      <a>{summerize(clipTitle, 20)}</a>
                    </Link>
                  </h5>
                  <p className="card-text">
                    <Link
                      href={getConcatenatedURI('artists', artistNid, artist)}
                    >
                      <a>{decodeHtmlSpecialChars(artist)}</a>
                    </Link>
                  </p>
                  <p className="card-text">
                    <Link href={getConcatenatedURI('shows', showNid, show)}>
                      <a>{decodeHtmlSpecialChars(show)}</a>
                    </Link>
                  </p>
                  <p className="card-text">
                    <Link
                      href={`/browse/calendar?date=${getDateFromEntity(
                        { fieldYear, fieldMonth, fieldDay },
                        false,
                      )}`}
                    >
                      <a>
                        <Date
                          day={fieldDay}
                          month={fieldMonth}
                          year={fieldYear}
                        />
                      </a>
                    </Link>
                  </p>
                </div>
              </div>
            );
          })}
        </Slider>
        <AddToPlaylist
          isOpen={this.state.modalOpened}
          onToggle={this.handleToggleModal}
          clip={this.state.selectedNid}
          uid={user.user_id}
        />
      </div>
    );
  }
}

export default withRouter(withContext(SlickCarousel));
