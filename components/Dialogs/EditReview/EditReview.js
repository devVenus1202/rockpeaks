import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
} from 'reactstrap';
import { get as _get } from 'lodash';
import { graphql } from 'react-apollo';

import AlertBox from '@components/Utilities/AlertBox';
import { withMutation } from '@components/HOC/withMutation';
import { withCreateMutation } from '@components/HOC/withCreateMutation';
import { withUpdateMutation } from '@components/HOC/withUpdateMutation';

import UpdateClip from '@graphql/clip/UpdateClip.graphql';
import GET_VIDEO_INFO from '@graphql/youtube/GetVideoInfo.graphql';
import GetReviewsRequest from '@graphql/review/GetClipReviews.graphql';
import CreateClipReview from '@graphql/review/CreateClipReview.graphql';
import UpdateClipReview from '@graphql/review/UpdateClipReview.graphql';

import { getYoutubeUrl } from '@helpers/clipHelper';

import ModalThumbnail from '@static/images/icons/svg/Edit-Review-Button-Normal.svg';

import FormReview from './FormReview';
import './EditReview.style.scss';

const text1 =
  'A good description should offer something unique or insightful about the clip, making a short case for why it is worth watching – a sentence or two will usually suffice. Try to avoid repeating information that is already included elsewhere on the page. If there are promotional links to external pages, or extra line breaks or other textual clutter, remove those, but feel free to keep anything informative or worthwhile.';
const text2 =
  'Sometimes the description provided by the uploader is great, other times, not so much. Use your judgement, nothing is sacred.';
const text3 =
  'Below is the current state of the description for this clip. Other people may have edited it already. If you feel you can improve it, please go ahead.';
const text4 =
  'If you’re inspired and write something a bit more substantial, there is an option at the bottom of the form to include your byline with what you’ve written. This will convert the description into a proper “Review” that will be connected to your account and can’t be modified by others. It will also automatically earn you the “Reviewer” badge on the site.';

class EditReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      message: '',
      showAlert: false,
      alertType: 'success',
    };
    this.form = React.createRef();
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    if (!nextProps.isOpen) {
      // nextState.message = '';
    }
  }

  onSubmit() {
    this.setState({ loading: true });
    this.form.submit();
  }

  handleChangeTab = activeTab => () => {
    this.setState({ activeTab });
  };

  onEndSubmit = (message, type, status) => {
    const { onToggle } = this.props;
    this.setState({
      loading: false,
      message,
      showAlert: true,
      alertType: type,
    });
    if (status) {
      setTimeout(() => {
        onToggle();
      }, 500);
    }
  };

  closeAlert = () => {
    const { alertType } = this.state;
    this.setState({ showAlert: false }, () => {
      if (alertType === 'success') window.location.reload();
    });
  };

  render() {
    const { isOpen, onToggle, theme = 'dark', uid, clip, data } = this.props;
    const url = getYoutubeUrl(data);
    const { loading, message, showAlert, alertType } = this.state;

    const clipBodyProcessed = _get(data, 'body.value', '');

    return (
      <>
        <Modal
          className={`edit-review-modal theme-${theme}`}
          isOpen={isOpen}
          toggle={onToggle}
          t
        >
          <ModalHeader toggle={onToggle}>
            <img className="modal-title-icon" src={ModalThumbnail} alt="" />
            Review Clip
          </ModalHeader>
          <ModalBody className="p-0">
            <div className="p-2rem pb-0 description text-muted">
              <div className="p-2rem pb-0 pt-0">
                <p className="pb-4">{text1}</p>
                <p className="pb-4">{text2}</p>
                <p className="pb-4">{text3}</p>
                <p className="pb-0">{text4}</p>
              </div>
            </div>
            <div className="p-2rem">
              <ReviewEditForm
                uid={uid}
                clip={clip}
                url={url}
                initialData={clipBodyProcessed}
                ref={component => {
                  if (component) {
                    const wrappedInstance = component.getWrappedInstance();
                    // assert(wrappedInstance instanceof FormReview);
                    this.form = wrappedInstance;
                  }
                }}
                refetchQueries={[
                  {
                    query: GetReviewsRequest,
                    variables: {
                      filter: {
                        conditions: [
                          {
                            field: 'uid',
                            value: uid,
                            operator: 'EQUAL',
                          },
                          {
                            field: 'clip',
                            value: clip,
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
                    },
                  },
                ]}
                onEndSubmit={this.onEndSubmit}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            {/* {message && <Alert variant="primary" value={message} />} */}

            <Button
              className="ml-auto"
              color="danger"
              type="button"
              outline
              onClick={onToggle}
            >
              Cancel
            </Button>
            <Button
              color="danger"
              type="submit"
              onClick={this.onSubmit.bind(this)}
            >
              {loading && <Spinner size="sm" className="spinner-login" />}
              {!loading && 'Submit'}
            </Button>
          </ModalFooter>
        </Modal>
        <Modal className={`alert-modal theme-${theme}`} isOpen={showAlert}>
          {showAlert && (
            <AlertBox
              type={alertType}
              text={message}
              onClose={this.closeAlert}
            />
          )}
        </Modal>
      </>
    );
  }
}

EditReview.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  uid: PropTypes.string.isRequired,
  clip: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
};

const withData = graphql(GET_VIDEO_INFO, {
  withRef: true,
  options: ({ url }) => ({
    variables: {
      url,
    },
  }),
  props: ({ data: { youtubeGetInfo } }) => {
    const info = _get(youtubeGetInfo, 'info');
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

export default EditReview;
