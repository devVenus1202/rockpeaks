import React, { Component } from 'react';
import { withApollo, Query } from 'react-apollo';
import PropTypes from 'prop-types';
import { get as _get } from 'lodash';
import { Input, Button, Form, FormGroup, Row, Col } from 'reactstrap';
import LoadingOverlay from 'react-loading-overlay';
import ImageBox from '@components/Utilities/ImageBox';
import { getDateFromEntity } from '@helpers/dateTimeHelper';
import GET_VIDEO_MATCH from '@graphql/youtube/GetVideoMatch.graphql';
import GET_VIDEO_INFO from '@graphql/youtube/GetVideoInfo.graphql';
import GET_VIDEO_INFO_DETAILS from '@graphql/youtube/GetVideoAllInfo.graphql';
import { decodeHtmlSpecialChars } from '@helpers/stringHelper';

const foundText = 'It looks like this clip is already in the system, so there’s no need to enter it again.';
const notFoundText = 'We don’t have this URL in our system.';

const nextId = '2A';
class Found extends Component {
  state = {
    isLoading: false,
  };

  constructor(props) {
    super(props);
    this.status = true;
    this.innerRef = React.createRef();
    this.publishInfo = {};
    this.videoInfo = null;
    this.loading = false;
  }

  componentDidMount() {
    this.innerRef.current.focus();
  }

  handleGotoNext = async () => {
    const { videoURL: url, client, onNext, onResult } = this.props;
    this.setState({ isLoading: true });
    // const { data } = await client.query({
    //   query: GET_VIDEO_INFO,
    //   variables: { url },
    // });

    if (this.videoInfo) {
      // const info = _get(data, 'youtubeGetInfo.info', null);
      // info.publishInfo = this.publishInfo;
      onResult(this.videoInfo);
      onNext(nextId);
    } else {
      const { data } = await client.query({
        query: GET_VIDEO_INFO,
        variables: { url },
      });
      const info = _get(data, 'youtubeGetInfo.info', {}) || {};
      info.publishInfo = this.publishInfo;
      onResult(info);
      onNext(nextId);
    }
  };

  renderFoundInfo = nid => {
    this.status = true;
    const { videoURL: url, onBack } = this.props;
    return (
      // <Query query={GET_CLIP_DETAILS} variables={{ nid }}>
      <Query query={GET_VIDEO_INFO_DETAILS} variables={{ url, nid }}>
        {({ loading, error, data }) => {
          if (loading || error) return this.renderForm('');
          let youtubInfo = _get(data, 'youtubeInfo.info', {});
          const systemInfo = _get(data, 'systemInfo', {});

          const imgUrl = _get(youtubInfo, 'thumbnail', null);
          const artist = _get(systemInfo, 'artist.entity.title', null);
          const show = _get(systemInfo, 'show.entity.title', null);
          const clipTitle = _get(systemInfo, 'title', null) || _get(systemInfo, 'clipTitle', null);
          const date = getDateFromEntity(systemInfo, true);

          if (!youtubInfo) {
            youtubInfo = {};
          }
          youtubInfo.publishInfo = systemInfo;

          this.videoInfo = youtubInfo;

          const content = (
            <React.Fragment>
              <p className="text-muted lead mb-4">{foundText}</p>
              <div className="uploaded-file-box">
                <Row>
                  <Col md={12} className="d-flex ">
                    <div className="uploaded-file-video mr-2">
                      <ImageBox src={imgUrl} />
                    </div>
                    <div className="uploaded-file-text ml-4">
                      <h5 className="text-white mb-2">{decodeHtmlSpecialChars(clipTitle)}</h5>
                      <h5 className="mb-2">{decodeHtmlSpecialChars(artist)}</h5>
                      <p className="mb-2">{decodeHtmlSpecialChars(show)}</p>
                      <p className="mb-2">{date}</p>
                    </div>
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col md={12} className="d-flex ">
                    <Button onClick={this.handleStartOver} color="danger">
                      Start over
                    </Button>
                  </Col>
                </Row>
              </div>
            </React.Fragment>
          );
          return this.renderForm(content);
        }}
      </Query>
    );
  };

  handleBack = () => {
    const { onBack, refreshURL, onStartOver } = this.props;
    refreshURL();
    onBack();
  };

  handleStartOver = () => {
    const { onStartOver } = this.props;
    onStartOver();
  };

  renderNotFound = () => {
    this.status = true;
    return (
      <React.Fragment>
        <p className="text-muted lead">{notFoundText}</p>
        <div className="text-muted lead">
          If you’ve also checked the Complete Clip List for this artist and are confident we don’t have this clip
          already, click&nbsp;
          <strong className="">NEXT</strong>
          &nbsp;below to proceed.
        </div>
      </React.Fragment>
    );
  };

  renderResult = () => {
    const { videoURL: url } = this.props;

    return (
      <Query query={GET_VIDEO_MATCH} variables={{ url }}>
        {({ loading, error, data }) => {
          if (loading) {
            return this.renderForm('');
          }
          if (error) return <div />;
          this.loading = false;
          const entity = _get(data, 'youtubeGetMatch.entity');
          if (entity) {
            const entityId = _get(data, 'youtubeGetMatch.entity.entityId');
            return this.renderFoundInfo(entityId);
          }
          return this.renderForm(this.renderNotFound());
        }}
      </Query>
    );
  };

  handleKeyDown = e => {
    if (e.keyCode === 13) {
      this.handleGotoNext();
    }
  };

  renderForm = content => {
    const { videoURL, onChangeURL, onBack } = this.props;
    const { isLoading } = this.state;
    return (
      <LoadingOverlay active={!content || isLoading} spinner text="">
        <div className="form-wrapper">
          <div className="narrow-container ">
            <FormGroup>
              <h6 className="label-title">URL:</h6>
              <Input
                type="text"
                value={videoURL}
                onChange={onChangeURL}
                required
                onKeyDown={this.handleKeyDown}
                innerRef={this.innerRef}
              />
            </FormGroup>
            <div>{content}</div>
          </div>
        </div>
        <div className="text-right">
          <Button className="mx-4" type="button" onClick={this.handleBack} color="danger" outline>
            Back
          </Button>
          <Button className="ml-4" type="button" onClick={this.handleGotoNext} color="danger">
            next
          </Button>
        </div>
      </LoadingOverlay>
    );
  };

  render() {
    return <div>{this.renderResult()}</div>;
  }
}

Found.propTypes = {
  videoURL: PropTypes.string.isRequired,
  onChangeURL: PropTypes.func.isRequired,
  onResult: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default withApollo(Found);
