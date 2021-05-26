import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Input, Label, Row, Col } from 'reactstrap';

class DiscsTab extends Component {
  render() {
    const { active } = this.props;
    const style = active ? 'tab-pane fade show active' : 'tab-pane fade';

    return (
      <div className={style}>
        <div className="narrow-container text-muted p-2rem">
          <p className="h6 mb-4">This clip can be found on the following Disc(s):</p>
          <h6 className="mb-4">
            <a className="text-warning" href="#">
              Joy Division - Live in Paris 1979
            </a>
          </h6>
          <p className="h6 mb-0">(Click the title name to edit that disc)</p>
        </div>
        <hr className="m-0" />
        <div className="narrow-container text-muted p-2rem">
          <Row>
            <Col md={8}>
              <FormGroup>
                <Label className="mb-3" for="title">
                  To add it to another Disc, first search our library and click on the matching Disc
                  title if it comes up.
                </Label>
                <Input type="text" name="title" placeholder="Canonical Recording" required />
              </FormGroup>
            </Col>
          </Row>
          <p className="h6 mb-0">
            Otherwise, click &nbsp;
            <a className="text-warning" href="#0">
              here
            </a>
            &nbsp;and follow the steps to create and populate a new disc.
          </p>
        </div>
      </div>
    );
  }
}

DiscsTab.propTypes = {
  active: PropTypes.bool.isRequired,
};

export default DiscsTab;
