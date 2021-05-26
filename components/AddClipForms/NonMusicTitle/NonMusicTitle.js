import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Label, Form, FormGroup, Row, Col } from 'reactstrap';

const text1 = 'For interviews, follow this format: Interview by Jools Holland';
const text2 = 'For documentaries and music films, use the name of the film.';
const text3 = 'For segments that don’t have an obvious title, enter a short description of the contents.';

class NonMusicTitle extends Component {
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
                <Label>Enter a title for this non-musical clip:</Label>
                <Input type="text" required />
              </FormGroup>
            </Col>
          </Row>
          <p className="text-muted lead">{text1}</p>
          <p className="text-muted lead">{text2}</p>
          <p className="text-muted lead">{text3}</p>
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

NonMusicTitle.propTypes = {
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default NonMusicTitle;
