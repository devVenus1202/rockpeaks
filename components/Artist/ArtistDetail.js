import React, { Component } from 'react';
import ErrorPage from 'next/error';
import PropTypes from 'prop-types';
import { Query, withApollo } from 'react-apollo';
import _ from 'lodash';
import FuzzySet from 'fuzzyset.js';

import GET_ARTIST_DETAIL from '@graphql/artist/ArtistDetails.graphql';

import ErrorMessage from '@lib/ErrorMessage';
import { Router } from '@root/routes.esm';
import SecondaryNav from '../SecondaryNav';
import Carousel from '../Carousel';
import BodySummary from '../BodySummary';

import { CarouselLoader, PageContentLoader } from '../Loader';
import { AppConsumer } from '../AppContext';

const FANART_API = 'https://webservice.fanart.tv/v3/music/';
const API_KEY = 'e0c3b642f8e90b1baa8e5eedce9a70aa';

class ArtistDetail extends Component {
  static propTypes = {
    nid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      backgroundUrlPath: '',
    };
  }

  getArtistBg = data => {
    const { nodeById } = data;
    const artistBackgroundImage = _.get(
      nodeById,
      'artistBackgroundImage.url',
      null,
    );
    const legacyPublicityImage = _.get(
      nodeById,
      'legacyPublicityImage.url.path',
      null,
    );
    const musicbrainzId = _.get(nodeById, 'artistMusicbrainzId', null);
    if (artistBackgroundImage) this.setState({ artistBackgroundImage });
    else if (musicbrainzId) {
      fetch(`${FANART_API}${musicbrainzId}?api_key=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
          const backgroundFanartTv = _.get(
            data,
            'artistbackground.[0].url',
            null,
          );
          if (backgroundFanartTv) this.setState({ backgroundUrlPath: backgroundFanartTv });
        });
    } else this.setState({ legacyPublicityImage });
  };

  render() {
    const { nid } = this.props;

    const { backgroundUrlPath } = this.state;

    return (
      <AppConsumer>
        {status => {
          const {
            authentication,
            theme = 'dark',
            user,
            screenPercentage: storedScreenPercentage,
          } = status;
          return (
            <Query
              query={GET_ARTIST_DETAIL}
              variables={{ nid }}
              onCompleted={data => {
                console.log('onCompleted', data);
                this.getArtistBg(data);
              }}
            >
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
                  nodeById: {
                    nid,
                    title,
                    type: { targetId },
                  },
                } = data;

                const queryTitle = _.get(Router.query, 'title', false);
                const normalizedTitle = _.toLower(title)
                  .replace(/[^0-9a-z-]/g, '-')
                  .replace(/-+/g, '-');

                let titleMatched = [];

                if (queryTitle) {
                  const check = FuzzySet();
                  check.add(normalizedTitle);
                  titleMatched = check.get(queryTitle, false, 0.4);
                }
                if (titleMatched.length > 0 && titleMatched[0][0] < 1) {
                  Router.replaceRoute(`/artists/${nid}/${normalizedTitle}`);
                }

                const bodyValue =                  _.get(nodeById, 'body.processed', null)
                  || _.get(nodeById, 'artistWikipediaBody.processed', null);
                const bodySummary = _.get(nodeById, 'body.bodySummary', null);

                const screenPercentage = _.get(nodeById, 'screenPercentage', 0);
                if (storedScreenPercentage) {
                  nodeById.screenPercentage = storedScreenPercentage;
                }
                if (targetId === 'artist' && titleMatched) {
                  return (
                    <section className="page-artist-section">
                      <style jsx>
                        {`
                          .background-mask {
                            background-image: url(${backgroundUrlPath});
                            opacity: ${(storedScreenPercentage
                              || screenPercentage) / 100};
                          }
                        `}
                      </style>
                      <div className="page-artist-blink">
                        <div className="background-mask" />
                        <SecondaryNav
                          type="artist"
                          brand={title}
                          nid={nid}
                          subNid={nid}
                          artistNid={nid}
                          theme={theme}
                          data={data.nodeById}
                        />
                        <div className="container">
                          <div className="narrow-container">
                            <article className="pt-3rem">
                              <h1 className="page-title mb-4rem">{title}</h1>
                              <BodySummary
                                bodySummary={bodySummary}
                                bodyValue={bodyValue}
                                trimLength="300"
                              />
                            </article>
                          </div>
                        </div>

                        <div className="pt-3rem">
                          <div className="container">
                            <Carousel type="artist" nid={nid} title={title} />
                          </div>
                        </div>
                      </div>
                    </section>
                  );
                }
                return <ErrorPage statusCode="404" />;
              }}
            </Query>
          );
        }}
      </AppConsumer>
    );
  }
}

export default withApollo(ArtistDetail);
