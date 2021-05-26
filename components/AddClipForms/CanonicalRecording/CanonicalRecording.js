import React, { Component } from 'react';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import { Button, Form, FormGroup, Row, Col } from 'reactstrap';
import AutoComplete from '@components/Utilities/AutoComplete';
import GET_AUTOCOMPLETE from '@graphql/search/AutoCompleteCanonical.graphql';

import CheckedIcon from '@static/images/icons/svg/Checked-Circle-Icon-Normal.svg';
import VideoDescription from '../VideoDescription';

const text1 =
  'Enter the name of the Canonical Recording.  Please wait for the system to suggest a match before hitting ';
const nextId = '3E';

class CanonicalRecording extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.canonicalRecordingLabel || '',
      canonicalId: props.canonicalRecording || '0',
      isMatched: Number(props.canonicalRecording) != 0,
    };
    this.prevItems = [];
  }

  handleGotoNext = () => {
    const { setClipField, onNext } = this.props;
    const { value, canonicalId } = this.state;

    setClipField('canonical_recording_label', value);
    setClipField('canonical_recording', canonicalId);
    onNext(nextId);
  };

  handleChangeCanonicalRecording = value => {
    this.setState({ value, isMatched: false });
  };

  selectItem = item => {
    this.setState({ isMatched: true, value: item.value, canonicalId: item.id });
  };

  renderAutoComplete = () => {
    const { value, isMatched } = this.state;
    const { canonicalRecording, artist } = this.props;

    const variables = {
      target_type: 'node',
      bundle: 'canonical_recording',
      string: value,
      artist_id: artist || '0',
    };

    return (
      <Query query={GET_AUTOCOMPLETE} variables={variables}>
        {({ loading, error, data }) => {
          let items;
          if (loading || error) items = this.prevItems;
          else if (data) {
            if (isMatched && this.prevItems.length > 0) {
              items = this.prevItems;
            } else {
              items = data.autocomplete;
              this.prevItems = items;
            }
          }

          return (
            <AutoComplete
              items={items}
              loading={!!value && loading && !isMatched}
              onChange={this.handleChangeCanonicalRecording}
              value={value}
              onSelect={this.selectItem}
            />
          );
        }}
      </Query>
    );
  };

  render() {
    const { onBack, videoInfo } = this.props;
    const { isMatched } = this.state;
    return (
      <Form>
        <div className="form-wrapper">
          <div className="narrow-container ">
            <p className="text-muted lead mb-4">
              {text1}
              <strong className="">NEXT.</strong>
            </p>
            <Row>
              <Col md={6}>
                <FormGroup>{this.renderAutoComplete()}</FormGroup>
              </Col>
              <Col md={1}>{isMatched && <img className="checkIcon" src={CheckedIcon} />}</Col>
            </Row>
            <div className="text-muted lead">
              <b>If no matches come up, please leave this field blank for now.</b>
            </div>
          </div>
          <VideoDescription videoInfo={videoInfo} />
        </div>
        <div className="text-right">
          <Button className="mx-4" type="button" onClick={onBack} color="danger" outline>
            Back
          </Button>
          <Button className="ml-4" type="button" onClick={this.handleGotoNext} color="danger">
            next
          </Button>
        </div>
      </Form>
    );
  }
}

CanonicalRecording.propTypes = {
  setClipField: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  canonicalRecording: PropTypes.string.isRequired,
};

export default CanonicalRecording;
