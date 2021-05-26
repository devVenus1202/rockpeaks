import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ErrorMessage from '@lib/ErrorMessage';
import { Query } from 'react-apollo';
import GET_TOUR_CONTENT from '@graphql/dialogs/tour/ModalContent.graphql';
import _ from 'lodash';
import { PageContentLoader } from '../../Loader';

const TourData = ({ title, activePage, setCountParent }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCountParent(count);
  }, [count]);

  return (
    <Query query={GET_TOUR_CONTENT} variables={{ title }}>
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
          modalContent: { entities },
        } = data;

        const bodies = _.get(entities, '[0].multiBody', []);
        const bodyValue = _.get(entities, `[0].multiBody.[${activePage}].processed`, null);

        setCount(bodies.length);

        if (count > 0 && bodyValue) {
          return <div dangerouslySetInnerHTML={{ __html: bodyValue }} />;
        }

        return <ErrorMessage message="Error loading content" />;
      }}
    </Query>
  );
};

TourData.propTypes = {
  activePage: PropTypes.number.isRequired,
  setCountParent: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default TourData;
