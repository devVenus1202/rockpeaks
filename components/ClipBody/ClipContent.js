import React, { Component } from 'react';
import { Row, Col, Button } from 'reactstrap';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import RateBox from '@components/Utilities/RatingBox';
import { handleClickLink } from '@helpers/routeHelper';
import './ClipContent.style.scss';
import GetReviewsRequest from '@graphql/review/GetClipReviews.graphql';
import { withContext } from '@components/HOC/withContext';
import { Query } from 'react-apollo';
import DefaultAvatar from '@static/images/default-avatar.jpg';
import GET_VIDEO_INFO from '@graphql/youtube/GetVideoInfo.graphql';
import { decodeHtmlSpecialChars } from '@helpers/stringHelper';
import moment from 'moment';
import { getProfileLink } from '@helpers/urlHelper';

class ClipContent extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    show: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    ranking: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
    };

    this.review_wrapper = React.createRef();
  }

  handleClickMore = () => {
    this.setState(prevState => ({
      expanded: !prevState.expanded,
    }));
    this.review_wrapper.current.scrollTo(0, 0);
  };

  goToProfile = (uid, name) => e => {
    // window.location.href = `${userInfo.profileLink}/${userInfo.user_id}`;
    window.open(
      getProfileLink(name, uid),
      '_blank', // <- This is what makes it open in a new window.
    );
  };

  render() {
    const {
      nid,
      title,
      artist,
      show,
      artistNid,
      showNid,
      body,
      ranking,
      date,
      user,
      url,
    } = this.props;
    const { expanded } = this.state;
    const activeStyle = expanded ? 'expanded' : 'collapsed';
    const variables = {
      filter: {
        conditions: [
          {
            field: 'clip',
            value: nid,
            operator: 'EQUAL',
          },
          {
            field: 'status',
            value: true,
            operator: 'EQUAL',
          },
          {
            field: 'type',
            value: 'review',
            operator: 'EQUAL',
          },
        ],
      },
    };

    return (
      <div className="uploaded-file-text clip-content-wrapper">
        <h2 className="clip-title ">{title}</h2>
        <Row>
          <Col lg={7}>
            <h5
              className=" clip-title-link"
              onClick={handleClickLink('artists', artistNid, artist)}
            >
              {decodeHtmlSpecialChars(artist)}
            </h5>
            <h5
              className="mb-3  clip-title-link"
              onClick={handleClickLink('shows', showNid, show)}
            >
              {decodeHtmlSpecialChars(show)}
            </h5>
          </Col>
          <Col lg={5}>
            <RateBox rating={ranking} value={date} />
          </Col>
        </Row>
        <Query query={GetReviewsRequest} variables={variables}>
          {({ data, loading, error }) => {
            const reviewList = get(data, 'nodeQuery.entities', []);
            if (loading || error) {
              return <div />;
            }
            if (reviewList.length === 0) {
              return (
                <>
                  {body && (
                    <>
                      <div className={activeStyle} ref={this.review_wrapper}>
                        <div className="review-item d-flex mt-3 mb-3" />
                        <div
                          className="review-content "
                          dangerouslySetInnerHTML={{
                            __html: body || '',
                          }}
                        />
                      </div>
                      <p className="pt-3 mb-4">
                        <Button
                          onClick={this.handleClickMore}
                          type="button"
                          color="danger"
                          size="sm"
                        >
                          {expanded ? 'Less' : 'More'}
                        </Button>
                      </p>
                    </>
                  )}
                  {!body && url && (
                    <Query query={GET_VIDEO_INFO} variables={{ url }}>
                      {({ data, loading, error }) => {
                        if (error || loading) return '';
                        const {
                          youtubeGetInfo: { info },
                        } = data;
                        if (!info) return '';
                        return (
                          <>
                            <div
                              className={activeStyle}
                              ref={this.review_wrapper}
                            >
                              <div className="review-item d-flex mt-3 mb-3" />
                              <div className="review-content ">
                                {decodeHtmlSpecialChars(info.description)}
                              </div>
                            </div>
                            <p className="pt-3 mb-4">
                              {info.description && (
                                <Button
                                  onClick={this.handleClickMore}
                                  type="button"
                                  color="danger"
                                  size="sm"
                                >
                                  {expanded ? 'Less' : 'More'}
                                </Button>
                              )}
                            </p>
                          </>
                        );
                      }}
                    </Query>
                  )}
                </>
              );
            }
            return (
              <>
                <div className={activeStyle} ref={this.review_wrapper}>
                  {reviewList.map((item, index) => {
                    const avatar = get(
                      item,
                      'uid.entity.rpCustomerProfiles.entity.avatarImage.url',
                      DefaultAvatar,
                    );
                    return (
                      <>
                        <div className="review-item d-flex mt-3 mb-3">
                          <div className="setting-avatar">
                            <img src={avatar} alt="" />
                          </div>
                          <div className="ml-4">
                            <span> REVIEWED BY</span>
                            <h5
                              className=" clip-title-link pt-2"
                              onClick={this.goToProfile(
                                item.uid.targetId,
                                item.uid.entity.name,
                              )}
                            >
                              {item.uid.entity.name}
                            </h5>
                          </div>
                        </div>
                        {/* <h5 className=" clip-title-link ">{item.title}</h5> */}
                        <div
                          className="review-content "
                          dangerouslySetInnerHTML={{
                            __html: item ? item.body.value : '',
                          }}
                        />
                      </>
                    );
                  })}
                </div>
                <p className="pt-3 mb-4">
                  <Button
                    onClick={this.handleClickMore}
                    type="button"
                    color="danger"
                    size="sm"
                  >
                    {expanded ? 'Less' : 'More'}
                  </Button>
                </p>
              </>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default withContext(ClipContent);
