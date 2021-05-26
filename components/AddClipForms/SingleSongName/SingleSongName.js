import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Label, Form, FormGroup, Row, Col } from 'reactstrap';
import ImageBox from '@components/Utilities/ImageBox';
import VideoDescription from '../VideoDescription';

const text1 = 'Do not enter any other descriptive info, such as featured performers or the style of the song.';

const nextId = '2G';
const nonMusicNextId = '3E';
class SingleSongName extends Component {
  constructor(props) {
    super(props);
    this.innerRef = React.createRef();
  }

  componentDidMount() {
    this.innerRef.current.focus();
  }

  handleChangeClipTitle = event => {
    const { setClipField } = this.props;

    setClipField('clip_title', event.target.value);
  };

  handleKeyDown = e => {
    if (e.keyCode === 13) {
      this.handleNext();
    }
  };

  handleNext = () => {
    const { onNext, type } = this.props;
    if (type !== 'Music') {
      onNext(nonMusicNextId);
    } else {
      onNext(nextId);
    }
  };

  render() {
    const { onBack, clipTitle, videoInfo } = this.props;

    return (
      <div>
        <div className="form-wrapper">
          <div className="narrow-container mb-4">
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label>Enter the title of this clip:</Label>
                  <Input
                    type="text"
                    onChange={this.handleChangeClipTitle}
                    placeholder="Title"
                    required
                    value={clipTitle}
                    onKeyDown={this.handleKeyDown}
                    innerRef={this.innerRef}
                  />
                </FormGroup>
              </Col>
            </Row>
            <div className="text-muted lead">{text1}</div>
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
      </div>
    );
  }
}

SingleSongName.propTypes = {
  setClipField: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default SingleSongName;
