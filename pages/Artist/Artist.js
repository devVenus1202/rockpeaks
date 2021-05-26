import React from 'react';
import { Router } from '@root/routes.esm';
import { ApolloConsumer } from 'react-apollo';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';

import App from '@components/App';
import ArtistDetailCheck from '@components/Artist';

import ErrorPage from 'next/error';

import './Artist.style.scss';

const GET_ARTIST_BY_NAME = gql`
  query getArtistByName($filter: EntityQueryFilterInput) {
    nodeQuery(
      offset: 0,
      limit: 1,
      filter: $filter
    ) {
      entities {
        ... on NodeArtist {
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

const GET_ARTIST_BY_ID = gql`
  query getArtistById($nid: String!) {
    nodeById(id: $nid) {      
      ... on NodeArtist {
        nid
        title
        entityUrl {
          path
        }
      }
    } 
  }
`;

class Artist extends React.Component {
  static propTypes = {
    url: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      nid: false,
      status: null,
    };
  }

  async componentDidMount() {
    const {
      url: {
        query: { nid, title },
      },
    } = this.props;

    const { client } = this.props;

    // Example: https://www.rockpeaks.com/artists/408679/joan-armatrading
    if (!isNaN(nid) && typeof title !== 'undefined') {
      this.setState({ nid });
    }

    // Example: https://www.rockpeaks.com/artists/408679
    if (!isNaN(nid) && typeof title === 'undefined') {
      try {
        var artist = await client.query({
          query: GET_ARTIST_BY_ID,
          variables: { nid },
        });

        if (artist.data.nodeById === null) {
          throw 'Error: not found';
        }

        const path = artist.data.nodeById.entityUrl.path.split('/');
        path.shift(); // Remove zero element.
        if (path.length >= 3) {
          const artist_path = path[2];
          Router.replaceRoute(`/artists/${nid}/${artist_path}`);
        }
        this.setState({ nid });
      } catch (e) {
        console.log(e);
        this.setState({ status: 404 });
      }
    }

    if (isNaN(nid)) {
      // If 1st parameter is just a title.
      // Example: https://www.rockpeaks.com/artists/Armatrading-Joan
      let artist_name = nid.split('-');

      // If 1st parameter is letter, like 'a'..'z' or a 'misc' string.
      // Example: https://www.rockpeaks.com/artists/a/Armatrading-Joan
      // Example: https://www.rockpeaks.com/artists/misc/30-Seconds-to-Mars
      if (typeof title !== 'undefined') {
        artist_name = title.split('-');
      }

      try {
        const artist_name_origin = artist_name.join(' ');
        const conditions = [];
        conditions.push({
          field:  'title',
          value: artist_name_origin,
          operator: 'EQUAL',
        });
        conditions.push({
          field:  'name_sort_order',
          value: artist_name_origin,
          operator: 'EQUAL',
        });
        conditions.push({
          field:  'artist_aliases',
          value: artist_name_origin,
          operator: 'EQUAL',
        });

        // Most likely this is the name of the artist, not the name of the band.
        // So, let's try to change words order.
        // Example: `Armatrading Joan` -> `Joan Armatrading`
        if (artist_name.length === 2) {
          const artist_name_flipped = `${artist_name[1]} ${artist_name[0]}`;
          conditions.push({
            field:  'title',
            value: artist_name_flipped,
            operator: 'EQUAL',
          });
          conditions.push({
            field:  'name_sort_order',
            value: artist_name_flipped,
            operator: 'EQUAL',
          });
          conditions.push({
            field:  'artist_aliases',
            value: artist_name_flipped,
            operator: 'EQUAL',
          });

          // Let's add the MusicBrainz name, that usually used as sort name.
          // Example: `Armatrading Joan` -> `Armatrading, Joan`
          const artist_name_mb = `${artist_name[0]}, ${artist_name[1]}`;
          conditions.push({
            field:  'name_sort_order',
            value: artist_name_mb,
            operator: 'EQUAL',
          });
          conditions.push({
            field:  'artist_aliases',
            value: artist_name_mb,
            operator: 'EQUAL',
          });
        }

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
                  value: 'artist',
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

        var artist = await client.query({
          query: GET_ARTIST_BY_NAME,
          variables: { filter },
        });

        if (artist.data.nodeQuery.entities.length === 0) {
          throw 'Error: not found';
        }

        const entity_nid = artist.data.nodeQuery.entities[0].nid;
        const path = artist.data.nodeQuery.entities[0].entityUrl.path.split('/');
        path.shift(); // Remove zero element.
        if (path.length >= 3) {
          const artist_path = path[2];
          Router.replaceRoute(`/artists/${entity_nid}/${artist_path}`);
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
            <App pageClass="page-artist" page="browse">
              <ArtistDetailCheck nidLoaded={nid} />
            </App>
          </div>
        )}
      </ApolloConsumer>
    );
  }
}

export default withApollo(Artist);
