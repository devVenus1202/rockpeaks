import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Input, Label, Row, Col, Button } from 'reactstrap';

class ArtistShow extends Component {
  render() {
    const { active } = this.props;
    const style = active ? 'tab-pane fade show active' : 'tab-pane fade';

    return (
      <div className={style}>
        <div className="narrow-container text-muted p-2rem">
          <Row>
            <Col md={8}>
              <FormGroup className="mb-0">
                <Label className="mb-3" for="title">
                  The name of this Artist or Band (For proper name, enter Lastname, Firstname) *
                </Label>
                <Input
                  type="text"
                  name="title"
                  placeholder="Joy Division"
                  required
                />
              </FormGroup>
            </Col>
          </Row>
        </div>
        <hr className="m-0" />
        <div className="narrow-container text-muted p-2rem">
          <FormGroup>
            <Row>
              <Col md={8}>
                <FormGroup className="mb-5">
                  <Label className="mb-3" for="title">
                    Enter the name of the Show this clip appeared on:
                  </Label>
                  <Input
                    type="text"
                    name="title"
                    placeholder="Promo Videos from 1988"
                    required
                  />
                </FormGroup>
              </Col>
            </Row>
            <p>
              If this clip isn't from an identifiable "Show", please use one of
              the following
            </p>
            <p>
              (1) Concert / Festival name, (2) Venue name, (3) TV Network name,
              (4) The Country or City it orginated from (in descending order of
              preference).
            </p>
            <p>
              If none of that information is known, just leave the field blank
              and it will be set to Unknown.
            </p>
            <p>Enter the relevant Season and Episode, if known:</p>
            <Row className="mt-3">
              <Col md={2}>
                <Input type="select">
                  <option> - </option>
                  <option>0</option>
                  <option>1</option>
                  <option>2</option>
                </Input>
              </Col>
              <Col md={2}>
                <Input className="ml-3" type="select">
                  <option> - </option>
                  <option>0</option>
                  <option>1</option>
                  <option>2</option>
                </Input>
              </Col>
            </Row>
          </FormGroup>
        </div>
      </div>
    );
  }
}

ArtistShow.propTypes = {
  active: PropTypes.bool.isRequired,
};

export default ArtistShow;
