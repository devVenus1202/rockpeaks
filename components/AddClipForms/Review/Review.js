import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Row, Col, Modal } from 'reactstrap';
import { withApollo, Query } from 'react-apollo';
import { get } from 'lodash';
import LoadingOverlay from 'react-loading-overlay';
import { withContext } from '@components/HOC/withContext';
import AlertBox from '@components/Utilities/AlertBox';
import ImageBox from '@components/Utilities/ImageBox';
import { getDateFromEntity } from '@helpers/dateTimeHelper';
import AddSingleClip from '@graphql/clip/AddSingleClip.graphql';
import CreatePublicClip from '@graphql/clip/CreatePublicClip.graphql';
import { decodeHtmlSpecialChars } from '@helpers/stringHelper';

import VideoDescription from '../VideoDescription';

const text1 = 'Almost there, please review your work.';
const nextId = '4B';
const sequenceId = '4C';
const singleNextId = '5A';
const failedMessage = "Sorry, something went wrong, this clip can't be saved";
const multiSongClipText = '[ multi-song clip ]';
class Review extends Component {
  state = {
    loading: false,
    message: '',
  };

  handleSaveData = () => {
    const {
      onNext,
      clipData,
      client,
      videoInfo,
      videoUrl,
      total,
      setClipField,
    } = this.props;
    const { thumbnail } = videoInfo;
    if (typeof thumbnail !== 'undefined') {
      clipData.legacy_image = thumbnail;
    }
    const next =
      total > 0 && clipData.single_multi === 'multi' ? nextId : singleNextId;

    if (clipData.single_multi === 'multi') {
      onNext(next);
      return;
    }
    if (!clipData.clip_title && clipData.descriptive_title) {
      clipData.clip_title = clipData.descriptive_title;
    }
    this.setState({ loading: true });

    client
      .mutate({
        mutation: AddSingleClip,
        variables: clipData,
      })
      .then(({ data }) => {
        const errors = get(data, 'createClip.errors', []);
        const violations = get(data, 'createClip.violations', []);
        const referencedEntities = get(
          data,
          'createClip.referenced_entities',
          [],
        );
        if (errors.length === 0 && violations.length === 0) {
          const clip = get(data, 'createClip.entity', null);
          if (clip) {
            setClipField('nid', clip.entityId);
            referencedEntities.forEach(item => {
              if (item.new === 'true') {
                setClipField(`${item.entity_bundle}_new`, true);
              }
            });
          }
          if (clip && clipData.single_multi === 'single') {
            client
              .mutate({
                mutation: CreatePublicClip,
                variables: {
                  clip_title: clip.clipTitle || '',
                  url: videoUrl,
                  parent_clip: clip.entityId,
                },
              })
              .then(({ data }) => {
                const errors = get(data, 'public_clip.errors', []);
                const violations = get(data, 'public_clip.violations', []);
                if (errors.length === 0 && violations.length === 0) {
                  if (Number(clipData.sequence) > 1) {
                    onNext(sequenceId);
                  } else {
                    onNext(next);
                  }
                  this.setState({ loading: false });
                }
              });
          } else if (
            clip &&
            clipData.single_multi === 'multi' &&
            clipData.clip_title &&
            clip.clipTitle
          ) {
            client
              .mutate({
                mutation: CreatePublicClip,
                variables: {
                  clip_title: clip.clipTitle || '',
                  url: videoUrl,
                  parent_clip: clip.entityId,
                },
              })
              .then(({ data }) => {
                const errors = get(data, 'public_clip.errors', []);
                const violations = get(data, 'public_clip.violations', []);
                if (errors.length === 0 && violations.length === 0) {
                  onNext(next);
                  this.setState({ loading: false });
                }
              });
          } else if (
            clip &&
            clipData.single_multi === 'multi' &&
            !clipData.clip_title
          ) {
            setClipField('entityId', clip.entityId);
            onNext(next);
            this.setState({ loading: false });
          } else {
            this.setState({ loading: false, message: 'Failed' });
          }
        } else {
          this.setState({ loading: false, message: 'Failed' });
        }
      });
  };

  closeAlert = () => {
    this.setState({ message: '' });
  };

