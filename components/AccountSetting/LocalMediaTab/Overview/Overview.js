import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button, Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import AlertBox from '@components/Utilities/AlertBox';
import { withApollo, Query } from 'react-apollo';
import gql from 'graphql-tag';
import DisconnectPlexAccount from '@graphql/plex/DisconnectPlexAccount.graphql';
import GetPersonalClips from '@graphql/plex/GetPersonalClips.graphql';
import GetPlexAndPersonalItems from '@graphql/plex/GetPlexAndPersonalItems.graphql';
import FetchPlexItems from '@graphql/plex/FetchPlexItems.graphql';

import { get } from 'lodash';
import { isEmpty } from 'lodash';
import { getCookie } from '@helpers/session';

import ClipTree from './PlexClipTree';
import PersonalClipList from '../PlexClipList';

import { ListLoader } from '../../../Loader';
import ClipPageList from '../ClipPageList';

const GET_CLIPS = gql`
  query getClips(
    $nid: [String]
  ) {
    clips:nodeQuery(
      filter: {
        conditions: [
          {
            field: "type"
            value: "clip"
            operator: EQUAL
          },
          {
            field: "nid"
            value: [$nid]
            operator: IN
          }
        ]
      }
    ) {
      entities {
        ...on NodeCurationRequest {
          uid {
            entity {
              entityId
              entityLabel
            }
          }
          nid
          entity {
            entity {
              entityId
              entityType
              entityBundle
              entityLabel
              ... on NodeClip {
                clipTitle
                archiveClipNodes {
                  entity {
                    ... on NodeArchiveClip {
                      nid
                      title
                      status
                      metadataStatus
                      VTT
                    }
                  }
                }
                legacyImage {
                  url {
                    path
                  }
                }
                fieldStillImage {
                  url
                }
                smartStillImage {
                  uri
                }
                smartStillImage320x480 {
                  uri
                }
                smartStillImage640x480 {
                  uri
                }
                smartStillImage1280x720 {
                  uri
                }
              }
            }
          }
        }
      }
    }
  }
`;

class Overview extends Component {
  disconnectPlexAccount = () => {
    this.props.client.mutate({ mutation: DisconnectPlexAccount }).then(() => {
      const { onNext, disconnect, setMessage } = this.props;
      setMessage('success', 'Your Plex account has been disconnected');
      disconnect();
      onNext();
    });
  };

  gotoStep = step => e => {
    this.props.gotoStep(step);
  };

  getClipImage = (data, fields) => {
    for (let i = 0; i < fields.length; i++) {
      let img = get(data, fields[i])
      if (typeof img !== 'undefined') {
        return img
      }
    }
    return 'https://rockpeaksassets.s3.amazonaws.com/placeholders/clip-default-still-graphic.png'
  }

