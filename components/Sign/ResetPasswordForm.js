import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, FormGroup, Input, Spinner } from 'reactstrap';

import { withMutation } from '@components/HOC/withMutation';
import Alert from '@components/Utilities/Alert';

import RequestResetPassword from '@graphql/user/requestResetPassword.graphql';

class ResetPasswordForm extends Component {
  static propTypes = {
    toLoginForm: PropTypes.func.isRequired,
    mutate: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      name: '',
      message: '',
    };
    this.input = React.createRef();
  }

  componentDidUpdate() {
    this.input.current.focus();
  }

  onChangeUsername = e => {
    this.setState({ name: e.target.value });
  };

  onRetrevePassword = () => {
    const { name } = this.state;
    const { mutate } = this.props;
    this.setState({ loading: true });
    mutate({ variables: { name } }).then(({ data: { requestResetUserPassword }, errors }) => {
      this.setState({ loading: false });
      if (requestResetUserPassword) {
        this.setState({ message: requestResetUserPassword.message });
      } else if (errors) {
        this.setState({ message: errors[0].message });
      }
    });
  };

  render() {
    const { loading, message } = this.state;
    const { toLoginForm } = this.props;
    return (
      <Form>
        <p className="mb-3 h6 text-center ">
          <a className="text-muted switch-link" aria-label="Fogot Password" onClick={toLoginForm}>
            Forgot Password?
          </a>
        </p>
        <FormGroup>
          <Input
            type="text"
            id="userid"
            placeholder="Email"
            onChange={this.onChangeUsername.bind(this)}
            required
            innerRef={this.input}
          />
        </FormGroup>
        <div className="mb-5">{message && <Alert variant="primary" value={message} />}</div>
        <Button className="btn btn-danger mb-5" onClick={this.onRetrevePassword} type="button">
          {loading && <Spinner size="sm" className="spinner-login" />}
          {!loading && 'EMAIL ME INSTRUCTIONS'}
        </Button>
      </Form>
    );
  }
}
export default withMutation(RequestResetPassword, ResetPasswordForm);
