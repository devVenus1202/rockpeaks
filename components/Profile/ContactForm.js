import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Form, FormGroup, Input, Button, Spinner } from 'reactstrap';

export default class ContactForm extends Component {
  static propTypes = {
    user: PropTypes.string.isRequired,
  };

  sendMessage = () => {};

  render() {
    const { user, email } = this.props;
    return (
      <div className="narrow-container  smaller-width">
        <h1>Contact</h1>
        <div className="mb-5">
          Send
          {user}
          {' '}
a private message using the form below:
        </div>
        <Form>
          <FormGroup className="mb-5">
            <Input type="text" name="name" placeholder="Your name" id="settingName" required value={user} />
          </FormGroup>
          <FormGroup className="mb-5">
            <Input type="email" name="email" placeholder="Your email" id="settingEmail" required value={email} />
          </FormGroup>
          <FormGroup className="mb-5">
            <Input type="text" name="subject" placeholder="Subject" id="settingSubject" />
          </FormGroup>
          <FormGroup className="mb-5">
            <Input type="textarea" name="message" placeholder="Message" id="settingMessage" required />
          </FormGroup>
          <FormGroup className="mb-5 d-flex justify-content-end">
            <Button className="ml-auto" color="danger" type="button" onClick={this.sendMessage}>
              Send
            </Button>
          </FormGroup>
        </Form>
      </div>
    );
  }
}
