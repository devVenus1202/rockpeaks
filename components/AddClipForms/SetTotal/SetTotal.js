import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { range as _range } from 'lodash';
import { Input, Button, Form, FormGroup, Row, Col } from 'reactstrap';
import ImageBox from '@components/Utilities/ImageBox';
import VideoDescription from '../VideoDescription';

const text1 = 'Using the listbox below, select the total number of songs included in the video at this URL.';
const text2 =
  'At the end of this process you will be able to enter any remaining information about this sequence of clips, including the titles of each song and their in and out points.';

const nextId = '3A';
class SetTotal extends Component {
  handleChangeSequence = event => {
    const { setEditData } = this.props;
    setEditData('total', event.target.value);
  };

  render() {
    const { onNext, onBack, videoInfo, total } = this.props;

    return (
      <Form>
        <div className="form-wrapper">
          <div className="narrow-container">
            <p className="text-muted lead">{text1}</p>
            <p className="text-muted lead">{text2}</p>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Input type="select" onChange={this.handleChangeSequence} className="smaller-select" value={total}>
                    {_range(2, 99).map(num => (
                      <option value={num} key={num}>
                        {num}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>
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

SetTotal.propTypes = {
  setEditData: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  videoInfo: PropTypes.object.isRequired,
};

export default SetTotal;
