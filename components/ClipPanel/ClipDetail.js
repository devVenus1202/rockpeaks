import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { get as _get } from 'lodash/object';
import GET_CLIP_DETAIL from '@graphql/clip/ClipDetail.graphql';
import ClipBody from '@components/ClipBody';
import ErrorMessage from '@lib/ErrorMessage';
import { AppConsumer } from '@components/AppContext';

import SecondaryNav from '../SecondaryNav';
import Carousel from '../Carousel';

import { CarouselLoader, PageContentLoader } from '../Loader';

class ClipDetail extends Component {
  static propTypes = {
    nid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  };

  render() {
    const { nid } = this.props;

    return (
      <AppConsumer>
        {status => {
          const { authentication, theme = 'dark', user } = status;

          return (
            <Query query={GET_CLIP_DETAIL} variables={{ nid }}>
              {({ loading, error, data }) => {
                if (loading) {
                  return (
                    <div className="pl-4 pr-4">
                      <div style={{ maxWidth: '600px', marginBottom: '100px' }}>
                        <PageContentLoader />
                      </div>
                      <div style={{ maxWidth: '768px', marginBottom: '4em' }}>
                        <CarouselLoader />
                      </div>
                    </div>
                  );
                }
                if (error) return <ErrorMessage message={`Error! ${error.message}`} />;

                const {
                  nodeById,
                  getPlexAccount,
                  nodeQuery: clipReviews,
                } = data;

                // const nid = _get(nodeById, 'nid', null);
                const nodeTitle = _get(nodeById, 'title', null);
                const targetId = _get(nodeById, 'type', null);
                const clipArtist = _get(nodeById, 'artist.entity.title', null);
                const clipArtistNid = _get(nodeById, 'artist.entity.nid', null);
                const clipShowNid = _get(nodeById, 'show.entity.nid', null);

                let background = 'none';
                const backgroundImage = _get(
                  nodeById,
                  'smartStillImage1280x720.uri',
                );

                if (typeof backgroundImage !== 'undefined') {
                  background = `url(${backgroundImage})`;
                }

                if (targetId) {
                  return (
                    <section className="page-clip-section">
                      <style jsx>
                        {`
                          .page-clip-section {
                            background-image: ${background};
                            background-size: cover;
                            background-color: #000;
                          }
                        `}
                      </style>
                      <div className="page-clip-blink">
                        <SecondaryNav
                          type="clip"
                          brand={clipArtist}
                          nid={nid}
                          artistNid={clipArtistNid}
                          showNid={clipShowNid}
                          subNid={clipArtistNid}
                          theme={theme}
                          data={nodeById}
                          reviews={clipReviews}
                        />
                        <div className="pt-3rem">
                          <div className="container">
                            <ClipBody
                              data={nodeById}
                              plexAccount={getPlexAccount}
                            />
                          </div>
                        </div>
                        <div className="pt-3rem">
                          <div className="container">
                            <Carousel
                              type="artist"
                              nid={clipArtistNid}
                              title={clipArtist}
                            />
                          </div>
                        </div>
                      </div>
                    </section>
                  );
                }
                return <ErrorMessage message="Clip not found" />;
              }}
            </Query>
          );
        }}
      </AppConsumer>
    );
  }
}

export default ClipDetail;
