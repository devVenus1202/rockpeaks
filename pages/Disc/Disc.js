import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Router } from '@root/routes.esm';
import { ApolloConsumer } from 'react-apollo';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';

import App from '@components/App';
import DiscDetailCheck from '@components/Disc';

import ErrorPage from 'next/error';

import './Disc.style.scss';

const GET_DISC_BY_ROUTE = gql`
  query matchRoute($path: String!) {
    matchRoute(path: $path) {
      path
      ...on EntityCanonicalUrl {
        entity {
          entityType
          entityBundle
          ...on NodeDisc {
            nid
            title
          }
        }
      }
    }
  }
`;

const GET_DISC_BY_ID = gql`
  query getDiscById($nid: String!) {
    nodeById(id: $nid) {      
      ... on NodeDisc {
        nid
        title
        entityUrl {
          path
        }
      }
    } 
  }
`;

class Disc extends Component {
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

    // Example: https://www.rockpeaks.com/discs/410014/30-seconds-to-mars-live-in-malayisia-2011
    if (!isNaN(nid) && typeof title !== 'undefined') {
      this.setState({ nid });
    }

    // Example: https://react-dev.rockpeaks.com/discs/410014
    if (!isNaN(nid) && typeof title === 'undefined') {
      try {
        const show = await client.query({
          query: GET_DISC_BY_ID,
          variables: { nid },
        });

        if (show.data.nodeById === null) {
          throw 'Error: not found';
        }

        const path = show.data.nodeById.entityUrl.path.split('/');
        path.shift(); // Remove zero element.
        if (path.length >= 3) {
          const show_path = path[2];
          Router.replaceRoute(`/discs/${nid}/${show_path}`);
        }
        this.setState({ nid });
      } catch (e) {
        console.log(e);
        this.setState({ status: 404 });
      }
    }

    if (isNaN(nid)) {
      // If 1st parameter is just a title.
      // Example: https://www.rockpeaks.com/discs/30-Seconds-to-Mars-Live-in-Malayisia-2011-DVD
      const disc_route = nid.toLowerCase().split('-');
      try {
        const disc_route_params = disc_route.filter(param => {
          if (param == 'dvd') return false;
          if (param == 0) return false;
          return true;
        });
        const route = disc_route_params.join('-');
        const disc = await client.query({
          query: GET_DISC_BY_ROUTE,
          variables: { path: route },
        });

        if (disc.data.matchRoute === null) {
          throw 'Error: not found';
        }

        const entity_type = disc.data.matchRoute.entity.entityBundle;
        if (entity_type !== 'disc') {
          throw 'Error: not found';
        }

        const path = disc.data.matchRoute.path.split('/');
        const entity_nid = disc.data.matchRoute.entity.nid;
        path.shift(); // Remove zero element.
        if (path.length >= 3) {
          const disc_path = path[2];
          Router.replaceRoute(`/discs/${entity_nid}/${disc_path}`);
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
            <App pageClass="page-disk" page="browse">
              <DiscDetailCheck nidLoaded={nid} />
            </App>
          </div>
        )}
      </ApolloConsumer>
    );
  }
}

export default withApollo(Disc);
