import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Spinner } from 'reactstrap';
import { get } from 'lodash';

import './PlaylistContainer.scss';

// import GetClips from '@graphql/playlist/GetClips.graphql';
import GetSubscriptionsRequest from '@graphql/playlist/GetUserSubscriptions.graphql';
import GetAllPlaylist from '@graphql/playlist/GetAllPlaylist.graphql';
import UpdatePlaylist from '@graphql/playlist/UpdatePlaylist.graphql';
import AddToDefaultPlaylist from '@graphql/playlist/AddToDefaultPlaylist.graphql';
import GetPlaylists from '@graphql/playlist/GetPlaylists.graphql';
import RemoveFromFavourite from '@graphql/playlist/RemoveFavouritePlaylist.graphql';
import RemoveFromWatch from '@graphql/playlist/RemoveWatchPlaylist.graphql';
import RemoveFromHistory from '@graphql/playlist/RemoveHistoryPlaylist.graphql';

import { withApollo, Query } from 'react-apollo';

class PlaylistContainer extends Component {
  static propTypes = {
    playlists: PropTypes.object.isRequired,
    clip: PropTypes.string.isRequired,
    client: PropTypes.object.isRequired,
    uid: PropTypes.string.isRequired,
  };

  state = {
    playlist: '',
    status: '',
    playlists: [],
    newPlaylists: [],
    deletedPlaylists: [],
    historyClips: [],
    watchClips: [],
    favouriteClips: [],
  };

  UNSAFE_componentWillReceiveProps(props) {
    const {
      playlists,
      watchPlaylist,
      historyPlaylist,
      favouritesPlaylist,
    } = props;
    const historyClips = this.convertToArray(
      get(historyPlaylist, 'entities', []),
    );
    const watchClips = this.convertToArray(get(watchPlaylist, 'entities', []));
    const favouriteClips = this.convertToArray(
      get(favouritesPlaylist, 'entities', []),
    );
    this.setState({
      playlists,
      historyClips,
      watchClips,
      favouriteClips,
    });
  }

  addToPlaylist = (index, type) => {
    const { clip, client, uid } = this.props;
    const { playlists, newPlaylists, deletedPlaylists } = this.state;
    if (type) {
      const { historyClips, watchClips, favouriteClips } = this.state;

      this.setState({ playlist: type, status: 'loading' });
      client
        .mutate({
          mutation: AddToDefaultPlaylist,
          variables: {
            playlistType: type,
            entityId: clip,
          },
          refetchQueries: [
            {
              query: GetAllPlaylist,
              variables: {
                type: ['playlist'],
                uid,
                sortField: 'changed',
                sortDirection: 'DESC',
              },
            },
          ],
        })
        .then(({ data: { addToDefaultPlaylist } }) => {
          this.setState({
            playlist: type,
            historyClips,
            watchClips,
            favouriteClips,
          });
          if (addToDefaultPlaylist.errors.length === 0) {
            this.setState({ playlist: type, status: 'added' });
          }
        });
    } else {
      const targetPlaylist = playlists[index];
      if (targetPlaylist) {
        const clips = [];
        targetPlaylist.entity.clips.forEach(item => {
          clips.push(item.entity.entityId);
        });
        let isAdded = false;
        if (clips.includes(`${clip}`)) {
          clips.splice(
            clips.findIndex(item => item === `${clip}`),
            1,
          );
          deletedPlaylists.push(targetPlaylist.nid);
        } else {
          clips.push(`${clip}`);
          newPlaylists.push(targetPlaylist.nid);
          isAdded = true;
        }
        this.setState({ playlist: targetPlaylist.nid, status: 'loading' });

        client
          .mutate({
            mutation: UpdatePlaylist,
            variables: {
              id: targetPlaylist.nid,
              title: targetPlaylist.title,
              clips,
            },
            refetchQueries: [
              {
                query: GetAllPlaylist,
                variables: { type: ['playlist'], uid, sortField: 'changed' },
              },
              {
                query: GetPlaylists,
                variables: { nid: clip },
              },
            ],
          })
          .then(({ data: { updatePlaylist } }) => {
            playlists[index].entity.clipsCount = clips.length;
            this.setState({
              playlists,
              playlist: targetPlaylist.nid,
              status: isAdded ? 'added' : 'removed',
            });
            if (updatePlaylist.errors.length === 0) {
              this.setState({ newPlaylists, deletedPlaylists });
            }
          });
      }
    }
  };

  renderClipCount = count => {
    return (
      <p className="playlist-count">
        {count > 0 ? `${count}${count > 1 ? ' clips' : ' clip'}` : 'No Clip'}
      </p>
    );
  };

  convertToArray = list => {
    const clips = [];
    list.forEach(item => {
      clips.push(item.flaggedEntity.entity.entityId);
    });
    return clips;
  };

