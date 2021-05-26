import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Query } from 'react-apollo';
import * as compose from 'lodash.flowright';
import { ModalFooter, Row, Col, FormGroup, Input } from 'reactstrap';

import { SlideLoader } from '@components/Loader';
import { withContext } from '@components/HOC/withContext';
import NavCarousel from '@components/NavCarousel';
import Alert from '@components/Utilities/Alert';

import GetAllPlaylist from '@graphql/playlist/GetAllPlaylist.graphql';
import {
  removeHistoryMutate,
  removeWatchMutate,
  removeFavouriteMutate,
  updatePlaylistMutate,
} from '@helpers/graphql/playlist';

import List from './List';
import './PlaylistTab.style.scss';

class PlaylistTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: -1,
      targetId: 0,
      message: '',
      alertType: 'success',
      showMessage: false,
      sortField: 'changed',
      sortDirection: 'DESC',
    };
  }

  handleChangeTab = (newActiveTab, item) => {
    const { activeTab } = this.state;

    if (activeTab === newActiveTab) {
      this.setState({
        activeTab: -1,
        targetId: 0,
      });
      return;
    }

    this.setState({
      activeTab: newActiveTab,
      targetId: item.nid,
      title: item.title,
      message: '',
    });
  };

  getActiveStyle = ind => {
    const { activeTab } = this.state;

    return activeTab === ind
      ? 'tab-pane p-0 pt-3 fade show active'
      : 'tab-pane p-0 pt-3 fade';
  };

  getVariables = () => {
    const { sortField, sortDirection } = this.state;
    const { user } = this.props;
    const variables = {
      type: ['playlist'],
      uid: user.user_id,
      sortField,
      sortDirection,
    };
    return variables;
  };

  handleRemove = (clips, index) => {
    const { targetId, title } = this.state;
    const variables = this.getVariables();
    const refetchQueries = [
      {
        query: GetAllPlaylist,
        variables,
      },
    ];
    this.setState({
      message: 'Removing...',
      alertType: 'warning',
      showMessage: true,
    });

    if (targetId < 4) {
      const { removeHistory, removeWatch, removeFavourite } = this.props;
      const removeActions = [removeHistory, removeWatch, removeFavourite];
      const removeAction = removeActions[targetId - 1];

      const removeEntityId = clips[index].flaggedEntity.entity.entityId;

      removeAction(removeEntityId, refetchQueries).then(res => {
        this.setState(
          () => ({
            message: 'Successfully removed.',
            alertType: 'success',
            showMessage: true,
          }),
          () => {
            setTimeout(() => {
              this.setState({
                showMessage: false,
              });
            }, 3000);
          },
        );
      });
    } else {
      const newEntities = clips.map(clip => clip.flaggedEntity.entity.entityId);
      newEntities.splice(index, 1);
      const { updatePlaylist } = this.props;

      updatePlaylist(targetId, title, newEntities, refetchQueries).then(res => {
        this.setState(
          () => ({
            message: 'Successfully removed.',
            alertType: 'success',
            showMessage: true,
          }),
          () => {
            setTimeout(() => {
              this.setState({
                showMessage: false,
              });
            }, 3000);
          },
        );
      });
    }
  };

  handleUpdate = clips => {
    this.setState({
      message: 'Updating order...',
      alertType: 'warning',
      showMessage: true,
    });

    const newEntities = clips.map(clip => clip.flaggedEntity.entity.entityId);

    const { updatePlaylist } = this.props;
    const { targetId, title } = this.state;

    const variables = this.getVariables();

    const refetchQueries = [
      {
        query: GetAllPlaylist,
        variables,
      },
    ];
    updatePlaylist(targetId, title, newEntities, refetchQueries).then(res => {
      this.setState(
        () => ({
          message: 'Successfully updated.',
          alertType: 'success',
          showMessage: true,
        }),
        () => {
          setTimeout(() => {
            this.setState({
              showMessage: false,
            });
          }, 3000);
        },
      );
    });
  };

  renderingPlaylistsCarousel = subscriptions => {
    const { activeTab } = this.state;
    const sliderSettings = {
      arrows: true,
      infinite: false,
      lazyLoad: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      responsive: [
        { breakpoint: 768, settings: { slidesToShow: 2 } },
        { breakpoint: 1024, settings: { slidesToShow: 3 } },
        { breakpoint: 2048, settings: { slidesToShow: 4 } },
      ],
    };

    return <NavCarousel items={subscriptions} />;
  };

  handleSort = e => {
    this.setState({
      sortField: e.target.value,
      sortDirection: e.target.value === 'changed' ? 'DESC' : 'ASC',
    });
  };

  render() {
    const { activeTab, message, alertType, showMessage, targetId } = this.state;

    const { active, type } = this.props;
    const style = active ? 'show active' : '';
    const variables = this.getVariables();

    return (
      <Query query={GetAllPlaylist} variables={variables}>
        {({ loading, error, data }) => {
          const userPlaylist = get(data, 'userPlaylist', []);
          const sortedPlaylist = get(data, 'sortedPlaylist.entities', []);
          const watchPlaylist = get(data, 'watchPlaylist', {});
          const historyPlaylist = get(data, 'historyPlaylist', {});
          const favouritesPlaylist = get(data, 'favouritesPlaylist', {});

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

            playlist.still_image = get(playlist, 'stillImage.url.path');
          });

          // Fixing Data format manually
          const items = [
            {
              nid: 1,
              title: 'History',
              clipsCount: historyPlaylist.count,
              type: 'default_playlist',
            },
            {
              nid: 2,
              title: 'Watch Later',
              clipsCount: watchPlaylist.count,
              type: 'default_playlist',
            },
            {
              nid: 3,
              title: 'Favourites',
              clipsCount: favouritesPlaylist.count,
              type: 'default_playlist',
            },
            ...sortedPlaylist,
          ];

          const extraItem =
            targetId > 3
              ? sortedPlaylistItems.find(item => item.entityId === targetId)
              : null;

          const activePlaylistIndex = sortedPlaylistItems.findIndex(
            item => item.entityId === targetId,
          );
          const selectedTabIndex =
            activeTab > 3 ? activePlaylistIndex + 3 : activeTab;
          return (
            <div
              className={`tab-pane fade setting-playlist-tab ${style}`}
              id="nav-playlists"
              role="tabpanel"
              aria-labelledby="nav-playlists-tab"
            >
              <div
                className={`narrow-container text-muted ${
                  type !== 'profile' ? 'p-2rem' : 'mb-md-4'
                  }  all-width`}
              >
                <Row>
                  <Col md={6}>
                    <FormGroup className="d-inline-block mb-md-0">
                      <Input type="select" onChange={this.handleSort}>
                        <option value="changed">Recently Updated</option>
                        <option value="title">Alphabetical</option>
                      </Input>
                    </FormGroup>
                  </Col>
                  <div className="col-md-6 d-flex align-items-top justify-content-md-end mx-md-n5">
                    <div className="px-md-3">Total: </div>
                    <div>
                      <p className="h5 ">{userPlaylist.length + 3} Playlists</p>
                    </div>
                  </div>
                </Row>
              </div>
              <div className="narrow-container text-muted pb-0 all-width">
                {!loading && (
                  <NavCarousel
                    items={items}
                    onChangeTab={this.handleChangeTab}
                    isShowDropdown={type !== 'profile'}
                    selectedTab={selectedTabIndex}
                  />
                )}
                {loading && <SlideLoader />}
              </div>
              {type !== 'profile' && (
                <div className="narrow-container text-muted all-width">
                  <div className="tab-content tab-content-secondary pb-0">
                    <div className={this.getActiveStyle(activeTab)}>
                      {targetId === 1 && (
                        <List
                          clips={historyPlaylist.entities}
                          onUpdate={this.handleUpdate}
                          onRemove={this.handleRemove}
                        />
                      )}
                      {targetId === 2 && (
                        <List
                          clips={watchPlaylist.entities}
                          onUpdate={this.handleUpdate}
                          onRemove={this.handleRemove}
                        />
                      )}
                      {targetId === 3 && (
                        <List
                          clips={favouritesPlaylist.entities}
                          onUpdate={this.handleUpdate}
                          onRemove={this.handleRemove}
                        />
                      )}
                      {targetId > 3 && extraItem && (
                        <List
                          playlistId={extraItem.entityId}
                          clips={extraItem.flaggedEntity}
                          onUpdate={this.handleUpdate}
                          onRemove={this.handleRemove}
                          key={extraItem.entityId}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
              {type !== 'profile' && (
                <ModalFooter>
                  {showMessage && <Alert variant={alertType} value={message} />}
                </ModalFooter>
              )}
            </div>
          );
        }}
      </Query>
    );
  }
}

PlaylistTab.propTypes = {
  active: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  removeHistory: PropTypes.func.isRequired,
  removeWatch: PropTypes.func.isRequired,
  removeFavourite: PropTypes.func.isRequired,
  updatePlaylist: PropTypes.func.isRequired,
};

export default compose(
  removeHistoryMutate,
  removeWatchMutate,
  removeFavouriteMutate,
  updatePlaylistMutate,
  withContext,
)(PlaylistTab);
