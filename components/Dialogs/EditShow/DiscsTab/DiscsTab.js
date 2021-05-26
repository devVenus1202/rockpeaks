import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Input, Label, Row, Col, Button } from 'reactstrap';

class DiscsTab extends Component {
  render() {
    const { active } = this.props;
    const style = active ? 'tab-pane fade show active' : 'tab-pane fade';

    return (
      <div className={style}>
        <div className="narrow-container text-muted p-2rem">
          <p className="h6 mb-4">
            This clip can be found on the following Disc(s):
          </p>
          <h6 className="mb-4">
            <a className="text-warning" href="#">
              Joy Division - Live in Paris 1979
            </a>
          </h6>
          <p className="h6 mb-0">
            (Click the title name to edit that disc)
          </p>
        </div>

        <hr className="m-0" />
        <div className="narrow-container text-muted p-2rem">
          <p className="h6 mb-0">
            To create a new disc with clips by this Artist, click
            &nbsp;<a className="text-warning" href="#0">here</a>
            &nbsp;and follow the steps to populate it.
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
