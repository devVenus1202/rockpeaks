import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Label, Form, FormGroup, Row, Col } from 'reactstrap';

const text1 = 'Some potential title matches for this song are shown below - click to match.';
const text2 =
  'The field below can be used to add additional information. If this clip features another artist add their name in brackets. If this is an acoustic or demo version, add that in brackets. Etc.';

class MusicTitle extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { onNext, onBack } = this.props;

    return (
      <Form>
        <div className="narrow-container form-wrapper  ">
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Song Title:</Label>
                <Input type="text" required />
              </FormGroup>
            </Col>
          </Row>
          <p className="text-muted lead mb-2">{text1}</p>
          <ul className="mb-4 text-white">
            <li>All About You (Rolling Stones, Emotional Rescue, 1980)</li>
            <li>All Down the Line (Rolling Stones, Exile on Main Street, 1972)</li>
            <li>All Sold Out (Rolling Stones, Between The Buttons, 1967)</li>
          </ul>
          <p className="text-muted lead">{text2}</p>
        </div>
        <div className="text-right">
          <Button className="mx-4" type="button" onClick={onBack} color="danger" outline>
            Back
          </Button>
          <Button className="ml-4" type="button" onClick={onNext} color="danger">
            next
          </Button>
        </div>
      </Form>
    );
  }
}

MusicTitle.propTypes = {
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default MusicTitle;
