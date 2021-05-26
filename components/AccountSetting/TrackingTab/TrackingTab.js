import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import { Row, Col, FormGroup, Input, Button } from 'reactstrap';
import moment from 'moment';
// import { Link } from '@root/routes.esm';
import Link from 'next/link';

import MediaActivity from '@components/Medias/MediaActivity';
import NavCarousel from '@components/NavCarousel';
import GetTrackingList from '@graphql/tracking/GetTrackingList.graphql';
import GetArtistActivities from '@graphql/artist/ArtistActivites.graphql';
import GetShowActivities from '@graphql/show/ShowActivities.graphql';

import './TrackingTab.style.scss';
import { SlideLoader } from '@components/Loader';

const showMoreStep = 9;
class TrackingTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: -1,
      selectedItem: -1,
      selectedType: '',
      prevLength: 0,
      limit: 25,
      sortField: 'changed',
      sortDirection: 'DESC',
    };
  }

  getActiveStyle = ind => {
    const { activeTab } = this.state;

    return activeTab >= 0 ? 'tab-pane fade show active' : 'tab-pane fade mb-5';
  };

  onClickItem = (newActiveTab, item) => {
    const { activeTab } = this.state;
    if (activeTab === newActiveTab) {
      this.setState({
        activeTab: -1,
      });
      return;
    }
    this.setState({
      selectedItem: item.nid,
      selectedType: item.type,
      activeTab: newActiveTab,
    });
  };

  handlShowMore = resultCount => () => {
    this.setState(prevState => {
      return { limit: prevState.limit + showMoreStep, prevLength: resultCount };
    });
  };

  handleSort = e => {
    this.setState({
      sortField: e.target.value,
      sortDirection: e.target.value === 'changed' ? 'DESC' : 'ASC',
    });
  };

  renderRecentActivities = () => {
    const {
      selectedItem,
      limit,
      prevLength,
      selectedType,
      activeTab,
    } = this.state;
    const variables = {
      bundles: ['clip', 'public_clip'],
      offset: 0,
      limit,
    };
    let query = GetArtistActivities;
    if (selectedType === 'artist') {
      variables.artistId = selectedItem;
      query = GetArtistActivities;
    } else if (selectedType === 'show') {
      variables.showId = selectedItem;
      query = GetShowActivities;
    }

    return (
      <Query
        query={query}
        fetchPolicy="cache-and-network"
        variables={variables}
      >
        {({ data, loading, error }) => {
          if (error) return '';
          // data can be undefined
          let getArtistsActivities = [];
          let getShowsActivities = [];
          if (data) {
            const {
              getArtistsActivities: dataArtistActivities = [],
              getShowsActivities: dataShowsActivities = [],
            } = data;
            getArtistsActivities = dataArtistActivities;
            getShowsActivities = dataShowsActivities;
          }

          let activityItems = [];
          if (selectedType === 'artist') activityItems = getArtistsActivities;
          else activityItems = getShowsActivities;
          const groupedActivities = {};
          activityItems.forEach(item => {
            const date = moment(item.datetime).format('MMMM D, YYYY');
            if (!groupedActivities[date]) {
              groupedActivities[date] = [item];
            } else {
              groupedActivities[date].push(item);
            }
          });
          if (activityItems.length === 0) {
            return null;
            // return (
            //   <div className="pt-4 pb-4">
            //     <hr />
            //   </div>
            // );
          }

          //If didn't get as much as showMoreStep we don't need to display show more button
          const needShowMore =
            activityItems.length - prevLength >= showMoreStep;
          return (
            <div className="narrow-container text-muted all-width">
              <div className="tab-content tab-content-secondary pb-0">
                <div className={this.getActiveStyle(activeTab)}>
                  <p className="h6">Recent Activity:</p>
                  <div>
                    {Object.keys(groupedActivities).map((key, keyIndex) => {
                      const activities = groupedActivities[key];
                      return (
                        <>
                          <Row>
                            <Col lg={12} className="text-center pb-4">
                              <hr />
                              {key}
                            </Col>
                          </Row>
                          <Row>
                            {activities.map((item, index) => {
                              const {
                                entity: { entityBundle },
                              } = item;

                              // Public clip has its entityId in reversePublicClipNodesNode
                              const targetId =
                                entityBundle === 'public_clip'
                                  ? item.entity.reversePublicClipNodesNode
                                    .entities[0].entityId
                                  : item.entity.entityId;
                              const publicLegacyImage = get(
                                item,
                                'entity.reversePublicClipNodesNode.entities.0.legacyImage.url.path',
                                '',
                              );
                              const clipLegacyImage = get(
                                item,
                                'entity.legacyImage.url.path',
                                '',
                              );

                              const publicShowTitle = get(
                                item,
                                'entity.reversePublicClipNodesNode.entities.0.show.entity.title',
                                '',
                              );
                              const showTitle = get(
                                item,
                                'entity.show.entity.title',
                                '',
                              );

                              const showId =
                                entityBundle === 'public_clip'
                                  ? item.entity.reversePublicClipNodesNode
                                    .entities[0].show.entity.entityId
                                  : item.entity.show.entity.entityId;

                              const artistTitle = get(
                                item,
                                'entity.artist.entity.title',
                                '',
                              );

                              const artistId =
                                entityBundle === 'public_clip'
                                  ? item.entity.reversePublicClipNodesNode
                                    .entities[0].artist.entity.entityId
                                  : item.entity.artist.entity.entityId;
                              let actionLabel = '';
                              if (item.action === 'update') {
                                actionLabel = 'Clip updated';
                              }
                              if (item.action === 'create') {
                                actionLabel = 'Clip created';
                              }
                              const showLink = (
                                <Link href={`/shows/${showId}`}>
                                  <a>{publicShowTitle || showTitle}</a>
                                </Link>
                              );
                              const artistLink = (
                                <Link href={`/artists/${showId}`}>
                                  <a>{artistTitle}</a>
                                </Link>
                              );
                              return (
                                <Col lg={6} xl={4}>
                                  <MediaActivity
                                    imgUrl={
                                      clipLegacyImage || publicLegacyImage
                                    }
                                    imgLink={`/video/${targetId}`}
                                    title={
                                      <Link href={`/video/${targetId}`}>
                                        <a>{item.entity.clipTitle}</a>
                                      </Link>
                                    }
                                    desc={
                                      selectedType === 'artist'
                                        ? showLink
                                        : artistLink
                                    }
                                    status={
                                      <span className="text-muted">
                                        {actionLabel}
                                      </span>
                                    }
                                  />
                                </Col>
                              );
                            })}
                          </Row>
                        </>
                      );
                    })}
                  </div>
                  {loading && (
                    <Row>
                      <Col className="text-center p-4">Loading...</Col>
                    </Row>
                  )}
                  <hr />
                  <div className="text-center">
                    {needShowMore && (
                      <Button
                        type="button"
                        color="danger"
                        outline
                        onClick={this.handlShowMore(activityItems.length)}
                      >
                        Show more
                      </Button>
                    )}
                    {!needShowMore && !loading && <span>No More Results</span>}
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      </Query>
    );
  };

  renderTracking(trackingList) {
    return (
      <NavCarousel
        items={trackingList}
        onChangeTab={this.onClickItem}
        hideActionButtons
        isShowDropdown
      />
    );
  }

  render() {
    const { active } = this.props;
    const { activeTab, sortField, sortDirection } = this.state;
    const style = active ? 'show active' : '';
    return (
      <div className={`tab-pane fade setting-tracking-tab ${style}`}>
        <Query query={GetTrackingList}>
          {({ loading, error, data }) => {
            if (error) {
              return (
                <div className="narrow-container p-2rem all-width  text-muted">
                  <p className="h6 mb-4">Something is wrong</p>
                </div>
              );
            }
            const subscriptions = get(data, 'getUserSubscriptions', []);
            const artistsCount = subscriptions.reduce((count, item) => {
              return item.type === 'artist' ? count + 1 : count;
            }, 0);
            const showCount = subscriptions.reduce((count, item) => {
              return item.type === 'show' ? count + 1 : count;
            }, 0);
            const trackingList = [];
            subscriptions.forEach(item => {
              const trackingItem = item;
              if (
                trackingItem.type === 'show' ||
                trackingItem.type === 'artist'
              ) {
                if (trackingItem.type === 'artist') {
                  trackingItem.link = `/artists/${trackingItem.nid}`;
                }
                if (trackingItem.type === 'show') {
                  trackingItem.link = `/shows/${trackingItem.nid}`;
                }
                trackingItem.clipsCount = trackingItem.entity.clips
                  ? trackingItem.entity.clips.count
                  : 0;
                if (typeof item.entity.legacy_image !== 'undefined') {
                  trackingItem.still_image = item.entity.legacy_image.uri;
                }
                trackingList.push(trackingItem);
              }
            });

            if (sortField === 'changed') {
              trackingList.sort((a, b) => {
                return a.entity.changed - b.entity.changed;
              });
            } else {
              trackingList.sort((a, b) => {
                return a.title.localeCompare(b.title);
              });
            }
            return (
              <>
                <div className="narrow-container text-muted p-2rem pb-0 all-width">
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
                      <div className="px-md-3">Tracking: </div>
                      <div>
                        <p className="h5 ">{artistsCount} Artists</p>
                        <p className="h5 ">{showCount} Shows</p>
                      </div>
                    </div>
                  </Row>
                </div>
                <div className="narrow-container text-muted  pb-0 all-width">
                  {loading && <SlideLoader />}
                  {!loading && this.renderTracking(trackingList)}
                </div>

                {this.renderRecentActivities()}
              </>
            );
          }}
        </Query>
      </div>
    );
  }
}

TrackingTab.propTypes = {
  active: PropTypes.bool.isRequired,
};

export default TrackingTab;
