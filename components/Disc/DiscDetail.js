import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { get as _get } from 'lodash/object';
import { UncontrolledTooltip } from 'reactstrap';
import Link from 'next/link';

import GET_DISC_DETAIL from '@graphql/disc/DiscDetails.graphql';
import ErrorMessage from '@lib/ErrorMessage';
import FuzzySet from 'fuzzyset.js';
import _ from 'lodash';
import { Router } from '@root/routes.esm';
import { AppConsumer } from '@components/AppContext';
import JWPlayer from '@components/Utilities/VideoPlayer/JWPlayer';
import InactiveIcon from '@static/images/icons/svg/Clip-Missing.svg';
import {
  getDateFromClipNode,
  getDateFromEntity,
} from '@helpers/dateTimeHelper';
import { decodeHtmlSpecialChars } from '@helpers/stringHelper';
import { getConcatenatedURI } from '@helpers/urlHelper';

import SecondaryNav from '../SecondaryNav';

import { CarouselLoader, PageContentLoader } from '../Loader';
import './discDetail.style.scss';

class DiscDetail extends Component {
  static propTypes = {
    nid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    openedPlayerId: PropTypes.string,
    setPlayerStatusId: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: 0,
    };
  }

  handlePlay = index => {
    this.setState({ selectedIndex: index });
  };

  findPublicClip = publicClipNodes => {
    let publicClip = null;
    if (publicClipNodes.length > 0) {
      publicClip = publicClipNodes.find(item => {
        return item.entity.status;
      });
    }
    return publicClip;
  };

  getClipImage = (data, fields) => {
    for (let i = 0; i < fields.length; i++) {
      const img = _get(data, fields[i]);
      if (typeof img !== 'undefined') {
        return img;
      }
    }
    return 'https://rockpeaksassets.s3.amazonaws.com/placeholders/clip-default-still-graphic.png';
  };

  render() {
    const { nid } = this.props;
    const { selectedIndex } = this.state;

    return (
      <AppConsumer>
        {status => {
          const {
            authentication,
            theme = 'dark',
            openedPlayerId,
            setPlayerStatusId,
          } = status;
          return (
            <Query query={GET_DISC_DETAIL} variables={{ nid }}>
              {({ loading, error, data }) => {
                if (loading) {
                  return (
                    <div className="pl-4 pr-4">
                      <div style={{ maxWidth: '600px', marginBottom: '100px' }}>
                        <PageContentLoader />
                      </div>
                      <div style={{ maxWidth: '768px', marginBottom: '4em' }}>
                        <CarouselLoader />
                      </div>
                    </div>
                  );
                }
                if (error) return <ErrorMessage message={`Error! ${error.message}`} />;

                console.log(data);
                const {
                  nodeById,
                  nodeById: { nid, title, clips },
                } = data;
                const {
                  nodeById: { body },
                } = data;
                let bodyText = '';
                if (body != null) {
                  bodyText = body.processed;
                }
                const queryTitle = _.get(Router.query, 'title', false);
                const normalizedTitle = _.toLower(title)
                  .replace(/[^0-9a-z-]/g, '-')
                  .replace(/-+/g, '-');
                let titleMatched = [];
                if (queryTitle) {
                  const check = FuzzySet();
                  check.add(normalizedTitle);
                  titleMatched = check.get(queryTitle, false, 0.4);
                }

                // if (titleMatched.length > 0 && titleMatched[0][0] < 1) {
                //   // Remove extra '-' in the end of the route.
                //   normalizedTitle = normalizedTitle.split('-')
                //   normalizedTitle = normalizedTitle.filter(param => {
                //     return param.trim() != ''
                //   })
                //   normalizedTitle = normalizedTitle.join('-')
                //   Router.replaceRoute(`/discs/${nid}/${normalizedTitle}`);
                // }

                const contentBG =                  _get(nodeById, 'legacyImage.uri', null)
                  || _get(nodeById, 'discBackgroundImage.url', null)
                  || _get(nodeById, 'legacyBackgroundImage.url.path', null);
                const blurImgPath = `/static/images/${
                  theme === 'dark'
                    ? 'background-clip-page.jpg'
                    : 'background-clip-page-light.png'
                }`;
                const legacyImage = _get(
                  nodeById,
                  'legacyImage.url.path',
                  null,
                );
                const discArtwork = _get(nodeById, 'discArtwork.url', null);
                const blurredImage = _get(
                  nodeById,
                  'blurredArtworkImage.url.path',
                  null,
                );
                const playlist = [];
                clips.forEach((clip, index) => {
                  // if (
                  //   clip.entity.legacyImage &&
                  //   clip.entity.legacyImage.url &&
                  //   clip.entity.legacyImage.url.path
                  // )
                  {
                    let file = 'Inactive';
                    const publicClip = this.findPublicClip(
                      clip.entity.publicClipNodes,
                    );

                    let meta = {};
                    if (publicClip) {
                      file = publicClip.entity.url;
                      meta = {
                        duration: {
                          s: _get(publicClip, 'entity.durationSecs', 0),
                          m: _get(publicClip, 'entity.durationMins', 0),
                          h: _get(publicClip, 'entity.durationHours', 0),
                        },
                        in_point: {
                          s: _get(publicClip, 'entity.inSecs', 0),
                          m: _get(publicClip, 'entity.inMins', 0),
                          h: _get(publicClip, 'entity.inHours', 0),
                        },
                        out_point: {
                          s: _get(publicClip, 'entity.outSecs', 0),
                          m: _get(publicClip, 'entity.outMins', 0),
                          h: _get(publicClip, 'entity.outHours', 0),
                        },
                      };
                    }

                    const isActive = file !== 'Inactive';
                    const defaultValue = isActive && index >= selectedIndex;

                    const clipImageUrl = this.getClipImage(clip.entity, [
                      'smartStillImage640x480.uri',
                      'fieldStillImage.url',
                      'legacyImage.url.path',
                    ]);

                    // Add VTT thumbnails.
                    let tracks = [];
                    const archiveClip = _get(
                      clip.entity,
                      'archiveClipNodes["0"].entity',
                      {},
                    );

                    const metadataStatus = _get(
                      archiveClip,
                      'metadataStatus',
                      false,
                    );
                    const vttFile = _get(archiveClip, 'VTT', false);
                    if (metadataStatus && vttFile) {
                      tracks = [
                        {
                          file: vttFile,
                          kind: 'thumbnails',
                        },
                      ];
                    }

                    playlist.push({
                      default: defaultValue,
                      title: clip.entity.entityLabel,
                      file,
                      image: clipImageUrl,
                      tracks,
                      meta,
                    });
                  }
                });

                return (
                  <section className="page-disc-section">
                    <style jsx>
                      {`
                        .page-disc-blink {
                          background-image: url(${blurredImage});
                          background-repeat: no-repeat;
                          background-position: 50% 50px;
                          background-size: 100% 100%;
                          background-attachment: fixed;
                        }
                      `}
                    </style>
                    <div className="page-disc-blink pb-4">
                      <SecondaryNav
                        theme={theme}
                        type="disc"
                        brand={title}
                        nid={nid}
                        subNid={nid}
                      />
                      <div className="container disc-section-container">
                        <article className="disc-detail-content">
                          <div className="row pt-3 pb-3">
                            <div className="col-md-6 text-left h3">
                              Tracklisting
                            </div>
                            <div className="col-md-6 text-right h3">
                              Artwork
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6 ">
                              <div className="content-panel ">
                                {clips.map((clip, index) => {
                                  let file = 'Inactive';
                                  const publicClip = this.findPublicClip(
                                    clip.entity.publicClipNodes,
                                  );
                                  console.log('index', index);
                                  console.log(
                                    'clip.entity.publicClipNodes',
                                    clip.entity.publicClipNodes,
                                  );
                                  console.log('publicClip', publicClip);
                                  if (publicClip) {
                                    if (publicClip.entity.url) {
                                      file = publicClip.entity.url;
                                    }
                                  }

                                  console.log('file', file);
                                  const isInactive = file === 'Inactive';
                                  console.log('isInactive', isInactive);
                                  const { artist } = clip.entity;
                                  const { show } = clip.entity;
                                  return (
                                    <div
                                      key={index}
                                      onClick={() => {
                                        if (playlist[index].file === 'Inactive') return;
                                        this.handlePlay(index);
                                      }}
                                    >
                                      {index > 0 && (
                                        <hr className="m-0 clip-list-hr" />
                                      )}
                                      <div className="p-3 text-muted disc-list-row">
                                        <div className="disc-label">
                                          <span className="pr-3">
                                            {index + 1}
                                          </span>
                                          <Link
                                            href={getConcatenatedURI(
                                              'video',
                                              clip.entity.entityId,
                                              artist
                                                ? artist.entity.entityLabel
                                                : '',
                                              show
                                                ? show.entity.entityLabel
                                                : '',
                                              clip.entity.clipTitle,
                                            )}
                                          >
                                            <a className="text-muted">
                                              {decodeHtmlSpecialChars(
                                                clip.entity.clipTitle,
                                              )}
                                            </a>
                                          </Link>
                                          <span className="p-1">|</span>
                                          {artist && (
                                            <Link
                                              href={getConcatenatedURI(
                                                'artists',
                                                artist.entity.entityId,
                                                artist.entity.entityLabel,
                                              )}
                                              className="text-muted"
                                            >
                                              <a className="text-muted">
                                                {decodeHtmlSpecialChars(
                                                  artist.entity.entityLabel,
                                                )}
                                              </a>
                                            </Link>
                                          )}
                                          <span className="p-1">|</span>
                                          {show && (
                                            <Link
                                              href={getConcatenatedURI(
                                                'shows',
                                                show.entity.entityId,
                                                show.entity.entityLabel,
                                              )}
                                            >
                                              <a className="text-muted">
                                                {decodeHtmlSpecialChars(
                                                  show.entity.entityLabel,
                                                )}
                                              </a>
                                            </Link>
                                          )}
                                          <span className="p-1">|</span>
                                          <span>
                                            <Link
                                              href={`/browse/calendar?date=${getDateFromEntity(
                                                clip.entity,
                                                false,
                                              )}`}
                                            >
                                              <a className="text-muted">
                                                {getDateFromClipNode(
                                                  clip.entity,
                                                )}
                                              </a>
                                            </Link>
                                            {/* {getDateFromClipNode(clip.entity)} */}
                                          </span>
                                        </div>
                                        {isInactive && (
                                          <>
                                            <img
                                              className="disc-inactive-icon"
                                              src={InactiveIcon}
                                              alt="inactive"
                                              id={`inactive-icon-${index}`}
                                            />
                                            <UncontrolledTooltip
                                              placement="right"
                                              target={`inactive-icon-${index}`}
                                            >
                                              Inactive Clip
                                            </UncontrolledTooltip>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="content-panel h-100 p-4">
                                <div className="text-center">
                                  <img
                                    src={discArtwork || legacyImage}
                                    alt=""
                                    style={{ maxWidth: '100%' }}
                                  />
                                </div>
                                <div
                                  className="disc-body-text text-muted"
                                  dangerouslySetInnerHTML={{ __html: bodyText }}
                                />
                              </div>
                            </div>
                            <JWPlayer
                              playlistTitle={title}
                              playlist={playlist}
                              id="disc-player"
                              play={openedPlayerId === 'disc-player'}
                              // srcURL={playlist[selectedIndex].file}
                              onClose={() => {
                                setPlayerStatusId(null);
                              }}
                            />
                          </div>
                        </article>
                      </div>
                    </div>
                  </section>
                );
              }}
            </Query>
          );
        }}
      </AppConsumer>
    );
  }
}
DiscDetail.defaultProps = {
  openedPlayerId: null,
  setPlayerStatusId: () => {},
};
export default DiscDetail;
