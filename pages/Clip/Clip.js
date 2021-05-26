import React from 'react';
import { Router } from '@root/routes.esm';
import { ApolloConsumer, withApollo } from 'react-apollo';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import App from '@components/App';
import ClipPanel from '@components/ClipPanel';

import './Clip.style.scss';

const GET_CLIP_BY_ID = gql`
  query getClipById($nid: String!) {
    nodeById(id: $nid) {      
      ... on NodeClip {
        nid
        title
        entityUrl {
          path
        }
      }
    } 
  }
`;

const GET_CLIP_BY_ARGS = gql`
  query getClipByArgs($filter: EntityQueryFilterInput) {
    nodeQuery(
      offset: 0,
      limit: 1,
      filter: $filter
    ) {
      entities {
        ... on NodeClip {
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

class Clip extends React.Component {
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
        query: { nid, artist, show, clipTitle },
      },
    } = this.props;

    const { client } = this.props;

    const args = [artist, show, clipTitle].filter(arg => {
      return typeof arg !== 'undefined';
    });

    // If all argument are presents.
    // Example: https://react-dev.rockpeaks.com/video/467284/bauhaus/hammerstein-ballroom/a-god-in-an-alcove
    if (!isNaN(nid) && args.length === 3) {
      this.setState({ nid });
    }

    // If any argument is missed.
    // Example: https://react-dev.rockpeaks.com/video/467284
    if (!isNaN(nid) && args.length < 3) {
      try {
        var clip = await client.query({
          query: GET_CLIP_BY_ID,
          variables: { nid },
        });

        if (clip.data.nodeById === null) {
          throw 'Error: not found';
        }

        const path = clip.data.nodeById.entityUrl.path.split('/');
        path.shift(); // Remove zero element.
        if (path.length >= 5) {
          const artist_path = path[2];
          const show_path = path[3];
          const clip_title_path = path[4];
          Router.replaceRoute(`/video/${nid}/${artist_path}/${show_path}/${clip_title_path}`);
        }
        this.setState({ nid });
      } catch (e) {
        console.log(e);
        this.setState({ status: 404 });
      }
    }

    // If 'nid' is letter or a string.
    if (isNaN(nid)) {
      try {
        // Example: https://www.rockpeaks.com/video/a/Armatrading-Joan/Later-with-Jools-Holland-2007/A-Woman-in-Love
        if (args.length === 3) {
          let artist_name = args[0].toLowerCase().replace(/-/ig, ' ').trim();
          let show_name = args[1];
          const clip_title = args[2].toLowerCase().replace(/-/ig, ' ').trim();

          const conditions = [];
          const or_conditions = [];
          const show_conditions = [];
          conditions.push({
            field: 'status',
            value: '1',
            operator: 'EQUAL',
          });
          conditions.push({
            field: 'type',
            value: 'clip',
            operator: 'EQUAL',
          });
          conditions.push({
            field:  'clip_title',
            value: clip_title,
            operator: 'EQUAL',
          });

          // Try to get year.
          if (/([a-zA-Z0-9- ]+)-([\d]{4})-([\d]{4})/.test(show_name)) {
            const regexp_result = /([a-zA-Z0-9- ]+)-([\d]{4})-([\d]{4})/ig.exec(show_name);
            const year = regexp_result[3];
            show_name = [regexp_result[1], regexp_result[2]].join(' ');
            conditions.push({
              field:  'field_year',
              value: year,
              operator: 'EQUAL',
            });
          }

          if (/([a-zA-Z0-9- ]+)-([\d]{4})/.test(show_name)) {
            const regexp_result = /([a-zA-Z0-9- ]+)-([\d]{4})/ig.exec(show_name);
            const year = regexp_result[2];
            show_name = regexp_result[1];
            conditions.push({
              field:  'field_year',
              value: year,
              operator: 'EQUAL',
            });
          }

          show_name = show_name.toLowerCase().replace(/-/ig, ' ').trim();
          show_conditions.push({
            field:  'show.entity.title',
            value: show_name,
            operator: 'EQUAL',
          });
          show_conditions.push({
            field:  'show.entity.show_alias',
            value: show_name,
            operator: 'EQUAL',
          });

          // Different variations of Artist name.
          or_conditions.push({
            field:  'artist.entity.title',
            value: artist_name,
            operator: 'EQUAL',
          });
          or_conditions.push({
            field:  'artist.entity.name_sort_order',
            value: artist_name,
            operator: 'EQUAL',
          });
          or_conditions.push({
            field:  'artist.entity.artist_aliases',
            value: artist_name,
            operator: 'EQUAL',
          });
          // Most likely this is the name of the artist, not the name of the band.
          // So, let's try to change words order.
          // Example: `Armatrading Joan` -> `Joan Armatrading`
          artist_name = artist_name.split(' ');
          if (artist_name.length === 2) {
            const artist_name_flipped = `${artist_name[1]} ${artist_name[0]}`;
            or_conditions.push({
              field:  'artist.entity.title',
              value: artist_name_flipped,
              operator: 'EQUAL',
            });
            or_conditions.push({
              field:  'artist.entity.name_sort_order',
              value: artist_name_flipped,
              operator: 'EQUAL',
            });
            or_conditions.push({
              field:  'artist.entity.artist_aliases',
              value: artist_name_flipped,
              operator: 'EQUAL',
            });

            // Let's add the MusicBrainz name, that usually used as sort name.
            // Example: `Armatrading Joan` -> `Armatrading, Joan`
            const artist_name_mb = `${artist_name[0]}, ${artist_name[1]}`;
            or_conditions.push({
              field:  'artist.entity.name_sort_order',
              value: artist_name_mb,
              operator: 'EQUAL',
            });
            or_conditions.push({
              field:  'artist.entity.artist_aliases',
              value: artist_name_mb,
              operator: 'EQUAL',
            });
          }

          const filter = {
            conjunction: 'AND',
            groups: [
              {
                conditions,
              },
              {
                conjunction: 'OR',
                conditions: or_conditions,
              },
              {
                conjunction: 'OR',
                conditions: show_conditions,
              },
            ],
          };

          var clip = await client.query({
            query: GET_CLIP_BY_ARGS,
            variables: { filter },
          });

          if (clip.data.nodeQuery.entities.length === 0) {
            throw 'Error: not found';
          }

          const entity_nid = clip.data.nodeQuery.entities[0].nid;
          const path = clip.data.nodeQuery.entities[0].entityUrl.path.split('/');
          path.shift(); // Remove zero element.
          if (path.length >= 5) {
            const artist_path = path[2];
            const show_path = path[3];
            const clip_title_path = path[4];
            Router.replaceRoute(`/video/${entity_nid}/${artist_path}/${show_path}/${clip_title_path}`);
          }
          this.setState({ nid: entity_nid });
        } else {
          throw 'Error: some arguments are missed';
        }
      } catch (e) {
        console.log(e);
        this.setState({ status: 404 });
      }
    }
  }

  render() {
    const { nid } = this.state;

    return (
      <ApolloConsumer>
        {() => (
          <div>
            <App pageClass="page-clip" page="browse">
              <ClipPanel nidLoaded={nid} />
            </App>
          </div>
        )}
      </ApolloConsumer>
    );
  }
}

export default withApollo(Clip);
