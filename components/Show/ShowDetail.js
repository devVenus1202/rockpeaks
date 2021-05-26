import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { get as _get } from 'lodash/object';
import GET_SHOW_DETAIL from '@graphql/show/ShowDetails.graphql';
import ErrorMessage from '@lib/ErrorMessage';
import ErrorPage from 'next/error';
import FuzzySet from 'fuzzyset.js';
import _ from 'lodash';
import { Router } from '@root/routes.esm';
import { AppConsumer } from '@components/AppContext';
import SecondaryNav from '../SecondaryNav';
import Carousel from '../Carousel';
import BodySummary from '../BodySummary';

import { CarouselLoader, PageContentLoader } from '../Loader';

class ShowDetail extends Component {
  static propTypes = {
    nid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  };

  render() {
    const { nid } = this.props;

    return (
      <AppConsumer>
        {status => {
          const {
            authentication,
            theme = 'dark',
            user,
            screenPercentage: storedPercentage,
          } = status;
          return (
            <Query query={GET_SHOW_DETAIL} variables={{ nid }}>
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
                    screenPercentage,
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
                  Router.replaceRoute(`/shows/${nid}/${normalizedTitle}`);
                }

                const bodyValue = _get(nodeById, 'body.processed', null);
                const bodySummary = _get(nodeById, 'body.', null);

                const contentBG =                  _get(nodeById, 'legacyImage.uri', null)
                  || _get(nodeById, 'showBackgroundImage.url', null)
                  || _get(nodeById, 'legacyBackgroundImage.url.path', null);

                if (storedPercentage) {
                  nodeById.screenPercentage = storedPercentage;
                }

                if (targetId === 'show' && titleMatched) {
                  return (
                    <section className="page-show-section">
                      <style jsx>
                        {`
                          .background-mask {
                            background-image: url(${contentBG});
                            opacity: ${(storedPercentage || screenPercentage)
                              / 100};
                          }
                        `}
                      </style>
                      <div className="page-show-blink">
                        <div className="background-mask" />
                        <SecondaryNav
                          theme={theme}
                          type="show"
                          brand={title}
                          nid={nid}
                          subNid={nid}
                          data={nodeById}
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
                            <Carousel type="show" nid={nid} title={title} />
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

export default ShowDetail;
