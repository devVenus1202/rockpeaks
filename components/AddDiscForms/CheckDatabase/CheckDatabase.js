import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Input, Button, Form, FormGroup, Label } from 'reactstrap';
import GetAllPlaylist from '@graphql/playlist/GetAllPlaylist.graphql';
import NavCarousel from '@components/NavCarousel';
import { Query } from 'react-apollo';
import { withContext } from '@components/HOC/withContext';

const text1 =
  'A “Disc” is an official, permanent playlist, a sequence of clips that represent a concert or a film or any other logical grouping of videos that a user might want to watch in order.';
const text2 =
  'All Discs start out as playlists – you make a Disc by selecting one of your playlists and adding some extra metadata. (If you need a refresher on making playlists, you can review that process here.)';
const text3 =
  'So if you have a playlist ready, and have checked that we don’t already have the Disc in our system, please follow the steps below.';
const text4 =
  'Select the playlist you want to convert to a Disc and then press NEXT.';

class CheckDatabase extends Component {
  constructor(props) {
    super(props);
    const { selectedPlaylist = 0 } = props;
    this.state = {
      targetId: 0,
      selectedPlaylist,
    };
  }

  handleChangeTab = (activeTab, item) => {
    const { setDiscData } = this.props;
    this.setState({
      selectedPlaylist: item.entityId,
    });
    if (setDiscData) {
      setDiscData('selectedPlaylist', item.entityId);
    }
  };

  render() {
    const { onNext, user } = this.props;
    const { targetId, selectedPlaylist } = this.state;
    const variables = {
      type: ['playlist'],
      uid: user.user_id,
      sortField: 'changed',
      sortDirection: 'DESC',
    };

    return (
      <Query query={GetAllPlaylist} variables={variables}>
        {({ loading, error, data }) => {
          const sortedPlaylist = get(data, 'sortedPlaylist.entities', []);

          const sortedPlaylistItems = [];
          sortedPlaylist.forEach((playlist, index) => {
            const flaggedList = [];
            playlist.clips.forEach((clip, index) => {
              flaggedList.push({ entityId: index, flaggedEntity: clip });
            });
            sortedPlaylistItems.push({
              entityId: playlist.nid,
              flaggedEntity: flaggedList,
            });

            playlist.type = 'playlist';

            let still_image = get(playlist, 'stillImage.url.path');
            playlist.still_image = still_image;
          });

          console.log('playlist data: ', data);
          // Fixing Data format manually
          const items = [
            // {
            //   nid: 1,
            //   title: 'History',
            //   clipsCount: historyPlaylist.count,
            //   type: 'default_playlist',
            // },
            // {
            //   nid: 2,
            //   title: 'Watch Later',
            //   clipsCount: watchPlaylist.count,
            //   type: 'default_playlist',
            // },
            // {
            //   nid: 3,
            //   title: 'Favourites',
            //   clipsCount: favouritesPlaylist.count,
            //   type: 'default_playlist',
            // },
            ...sortedPlaylist,
          ];

          const selectedItemIndex = items.findIndex(item => {
            return item.entityId === selectedPlaylist;
          });

          console.log('items', items);
          return (
            <Form>
              <div className="narrow-container mb-8rem">
                <p className="text-muted lead mb-4">{text1}</p>
                <p className="text-muted lead mb-4">{text2}</p>
                <p className="text-muted lead mb-4">{text3}</p>
                <p className="text-muted lead mb-4">{text4}</p>
                <NavCarousel
                  items={items}
                  onChangeTab={this.handleChangeTab}
                  isShowDropdown={false}
                  hideActionButtons
                  defaultActiveTab={selectedItemIndex}
                />
                {/* <p className="text-muted lead">
                  Selected Playlist:{' '}
                  <span className="pl-4">{selectedPlaylist.title}</span>
                </p> */}
              </div>
              <div className="text-center text-md-right">
                <span className="float-left text-muted lead">
                  Selected Playlist:{' '}
                  <span className="pl-4">
                    {selectedItemIndex >= 0
                      ? items[selectedItemIndex].title
                      : ''}
                  </span>
                </span>
                <Button
                  className="ml-4"
                  type="button"
                  onClick={onNext}
                  color="danger"
                  disabled={selectedItemIndex < 0}
                >
                  next
                </Button>
              </div>
            </Form>
          );
        }}
      </Query>
    );
  }
}
CheckDatabase.propTypes = {
  onNext: PropTypes.func.isRequired,
  setDiscData: PropTypes.func.isRequired,
  selectedPlaylist: PropTypes.object.isRequired,
};

export default withContext(CheckDatabase);
