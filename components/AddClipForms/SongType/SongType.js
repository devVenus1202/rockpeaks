import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Form, FormGroup, CustomInput, Row, Col } from 'reactstrap';
import ImageBox from '@components/Utilities/ImageBox';
import VideoDescription from '../VideoDescription';

const text1 = 'Does this clip consist of a single song, or does it contain multiple songs?';

const singleNextId = '2F';
const multiNextId = '2C';
class SongType extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: true,
    };

    const { setClipField } = props;
    setClipField('single_multi', 'single');
  }

  handleSelectSingleType = () => {
    const { setClipField } = this.props;

    setClipField('single_multi', 'single');
    this.setState({ type: true });
  };

  handleSelectMultiType = () => {
    const { setClipField } = this.props;

    setClipField('single_multi', 'multi');
    this.setState({ type: false });
  };

  handleNext = () => {
    const { type } = this.state;
    const { onNext } = this.props;
    if (type) {
      onNext(singleNextId);
    } else {
      onNext(multiNextId);
    }
  };

  render() {
    const { onNext, onBack, videoInfo, songType } = this.props;
    const { type } = this.state;

    return (
      <Form>
        <div className="form-wrapper">
          <div className="narrow-container ">
            <p className="text-muted lead mb-4">{text1}</p>
            <FormGroup>
              <CustomInput
                type="radio"
                defaultChecked={songType === 'single'}
                onClick={this.handleSelectSingleType}
                label="Single Song"
                name="songType"
                id="single-song-radio"
                inline
              />
              <CustomInput
                type="radio"
                defaultChecked={songType === 'multi'}
                onClick={this.handleSelectMultiType}
                label="Multi Song"
                name="songType"
                id="multi-song-radio"
                inline
              />
            </FormGroup>
          </div>
          <VideoDescription videoInfo={videoInfo} />
        </div>
        <div className="text-right">
          <Button className="mx-4" type="button" onClick={onBack} color="danger" outline>
            Back
          </Button>
          <Button className="ml-4" type="button" onClick={this.handleNext} color="danger">
            next
          </Button>
        </div>
      </Form>
    );
  }
}

SongType.propTypes = {
  setClipField: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  videoInfo: PropTypes.object.isRequired,
};

export default SongType;
