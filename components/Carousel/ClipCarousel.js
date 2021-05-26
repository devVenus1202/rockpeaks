import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import React from 'react';
import { get as _get } from 'lodash/object';

import QueryFilter from '@helpers/QueryFilter';
import GET_CLIPS_BY_ARTIST from '@graphql/carousel/ClipCarouselArtist.graphql';
import GET_CLIPS_BY_CLIP from '@graphql/carousel/ClipCarouselClip.graphql';
import GET_CLIPS_BY_SHOW from '@graphql/carousel/ClipCarouselShow.graphql';
import ErrorMessage from '@lib/ErrorMessage';
import SlickCarousel from './SlickCarousel';
import { CarouselLoader } from '../Loader';

const clipCarouselQueries = {
  artist: GET_CLIPS_BY_ARTIST,
  clip: GET_CLIPS_BY_CLIP,
  show: GET_CLIPS_BY_SHOW,
};

const ClipCarousel = ({
  type,
  nid,
  filter,
  sort,
  offset = 0,
  limit = 24,
  activeTab,
}) => {
  return (
    <Query
      fetchPolicy="cache-and-network"
      query={clipCarouselQueries[type]}
      variables={{
        nid,
        filter,
        sort,
        offset,
        limit,
      }}
    >
      {({ loading, error, data, fetchMore }) => {
        if (loading && !_get(data, 'nodeById', false)) {
          return (
            <div className="pl-4 pr-4">
              <div style={{ maxWidth: '768px', marginBottom: '4em' }}>
                <CarouselLoader />
              </div>
            </div>
          );
        }
        if (error) return <ErrorMessage message={`Error! ${error.message}`} />;

        if (data && _get(data, 'nodeById', false)) {
          const {
            nodeById: {
              reverse: { count, entities },
            },
          } = data;
          if (count === 0) {
            return (
              <div className="pb-4">
                <em>{`No ${activeTab} found`}</em>
              </div>
            );
          }
          return (
            <div className="position-relative">
              <SlickCarousel
                callback={(offset, operation = 'append') => {
                  fetchMore({
                    variables: {
                      offset,
                    },
                    updateQuery: (prev, { fetchMoreResult }) => {
                      if (!fetchMoreResult) return prev;
                      if (operation === 'append') {
                        const next = { ...prev };
                        next.nodeById.reverse.entities = [
                          ...prev.nodeById.reverse.entities,
                          ...fetchMoreResult.nodeById.reverse.entities,
                        ];
                        return next;
                      }
                      return fetchMoreResult;
                    },
                  });
                }}
                offset={offset}
                limit={limit}
                count={count}
                entities={entities}
                type={type}
                activeTab={activeTab}
              />
            </div>
          );
        }
        return (
          <p>
            <em>No clips found</em>
          </p>
        );
      }}
    </Query>
  );
};

ClipCarousel.propTypes = {
  nid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  filter: PropTypes.object,
  sort: PropTypes.oneOfType([PropTypes.array]),
  offset: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  limit: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  activeTab: PropTypes.string,
  type: PropTypes.string.isRequired,
};

ClipCarousel.defaultProps = {
  filter: null,
  offset: 0,
  limit: 24,
  activeTab: 'all',
  sort: [
    {
      field: 'created',
      direction: 'DESC',
    },
  ],
};

export default ClipCarousel;
