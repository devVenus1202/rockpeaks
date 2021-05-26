import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, FormGroup, Input, Spinner, Label } from 'reactstrap';
import { withApollo } from 'react-apollo';

import ResetPasswordReqeust from '@graphql/user/resetUserPassword.graphql';
import { withMutation } from '@components/HOC/withMutation';
import Alert from '@components/Utilities/Alert';
import redirect from '@lib/redirect';

import './ResetPassword.style.scss';
import { login } from '@helpers/auth';
import { getProfileLink } from '@helpers/urlHelper';

class ResetPassword extends Component {
  static propTypes = {
    mutate: PropTypes.func.isRequired,
    uid: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    hash: PropTypes.string.isRequired,
  };

  state = {
    loading: false,
    password: '',
    confirmPassword: '',
    passwordMatchStatus: false,
    message: '',
  };

  constructor(props) {
    super(props);
    this.input = React.createRef();
  }

  componentDidMount() {
    this.input.current.focus();
  }

  onChangePassword = e => {
    const { confirmPassword } = this.state;
    this.setState({
      password: e.target.value,
      passwordMatchStatus: e.target.value && confirmPassword === e.target.value,
    });
  };

  onChangeConfirmPassword = e => {
    const { password } = this.state;
    this.setState({
      confirmPassword: e.target.value,
      passwordMatchStatus: e.target.value && password === e.target.value,
    });
  };

  onSubmit = async e => {
    const { password, passwordMatchStatus } = this.state;
    const { uid, timestamp, hash, mutate } = this.props;

    this.setState({ loading: true });
    mutate({
      variables: {
        uid,
        timestamp,
        hash,
        new_password: password,
      },
    }).then(async ({ data: { resetUserPassword } }) => {
      this.setState({ loading: false });
      if (resetUserPassword.entity) {
        const { entityLabel: username } = resetUserPassword.entity;
        const response = await login(this.props.client, username, password);
        console.log(response);
        if (!response.error) {
          try {
            const publicProfileUrl = getProfileLink(response.userInfo.uname, response.userInfo.uid);
            window.location.href = `${publicProfileUrl}?resetPassword=1`;
          } catch (err) {
            console.log(err);
            window.location.href = '/welcome';
          }
        } else {
          this.setState({ loading: false });
        }
      } else {
        this.setState({
          message:
            'You have tried to use a one-time login link that has either been used or is no longer valid.',
        });
      }
    });
  };

  render() {
    const { loading, message, password, confirmPassword, passwordMatchStatus } = this.state;
    return (
      <div className="reset">
        <div className="mask">
          <Form className="reset-form">
            <p className="mb-3 h6 text-center ">Almost there... please set your password</p>
            <FormGroup>
              <Input
                type="password"
                id="userid"
                placeholder="Password"
                onChange={this.onChangePassword}
                required
                innerRef={this.input}
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="password"
                id="confirmPassword"
                placeholder="Confirm Password"
                onChange={this.onChangeConfirmPassword}
                required
              />
            </FormGroup>

            <FormGroup className="mb-2">
              <Label>Password Match:</Label>
              <>
                <Label className="passwordStatus">
                  <b>{passwordMatchStatus ? 'Yes' : 'No'}</b>
                </Label>
              </>
            </FormGroup>

            <div className="mb-5">{message && <Alert variant="primary" value={message} />}</div>
            <Button
              className="btn btn-danger mb-5"
              disabled={!passwordMatchStatus}
              onClick={this.onSubmit}
              type="button"
            >
              {loading && <Spinner size="sm" className="spinner-login" />}
              {!loading && 'Set Password'}
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}
export default withApollo(withMutation(ResetPasswordReqeust, ResetPassword));
