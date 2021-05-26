import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Form } from 'reactstrap';
import { throwServerError } from 'apollo-link-http-common';
import GET_VIDEO_INFO from '@graphql/youtube/GetVideoInfo.graphql';
import { withApollo, Query } from 'react-apollo';
import { get } from 'lodash';
import LoadingOverlay from 'react-loading-overlay';

const text1 =
  'If the clip you’re adding is from a sharing site like YouTube, pasting the URL into the field above is a fast way to check if this particular copy of a clip is in the system.';
const text2 =
  'If you’re adding from your own collection and not from YouTube, and have confirmed that we don’t already have a record for this clip, then just click SKIP below to proceed.';
const nextId = '1B';
const skipNextId = '2A';
class EmbedCode extends Component {
  state = {
    disabled: false,
    url: '',
    isLoading: false,
  };

  constructor(props) {
    super(props);
    this.innerRef = React.createRef();
    this.state = {
      url: props.videoURL,
    };
  }

  componentDidMount() {
    this.innerRef.current.focus();
  }

  onChangeURL = e => {
    const { onChangeURL } = this.props;
    onChangeURL(e);
    if (e.target.value) {
      this.setState({ url: e.target.value, disabled: false });
    } else {
      this.setState({ url: e.target.value, disabled: true });
    }
  };

  handleKeyDown = e => {
    if (e.keyCode === 13) {
      const { onNext } = this.props;
      onNext(nextId);
    }
  };

  gotoSkip = async () => {
    const { onNext, client, onResult, refreshURL } = this.props;
    const { url } = this.state;
    this.setState({ isLoading: true });
    const { data } = await client.query({
      query: GET_VIDEO_INFO,
      variables: { url },
    });
    this.setState({ isLoading: false });
    const info = get(data, 'youtubeGetInfo.info', {}) || {};
    info.publishInfo = {};
    onResult(info);
    onNext(skipNextId);
  };

  render() {
    const { disabled, isLoading } = this.state;
    const { videoURL, onNext } = this.props;
    return (
      <div>
        <LoadingOverlay active={isLoading} spinner text="">
          <div className="narrow-container form-wrapper form-wrapper">
            <div className="form-group">
              <h6 className="label-title">URL:</h6>
              <Input
                type="text"
                value={videoURL}
                onChange={this.onChangeURL}
                required
                onKeyDown={this.handleKeyDown}
                innerRef={this.innerRef}
              />
            </div>
            <p className="text-muted lead">{text1}</p>
            <div className="text-muted lead">
              If you’re adding from your own collection and not from YouTube, and have confirmed that we don’t already
              have a record for this clip, then just click&nbsp;
              <strong className="">SKIP</strong>
              &nbsp;below to proceed.
            </div>
          </div>
          <div className="text-right">
            <Button type="button" onClick={this.gotoSkip} color="danger" className="mx-4">
              skip
            </Button>
            <Button
              type="button"
              onClick={() => {
                onNext(nextId);
              }}
              color="danger"
              disabled={disabled}
              className="ml-4"
            >
              next
            </Button>
          </div>
        </LoadingOverlay>
      </div>
    );
  }
}

EmbedCode.propTypes = {
  videoURL: PropTypes.string.isRequired,
  onChangeURL: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default withApollo(EmbedCode);
