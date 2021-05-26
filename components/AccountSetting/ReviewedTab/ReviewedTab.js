import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { get } from 'lodash';
import { Query, graphql } from 'react-apollo';
import { Row, Col, FormGroup, Button, Spinner, ModalFooter } from 'reactstrap';

import ModalCarousel from '@components/ModalCarousel';
import AlertBox from '@components/Utilities/AlertBox';
import SelectBox from '@components/Utilities/SelectBox';
import FormReview from '@components/Dialogs/EditReview/FormReview';

import { SlideLoader } from '@components/Loader';
import { withContext } from '@components/HOC/withContext';
import { withMutation } from '@components/HOC/withMutation';
import { withCreateMutation } from '@components/HOC/withCreateMutation';
import { withUpdateMutation } from '@components/HOC/withUpdateMutation';

import UpdateClip from '@graphql/clip/UpdateClip.graphql';
import GET_VIDEO_INFO from '@graphql/youtube/GetVideoInfo.graphql';
import GetReviews from '@graphql/review/GetClipReviewsByUser.graphql';
import CreateClipReview from '@graphql/review/CreateClipReview.graphql';
import UpdateClipReview from '@graphql/review/UpdateClipReview.graphql';

import './ReviewedTab.style.scss';
import { decodeHtmlSpecialChars } from '@helpers/stringHelper';

class ReviewedTab extends Component {
  constructor(props) {
    super(props);
    this.form = React.createRef();
    this.state = {
      sortField: 'created',
      activeTab: -1,
      selectedItem: null,
      isUpdating: false,
    };
  }

  onSubmit = () => {
    this.setState({ isUpdating: true });
    this.form.submit();
  };

  onEndSubmit = (message, type) => {
    this.setState({
      isUpdating: false,
      message,
      showAlert: true,
      alertType: type,
    });

    setTimeout(() => {
      this.setState({
        showAlert: false,
      });
    }, 5000);
  };

  handleChangeTab = (newActiveTab, item) => {
    const { activeTab } = this.state;
    if (activeTab === newActiveTab) {
      this.setState({
        activeTab: -1,
        selectedItem: null,
      });
      return;
    }
    this.setState({
      activeTab: newActiveTab,
      selectedItem: item,
    });
  };

  closeAlert = () => {
    this.setState({ showAlert: false });
  };

  setSortField = value => {
    this.setState({ sortField: value });
  };

  getVariables = () => {
    const { sortField } = this.state;
    const { user } = this.props;
    const variables = {
      filter: {
        conditions: [
          {
            field: 'uid',
            value: user.user_id,
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
      limit: 1000,
      sort: [
        {
          field: sortField,
          direction: sortField === 'title' ? 'ASC' : 'DESC',
        },
      ],
    };
    return variables;
  };

  render() {
    const { active, type, onCancel } = this.props;
    const {
      activeTab,
      selectedItem,
      isUpdating,
      message,
      showAlert,
      alertType,
    } = this.state;
    const style = active ? 'show active' : '';
    const reviewBody = get(selectedItem, 'body.processed', '');
    const clipTags = get(selectedItem, 'clipTags', []);
    const entityId = get(selectedItem, 'entityId', '0');
    const clipId = get(selectedItem, 'clip.0.entity.entityId', '');
    const tags = [];
    clipTags.forEach(item => {
      tags.push(item.entity.entityLabel);
    });

    const variables = this.getVariables();
    return (
      <div className={`tab-pane fade reviewed-tracking-tab ${style}`}>
        <Query query={GetReviews} variables={variables}>
          {({ loading, error, data }) => {
            const clips = get(data, 'nodeQuery.entities', []);
            return (
              <>
                <div
                  className={`narrow-container text-muted ${
                    type !== 'profile' ? 'p-2rem' : 'mb-md-4'
                  }  all-width`}
                >
                  <Row>
                    <Col md={6}>
                      <FormGroup className="d-inline-block mb-md-0">
                        <SelectBox
                          items={[
                            { label: 'Recently Updated', value: 'created' },
                            { label: 'Alphabetical', value: 'title' },
                          ]}
                          onChange={this.setSortField}
                        />
                      </FormGroup>
                    </Col>
                    <div className="col-md-6 d-flex align-items-center justify-content-md-end">
                      <p className="h5 ">Total: {clips.length} Reviews</p>
                    </div>
                  </Row>
                </div>
                <div className="narrow-container p-2rem p-0 all-width">
                  {loading && <SlideLoader />}
                  {!loading && (
                    <ModalCarousel
                      clips={clips}
                      onChangeTab={this.handleChangeTab}
                      isShowDropdown={type !== 'profile'}
                      selectedTab={activeTab}
                    />
                  )}
                </div>
                {/* {type !== 'profile' && <hr className="m-0" />} */}

                <div className="text-muted p-2rem pt-2 pb-2 review-editor tab-content-secondary">
                  {selectedItem && (
                    <>
                      <ReviewEditForm
                        hiddenCheckBox
                        entityId={entityId}
                        clip={clipId}
                        initialData={decodeHtmlSpecialChars(reviewBody)}
                        tags={tags}
                        ref={component => {
                          if (component) {
                            const wrappedInstance = component.getWrappedInstance();
                            this.form = wrappedInstance;
                          }
                        }}
                        refetchQueries={[
                          {
                            query: GetReviews,
                            variables: this.getVariables(),
                          },
                        ]}
                        onEndSubmit={this.onEndSubmit}
                        key={entityId}
                      />
                      <div className="p-2rem pb-2 pt-0">
                        {showAlert && (
                          <AlertBox
                            type={alertType}
                            text={message}
                            onClose={this.closeAlert}
                          />
                        )}
                      </div>
                      <hr className="m-0" />
                      <div className="text-right  p-2rem ">
                        <Button
                          type="button"
                          color="danger"
                          outline
                          className="mr-4"
                          onClick={() => onCancel()}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          color="danger"
                          onClick={this.onSubmit}
                        >
                          {isUpdating && (
                            <Spinner size="sm" className="spinner-login" />
                          )}
                          {!isUpdating && 'Submit'}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
                {!selectedItem && (
                  <ModalFooter>
                    {showAlert && (
                      <AlertBox
                        type={alertType}
                        text={message}
                        onClose={this.closeAlert}
                      />
                    )}
                  </ModalFooter>
                )}
              </>
            );
          }}
        </Query>
      </div>
    );
  }
}

ReviewedTab.propTypes = {
  active: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
};

const withData = graphql(GET_VIDEO_INFO, {
  withRef: true,
  options: ({ url }) => ({
    variables: {
      url,
    },
  }),
  props: ({ data: { youtubeGetInfo } }) => {
    const info = get(youtubeGetInfo, 'info');
    if (!info) {
      return { youtubeInfo: '' };
    }
    return {
      youtubeInfo: info,
    };
  },
});

const ReviewEditForm = withData(
  withMutation(
    UpdateClip,
    withCreateMutation(
      CreateClipReview,
      withUpdateMutation(UpdateClipReview, FormReview),
    ),
  ),
);

export default withContext(ReviewedTab);