  removeFromPlaylist = type => {
    const { clip, client, uid } = this.props;
    let query = null;

    if (type === 'favourites') {
      const { favouriteClips } = this.state;
      favouriteClips.splice(
        favouriteClips.findIndex(item => item === `${clip}`),
        1,
      );
      query = RemoveFromFavourite;
      this.setState({ favouriteClips, status: 'loading', playlist: type });
    }
    if (type === 'watch_later') {
      const { watchClips } = this.state;
      watchClips.splice(
        watchClips.findIndex(item => item === `${clip}`),
        1,
      );
      query = RemoveFromWatch;
      this.setState({ watchClips, status: 'loading', playlist: type });
    }
    client
      .mutate({
        mutation: query,
        variables: { entityId: clip },
        refetchQueries: [
          {
            query: GetAllPlaylist,
            variables: { type: ['playlist'], uid, sortField: 'changed' },
          },
          {
            query: GetPlaylists,
            variables: { nid: clip },
          },
        ],
      })
      .then(data => {
        this.setState({ status: 'removed' });
      });
  };

  render() {
    const { clip } = this.props;
    const {
      playlists,
      watchClips,
      favouriteClips,
      playlist,
      status,
    } = this.state;
    const default_playlist_image =
      'https://rockpeaksassets.s3.amazonaws.com/user_playlists/quadrant_stills/playlist-default.png';
    return (
      <Query query={GetPlaylists} variables={{ nid: clip }}>
        {({ data, loading, error }) => {
          const playlistsOfclip = [];
          if (!loading && !error && data.nodeById) {
            const { nodeById } = data;
            const entities = get(nodeById, 'reverseClipsNode.entities', []);
            entities.forEach(item => {
              playlistsOfclip.push(item.entityId);
            });
          }
          return (
            <div className="playlist-container">
              <div
                className={`playlist-panel ${
                  watchClips.includes(`${clip}`) ? 'added-playlist' : ''
                }`}
                onClick={() => {
                  if (watchClips.includes(`${clip}`)) {
                    this.removeFromPlaylist('watch_later');
                  } else {
                    this.addToPlaylist(0, 'watch_later');
                  }
                }}
              >
                <img
                  className="nav-link-card-image"
                  src={default_playlist_image}
                  alt=""
                />
                <p className="playlist-name">watch_later</p>
                {this.renderClipCount(watchClips ? watchClips.length : 0)}
                {playlist === 'watch_later' && status === 'loading' && (
                  <Spinner size="sm" className="spinner-login" />
                )}
                {playlist === 'watch_later' && status === 'added' && (
                  <span>Added</span>
                )}
                {playlist === 'watch_later' && status === 'removed' && (
                  <span>Removed</span>
                )}
              </div>
              <div
                className={`playlist-panel  ${
                  favouriteClips.includes(`${clip}`) ? 'added-playlist' : ''
                }`}
                onClick={() => {
                  if (favouriteClips.includes(`${clip}`)) {
                    this.removeFromPlaylist('favourites');
                  } else {
                    this.addToPlaylist(0, 'favourites');
                  }
                }}
              >
                <img
                  className="nav-link-card-image"
                  src={default_playlist_image}
                  alt=""
                />
                <p className="playlist-name">Favourites</p>
                {this.renderClipCount(
                  favouriteClips ? favouriteClips.length : 0,
                )}
                {playlist === 'favourites' && status === 'loading' && (
                  <Spinner size="sm" className="spinner-login" />
                )}
                {playlist === 'favourites' && status === 'added' && (
                  <span>Added</span>
                )}
                {playlist === 'favourites' && status === 'removed' && (
                  <span>Removed</span>
                )}
              </div>
              {playlists.map((item, ind) => {
                const clips = get(item, 'entity.clips', []);
                const count = get(item, 'entity.clipsCount');
                let still_image = get(
                  item,
                  'entity.stillImage.url.path',
                  default_playlist_image,
                );
                return (
                  <div
                    onClick={e => this.addToPlaylist(ind)}
                    className={`playlist-panel ${
                      item.isNew ? 'new-playlist' : ''
                    } ${playlistsOfclip.includes(item.nid) &&
                      'added-playlist'}`}
                    key={ind}
                  >
                    <img
                      className="nav-link-card-image"
                      src={still_image}
                      alt=""
                      height="160px"
                    />
                    <p className="playlist-name">{item.title}</p>
                    {this.renderClipCount(count)}
                    {playlist === item.nid && status === 'loading' && (
                      <Spinner size="sm" className="spinner-login" />
                    )}
                    {playlist === item.nid && status === 'added' && 'Added'}
                    {playlist === item.nid && status === 'removed' && 'Removed'}
                  </div>
                );
              })}
            </div>
          );
        }}
      </Query>
    );
  }
}

export default withApollo(PlaylistContainer);
