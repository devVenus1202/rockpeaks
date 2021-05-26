import React from 'react';
import { Query } from 'react-apollo';
import classnames from 'classnames';
import {
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import PropTypes from 'prop-types';
import ErrorMessage from '@lib/ErrorMessage';

import GET_CLIPS_BY_ARTIST_AVAILABILITY from '@graphql/carousel/ClipCarouselArtistAvailability.graphql';
import GET_CLIPS_BY_CLIP_AVAILABILITY from '@graphql/carousel/ClipCarouselClipAvailability.graphql';
import GET_CLIPS_BY_SHOW_AVAILABILITY from '@graphql/carousel/ClipCarouselShowAvailability.graphql';


const tabsCarouselQueries = {
  artist: GET_CLIPS_BY_ARTIST_AVAILABILITY,
  clip: GET_CLIPS_BY_CLIP_AVAILABILITY,
  show: GET_CLIPS_BY_SHOW_AVAILABILITY,
};


const TabsCarousel = ({ type, nid, activeTab, toggleTab }) => {
  return (
    <Query
      partialRefetch
      fetchPolicy="cache-and-network"
      query={tabsCarouselQueries[type]}
      variables={{
        nid,
      }}
    >
      {({ error, data }) => {
        if (error) return <ErrorMessage message={`Error! ${error.message}`} />;
        if (data && data.all) {
          const {
            all: {
              reverse: {
                count: countAll = 0,
              },
            },
            livePerformance: {
              reverse: {
                count: countLive = 0,
              },
            },
            promoVideos: {
              reverse: {
                count: countPromo = 0,
              },
            },
            interviewsDocs: {
              reverse: {
                count: countInterviews = 0,
              },
            },
          } = data;
          return (
            <Nav tabs className="mb-4">
              <NavItem>
                <NavLink
                  disabled={countAll === 0}
                  className={classnames({ active: activeTab === 'all' })}
                  onClick={() => { toggleTab('all'); }}
                >
                  ALL CLIPS
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  disabled={countAll === 0}
                  className={classnames({ active: activeTab === 'top-rated' })}
                  onClick={() => { toggleTab('top-rated'); }}
                >
                  TOP rated
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  disabled={countAll === 0}
                  className={classnames({ active: activeTab === 'latest-additions' })}
                  onClick={() => { toggleTab('latest-additions'); }}
                >
                  LATEST additions
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  disabled={countLive === 0}
                  className={classnames({ active: activeTab === 'live-performances' })}
                  onClick={() => { toggleTab('live-performances'); }}
                >
                  LIVE performances
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  disabled={countPromo === 0}
                  className={classnames({ active: activeTab === 'promo-videos' })}
                  onClick={() => { toggleTab('promo-videos'); }}
                >
                  PROMO videos
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  disabled={countInterviews === 0}
                  className={classnames({ active: activeTab === 'interviews-docs' })}
                  onClick={() => { toggleTab('interviews-docs'); }}
                >
                  INTERVIEWS &amp; docs
                </NavLink>
              </NavItem>
            </Nav>
          );
        }
        return <div />;
      }
      }
    </Query>
  );
};

export default TabsCarousel;

TabsCarousel.propTypes = {
  nid: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  activeTab: PropTypes.string.isRequired,
  toggleTab: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};