  render() {
    const { onBack, videoInfo, clipData, theme } = this.props;
    const { loading, message } = this.state;
    const thumbnail = get(videoInfo, 'thumbnail', 'https://rockpeaksassets.s3.amazonaws.com/placeholders/clip-default-still-graphic.png')
    const {
      clip_title: clipTitle,
      descriptive_title: predefinedTitle,
      artist,
      show,
      field_year: fieldYear,
      field_month: fieldMonth,
      field_day: fieldDay,
      single_multi: singleMulti,
    } = clipData;

    const date = getDateFromEntity({ fieldYear, fieldMonth, fieldDay }, true);

    return (
      <LoadingOverlay active={loading} spinner text="">
        <React.Fragment>
          <div className="uploaded-file-box form-wrapper">
            <p className="text-muted lead mb-4">{text1}</p>
            <Row>
              <Col md={12} className="d-flex ">
                <div
                  className="uploaded-file-video mr-2"
                  style={{ border: '1px solid #fff' }}
                >
                  <ImageBox src={thumbnail} />
                </div>
                <div className="uploaded-file-text ml-4">
                  {singleMulti === 'multi' && (
                    <p className="mb-2">{multiSongClipText}</p>
                  )}
                  <h5 className="text-white mb-2">
                    {decodeHtmlSpecialChars(clipTitle) ||
                      decodeHtmlSpecialChars(predefinedTitle)}
                  </h5>
                  <h5 className="mb-2">{decodeHtmlSpecialChars(artist)}</h5>
                  <p className="mb-2">{decodeHtmlSpecialChars(show)}</p>
                  <p className="mb-2">{decodeHtmlSpecialChars(date)}</p>
                </div>
              </Col>
            </Row>
          </div>
          <div className="text-right">
            <Button
              className="mx-4"
              type="button"
              onClick={onBack}
              color="danger"
              outline
            >
              Back
            </Button>
            <Button
              className="ml-4"
              type="button"
              onClick={this.handleSaveData}
              color="danger"
            >
              {singleMulti === 'multi' ? 'Next' : 'Save'}
            </Button>
          </div>
          <Modal className={`alert-modal theme-${theme}`} isOpen={!!message}>
            {message && (
              <AlertBox
                type="warning"
                text={failedMessage}
                onClose={this.closeAlert}
              />
            )}
          </Modal>
        </React.Fragment>
        {/* <Form>
          <div className=" form-wrapper">
            <div className="narrow-container">
              <p className="text-muted lead">{text1}</p>
              <div className="uploaded-file-box">
                <Row>
                  <Col md={5}>
                    <div className="uploaded-file-video">
                      <ImageBox src={thumbnail} />
                    </div>
                  </Col>
                  <Col md={7}>
                    <div className="uploaded-file-text">
                      <Row className="mb-4">
                        <Col md={12}>
                          <p>Clip Title</p>
                          <h5>{clipTitle || predefinedTitle}</h5>
                        </Col>
                      </Row>
                      <Row className="mb-4">
                        <Col md={12}>
                          <p>Artist</p>
                          <h5>{artist}</h5>
                        </Col>
                      </Row>
                      <Row className="mb-4">
                        <Col md={4}>
                          <p>Show</p>
                          <p>{show}</p>
                        </Col>
                        <Col md={4}>
                          <p>Season</p>
                          <p>{season}</p>
                        </Col>
                        <Col md={4}>
                          <p>Episode</p>
                          <p>{episode}</p>
                        </Col>
                      </Row>
                      <Row className="mb-4">
                        <Col md={12}>
                          <p>Date</p>
                          <p>{date}</p>
                        </Col>
                      </Row>
                      <Row className="mb-4">
                        <Col md={6}>
                          <p>Clip Type</p>
                          <p>{clipType}</p>
                        </Col>
                        <Col md={6}>
                          <p>Clip Production</p>
                          <p>{clipProduction}</p>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
          <div className="text-right">
            <Button className="mx-4" type="button" onClick={onBack} color="danger" outline>
              Back
            </Button>
            <Button className="ml-4" type="button" onClick={this.handleSaveData} color="danger">
              Save
            </Button>
          </div>
          <Modal className={`alert-modal theme-${theme}`} isOpen={!!message}>
            {message && (
              <AlertBox
                type="warning"
                text="Adding clip is failed. Please check metadata again."
                onClose={this.closeAlert}
              />
            )}
          </Modal>
        </Form> */}
      </LoadingOverlay>
    );
  }
}

Review.propTypes = {
  clipData: PropTypes.object.isRequired,
  videoInfo: PropTypes.object.isRequired,
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default withApollo(withContext(Review));
