import React from 'react';
import PropTypes from 'prop-types';
import ErrorMessage from '@lib/ErrorMessage';
import { Query }  from 'react-apollo';
import GET_STATIC_PAGE_CONTENT from '@graphql/staticPage/StaticPageContent.graphql';
import _ from 'lodash';
import { PageContentLoader } from '@components/Loader';

const StaticPage = (
  {
    title,
  }) => {
  return (
    <Query query={GET_STATIC_PAGE_CONTENT} variables={{ title }}>
      {({ loading, error, data }) => {
        if (loading) {
          return (
            <div className="pl-4 pr-4">
              <div style={{ maxWidth: '600px', marginBottom: '100px' }}>
                <PageContentLoader />
              </div>
            </div>
          );
        }
        if (error) return <ErrorMessage message={`Error! ${error.message}`} />;

        const {
          staticPageContent: {
            entities,
          },
        } = data;

        const body = _.get(entities, '[0].body.processed', '');

        if (body) {
          return (
            <div dangerouslySetInnerHTML={{ __html: body }} />
          );
        }

        return <ErrorMessage message="Error loading content" />;
      }}
    </Query>
  );
};

StaticPage.propTypes = {
  title: PropTypes.string.isRequired,
};

export default StaticPage;
