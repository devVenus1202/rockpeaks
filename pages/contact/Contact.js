import React from 'react';
import App from '@components/App';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { Mutation } from 'react-apollo';
import _ from 'lodash';
import CREATE_CONTACT_MESSAGE from '@graphql/contact/CreateContactMessage.graphql';
import './Contact.style.scss';

class Contact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      mail: '',
      subject: '',
      message: '',
      formSubmitted: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleSubmit(event) {
    this.setState({ formSubmitted: true });
    event.preventDefault();
  }

  render() {
    const { name, mail, subject, message, formSubmitted } = this.state;

    const thankYou = 'Thank you! The form has been sent successfully.';

    return (
      <App>
        <article className="contact-form-wrapper">
          <Mutation mutation={CREATE_CONTACT_MESSAGE}>
            {(createContactMessage, { data, loading, error }) => (
              <div>
                <h2 className="text-center pt-4 font-weight-bolder">
                  Contact Us
                </h2>
                <p className="text-center mb-2rem">
                  Email all enquiries to editor [at] rockpeaks.com or just use
                  the feedback form below:
                </p>
                <p className="text-center pt-4 pb-5 mb-0">
                  {loading && 'Loading...'}
                  {error && 'Error :( Please try again'}
                  {_.get(data, 'createContactMessage.status.code', null)
                    === '0' && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: _.get(data, 'createContactMessage.errors', ''),
                      }}
                    />
                  )}
                </p>

                {_.get(data, 'createContactMessage.status.code', null)
                  !== '1' && (
                  <Form
                    className="contact-form"
                    onSubmit={e => {
                      e.preventDefault();
                      this.setState({ formSubmitted: true });
                      createContactMessage({
                        variables: {
                          name,
                          mail,
                          subject,
                          message,
                        },
                      });
                    }}
                  >
                    <FormGroup>
                      <Input
                        required
                        type="text"
                        name="name"
                        placeholder="Your name"
                        value={name}
                        onChange={this.handleChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Input
                        required
                        type="email"
                        name="mail"
                        placeholder="Email"
                        value={mail}
                        onChange={this.handleChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Input
                        required
                        type="text"
                        name="subject"
                        placeholder="Subject"
                        value={subject}
                        onChange={this.handleChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Input
                        required
                        type="textarea"
                        name="message"
                        placeholder="Message"
                        value={message}
                        onChange={this.handleChange}
                      />
                    </FormGroup>
                    <FormGroup className="text-center mb-0">
                      <Button className="btn-danger">SUBMIT</Button>
                    </FormGroup>
                  </Form>
                )}
                <p className="thank-you text-center pt-4 pb-5 mb-0">
                  {_.get(data, 'createContactMessage.status.code', null)
                    === '1' && thankYou}
                </p>
              </div>
            )}
          </Mutation>
        </article>
      </App>
    );
  }
}

export default Contact;
