import React from 'react';
import { Router } from '@root/routes.esm';
import { ApolloConsumer } from 'react-apollo';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';

import App from '@components/App';
import ShowDetailCheck from '@components/Show';

import ErrorPage from 'next/error';

import './Show.style.scss';

const GET_SHOW_BY_NAME = gql`
  query getShowByName($filter: EntityQueryFilterInput) {
    nodeQuery(
      offset: 0,
      limit: 1,
      filter: $filter
    ) {
      entities {
        ... on NodeShow {
          nid
          title
          entityUrl {
            path
          }
        }
      }
    }
  }
`;

const GET_SHOW_BY_ID = gql`
  query getShowById($nid: String!) {
    nodeById(id: $nid) {      
      ... on NodeShow {
        nid
        title
        entityUrl {
          path
        }
      }
    } 
  }
`;

class Show extends React.Component {
  static propTypes = {
    url: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      nid: false,
    };
  }

  async componentDidMount() {
    const {
      url: {
        query: { nid, title },
      },
    } = this.props;

    const { client } = this.props;

    // Example: https://react-dev.rockpeaks.com/shows/403973/rockpalast
    if (!isNaN(nid) && typeof title !== 'undefined') {
      this.setState({ nid });
    }

    // Example: https://react-dev.rockpeaks.com/shows/403973
    if (!isNaN(nid) && typeof title === 'undefined') {
      try {
        var show = await client.query({
          query: GET_SHOW_BY_ID,
          variables: { nid },
        });

        if (show.data.nodeById === null) {
          throw 'Error: not found';
        }

        const path = show.data.nodeById.entityUrl.path.split('/');
        path.shift(); // Remove zero element.
        if (path.length >= 3) {
          const show_path = path[2];
          Router.replaceRoute(`/shows/${nid}/${show_path}`);
        }
        this.setState({ nid });
      } catch (e) {
        console.log(e);
        this.setState({ status: 404 });
      }
    }

    if (isNaN(nid)) {
      // If 1st parameter is just a title.
      // Example: https://www.rockpeaks.com/shows/Rockpalast
      let show_name = nid.split('-');

      // If 1st parameter is letter, like 'a'..'z' or a 'misc' string.
      // Example: https://www.rockpeaks.com/shows/r/Rockpalast
      // Example: https://www.rockpeaks.com/shows/misc/120-Minutes
      if (typeof title !== 'undefined') {
        show_name = title.split('-');
      }

      try {
        const show_name_origin = show_name.join(' ');
        const conditions = [];
        conditions.push({
          field:  'title',
          value: show_name_origin,
          operator: 'EQUAL',
        });
        conditions.push({
          field:  'show_alias',
          value: show_name_origin,
          operator: 'EQUAL',
        });

        const filter = {
          conjunction: 'AND',
          groups: [
            {
              conditions: [
                {
                  field: 'status',
                  value: '1',
                  operator: 'EQUAL',
                },
                {
                  field: 'type',
                  value: 'show',
                  operator: 'EQUAL',
                },
              ],
            },
            {
              conjunction: 'OR',
              conditions,
            },
          ],
        };

        var show = await client.query({
          query: GET_SHOW_BY_NAME,
          variables: { filter },
        });

        if (show.data.nodeQuery.entities.length === 0) {
          throw 'Error: not found';
        }

        const entity_nid = show.data.nodeQuery.entities[0].nid;
        const path = show.data.nodeQuery.entities[0].entityUrl.path.split('/');
        path.shift(); // Remove zero element.
        if (path.length >= 3) {
          const show_path = path[2];
          Router.replaceRoute(`/shows/${entity_nid}/${show_path}`);
        }
        this.setState({ nid: entity_nid });
      } catch (e) {
        console.log(e);
        this.setState({ status: 404 });
      }
    }
  }

  render() {
    const { nid, status } = this.state;
    if (status) {
      return <ErrorPage statusCode={status} />;
    }
    return (
      <ApolloConsumer>
        {() => (
          <div>
            <App pageClass="page-show" page="browse">
              <ShowDetailCheck nidLoaded={nid} />
            </App>
          </div>
        )}
      </ApolloConsumer>
    );
  }
}

export default withApollo(Show);