  render() {
    const { plexAccount, plexMediaCount } = this.props;
    const result = 738;
    const variables = {
      filter: {
        conditions: [
          {
            field: 'status',
            value: '1',
            operator: 'EQUAL',
          },
          {
            field: 'uid',
            value: getCookie('user_id'),
            operator: 'EQUAL',
          },
          {
            field: 'type',
            value: 'personal_clip',
            operator: 'EQUAL',
          },
        ],
      },
      limit: '20',
    };
    return (
      <React.Fragment>
        <Query query={GetPersonalClips} variables={variables}>
          {({ data, loading, error, client }) => {
            let count = 0;
            if (loading || error) return <ListLoader className="mt-2 mb-2 ml-2 mr-2" />;
            if (data) {
              count = get(data, 'nodeQuery.count', 0);
            }
            variables.limit = count;

            // Let's get parent clips and then, fetch archive clips.


            return (
              <div className="narrow-container text-muted all-width pb-0">
                {/* {count > 0 ? (
                  <AlertBox
                    text={`${count} items processed: All results have been saved to the database`}
                    onClose={() => {}}
                  />
                ) : (
                  ''
                )} */}
                {/* <h2 className="smaller mb-3 mt-3 text-white">Plex Overview</h2>
                <p className="h5 mb-4">
                  Your Plex account is currently connected {count} clips from your personal library were successfully
                  identified, 1 are not.
                  <br />
                  Click the &nbsp;
                  <a className="text-warning" href="#0">
                    Verbose results
                  </a>
                  &nbsp; button to see a full list of matched and unmatched clips. If you would like to run the matching
                  routing again, adjust your personal library selection, or switch Plex accounts, you may do so below.
                </p> */}

                <Query query={GetPlexAndPersonalItems} variables={variables}>
                  {({ data, loading, error, client }) => {
                    let count = 0;
                    if (loading || error) return <ListLoader className="mt-2 mb-2 ml-2 mr-2" />;
                    if (data) {
                      count = get(data, 'nodeQuery.count', 0);
                    }

                    let personalClips = get(data, 'personalClips.entities', []);
                    console.log(personalClips)

                    var archive_clips = []
                    personalClips = personalClips.map(personalClip => {
                      let $parent_clip = get(personalClip, 'parentClip.entity', {})
                      console.log($parent_clip)
                      let $archive_clips = get($parent_clip, 'archiveClipNodes', [])
                      $archive_clips = $archive_clips.filter(archive_clip => {
                        return archive_clip.entity != null
                      })
                      if ($archive_clips.length > 0) {
                        let $archive_clip = $archive_clips[0]
                        personalClip = { ...personalClip, archiveClip: $archive_clip }
                        return personalClip
                      }
                      else {
                        return personalClip
                      }
                    })

                    // Add clip image.
                    personalClips = personalClips.map(personalClip => {
                      let $parent_clip = get(personalClip, 'parentClip.entity', {})
                      const clipImageUrl = this.getClipImage($parent_clip, [
                        'smartStillImage640x480.uri',
                        'fieldStillImage.url',
                        'legacyImage.url.path',
                      ])
                      personalClip = { ...personalClip, clipImageUrl: clipImageUrl }
                      return personalClip
                    })
                    console.log(personalClips)

                    const personalClipCount = get(data, 'personalClips.count', 0);
                    const plexItems = get(data, 'plexItems.result', []);
                    const plexItemsCount = plexItems.length;
                    const unmatchedCount =
                      plexItemsCount - personalClipCount > 0 ? plexItemsCount - personalClipCount : 0;
                    const unmatchedClips = [];
                    plexItems.forEach(plexItem => {
                      const itemIndex = personalClips.findIndex(personalItem => {
                        return personalItem.key === plexItem.key;
                      });
                      if (itemIndex < 0) {
                        unmatchedClips.push(plexItem);
                      }
                    });
                    return (
                      <>
                        <div className="m-3 ">
                          <h2 className="smaller mb-4 text-white m-3">Matched Media</h2>
                          <p className="lead m-3">
                            We found {plexItemsCount} videos on your Plex Server and were able to match{' '}
                            {personalClipCount} of them to clip records on our site.
                          </p>
                          <p className="lead m-3">
                            You’ll now be able to play back your content from any of those matching clip pages - you’ll
                            notice a checkmark next to the word “Personal” underneath the video thumbnail.
                          </p>
                          <p className="lead m-3">
                            There are two possible reasons why the other {unmatchedCount} videos were not matched:
                          </p>
                          <p className="lead m-3">
                            <ul>
                              <li>We don’t have a clip record for a particular video in your collection </li>
                              <li>
                                We do have a clip record, but inconsistencies in naming, punctuation or spelling
                                prevented a match{' '}
                              </li>
                            </ul>
                          </p>
                          <p className="lead m-3">
                            Your unmatched videos are listed below. To improve your match rate, we suggest first
                            checking this list against our database using the site’s search engine.
                          </p>
                          <p className="lead m-3">
                            <ul>
                              <li>
                                If you find a “near match” (i.e. we have a clip page on the site for your video but
                                there are differences in the title, artist name, show name or date) then you can try 
                                renaming your file to follow our naming convention and rescanning your library.
                              </li>
                              <li>
                                If you feel that your file is named correctly and the information in our database should
                                be changed or updated, please follow the steps here.
                              </li>
                              <li>
                                If we don’t have a record in our database for a video in your library, then please
                                consider adding it, starting from this page.
                              </li>
                            </ul>
                          </p>
                          {/* <PersonalClipList count={251} plexAccount={plexAccount} /> */}
                        </div>
                        <div className="">
                          <hr className="m-0" />
                          <ClipPageList
                            count={plexItemsCount}
                            clips={plexItems}
                            plexAccount={plexAccount}
                            header={`Video Files Found On Your Plex Server (${plexItemsCount})`}
                          />
                          <hr className="m-0" />
                          <ClipPageList
                            count={personalClipCount}
                            clips={personalClips}
                            plexAccount={plexAccount}
                            header={`Videos Matched To Clip Records (${personalClipCount})`}
                          />
                          <hr className="m-0" />
                          <ClipPageList
                            clips={unmatchedClips}
                            count={unmatchedCount}
                            plexAccount={plexAccount}
                            header={`Unmatched Videos From Your Collection (${unmatchedCount})`}
                          />
                        </div>
                      </>
                    );
                  }}
                </Query>
              </div>
            );
          }}
        </Query>

        <div className="modal-footer justify-content-start">
          <Button type="button" color="danger" onClick={this.gotoStep(3)}>
            SCAN AGAIN
          </Button>
          <Button type="button" color="danger" onClick={this.gotoStep(1)}>
            CHOOSE LIBRARIES
          </Button>
          <Button type="button" color="danger" onClick={this.disconnectPlexAccount}>
            DISCONNECT PLEX
          </Button>
        </div>
      </React.Fragment>
    );
  }
}
Overview.propTypes = {
  setMessage: PropTypes.func.isRequired,
  plexAccount: PropTypes.object.isRequired,
  plexMediaCount: PropTypes.number.isRequired,
};
export default withApollo(Overview);
