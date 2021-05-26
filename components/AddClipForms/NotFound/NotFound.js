import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Form } from 'reactstrap';

const text1 = 'We don’t have this URL in our system.';

class NotFound extends Component {
  constructor(props) {
    super(props);

    this.state = {
      videoURL: '',
    };
  }

  onChangeURL = event => {
    this.setState({ videoURL: event.target.value });
  };

  render() {
    const { onNext, onBack } = this.props;
    const { videoURL } = this.state;
    return (
      <Form>
        <div className="narrow-container form-wrapper">
          <div className="form-group">
            <p>URL</p>
            <Input type="text" value={videoURL} onChange={this.onChangeURL} required />
          </div>
          <p className="text-muted lead">{text1}</p>
          <p className="text-muted lead">
            If you’ve also checked the Complete Clip List for this artist and are confident we don’t have this clip
            already, click&nbsp;
            <a className="text-white" href="#0">
              NEXT
            </a>
            &nbsp;below to proceed.
          </p>
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

NotFound.propTypes = {
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default NotFound;
