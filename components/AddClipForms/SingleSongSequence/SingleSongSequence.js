import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { range as _range } from 'lodash';
import { Input, Button, Form, FormGroup, Row, Col } from 'reactstrap';
import ImageBox from '@components/Utilities/ImageBox';
import VideoDescription from '../VideoDescription';

const text1 =
  'If this clip is the first in a sequence of clips (i.e. from a concert or other live event) then you can save data entry time by selecting the total number of sequenced clips now.';
const text2 = 'Leave it at the default (zero) if this is a single stand-alone clip.';

const nextId = '3A';
class SingleSongSequence extends Component {
  handleChangeSequence = event => {
    const { setClipField } = this.props;
    setClipField('sequence', event.target.value);
  };

  render() {
    const { onNext, onBack, videoInfo, sequence } = this.props;

    return (
      <Form>
        <div className="form-wrapper">
          <div className="narrow-container">
            <p className="text-muted lead">{text1}</p>
            <Row className="mt-4">
              <Col md={6}>
                <FormGroup>
                  <Input type="select" onChange={this.handleChangeSequence} className="smaller-select" value={sequence}>
                    {_range(99).map(num => (
                      <option value={num} key={num}>
                        {num}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <p className="text-muted lead">{text2}</p>
          </div>
          <VideoDescription videoInfo={videoInfo} />
        </div>
        <div className="text-right">
          <Button className="mx-4" type="button" onClick={onBack} color="danger" outline>
            Back
          </Button>
          <Button className="ml-4" type="button" onClick={() => onNext(nextId)} color="danger">
            next
          </Button>
        </div>
      </Form>
    );
  }
}

SingleSongSequence.propTypes = {
  setClipField: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  videoInfo: PropTypes.object.isRequired,
};

export default SingleSongSequence;
