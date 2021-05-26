import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Input, Button, Label, Spinner } from 'reactstrap';
import { get } from 'lodash';

import Alert from '@components/Utilities/Alert';
import { withUpdateMutation } from '@components/HOC/withUpdateMutation';

import CHANGEPASSWORD_REQUEST from '@graphql/user/changePassword.graphql';

class PasswordForm extends Component {
  static propTypes = {
    updateAction: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    onCompleted: PropTypes.func.isRequired,
  };

  state = {
    currentPassword: '',
    password: '',
    password2: '',
    passwordMessage: '',
    passwordMatchStatus: false,
    loading: false,
  };

  onChangePassword = e => {
    const { password2 } = this.state;
    this.setState({
      password2: e.target.value,
      passwordMatchStatus: password2 === e.target.value,
    });
    this.setState({ password: e.target.value });
  };

  onChangePassword2 = e => {
    const { password } = this.state;
    this.setState({
      password2: e.target.value,
      passwordMatchStatus: password === e.target.value,
    });
  };

  onChangeCurrentPassword = e=>{
    this.setState({ currentPassword: e.target.value });
  }

  updatePassword = () => {
    const { updateAction, user, onCompleted } = this.props;
    const { password } = this.state;
    this.setState({ loading: true });
    updateAction({
      variables: {
        currentPassword: user.password,
        newPassword: password,
      },
    })
      .then(({ data }) => {
        const errors = get(data, 'updateUserPassword.errors', []);
        const violations = get(data, 'updateUserPassword.violations', []);
        let message = null;
        if (errors[0]) {
          message = errors.map(error => <Alert variant="info" value={error} />);
        }
        if (violations[0]) {
          message = violations.map(v => <Alert variant="info" value={v.message} />);
        }
        if (!message) message = <Alert variant="info" value="Password successfully updated" />;
        this.setState({ loading: false, message });
        onCompleted();
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  };

  render() {
    const { password, password2, message, passwordMatchStatus, loading } = this.state;

    return (
      <div className="narrow-container text-muted p-2rem smaller-width">
        <p className="mb-6">Only enter your password if you want to change it</p>
        <br />

        <FormGroup className="mb-4">
          <Label for="settingInput">Current Password:</Label>
          <Input
            type="password"
            name="oldPassword"
            id="oldPassword"
            onChange={this.onChangeOldPassword}
          />
        </FormGroup>
        <FormGroup className="mb-4">
          <Label for="settingInput">New Password:</Label>
          <Input
            type="password"
            name="password"
            id="settingpassword"
            onChange={this.onChangePassword}
          />
        </FormGroup>
        <FormGroup className="mb-4">
          <Label for="confirmPassword">Confirm password:</Label>
          <Input
            type="password"
            name="confirm_password"
            id="setting_confirm_password"
            onChange={this.onChangePassword2}
          />
        </FormGroup>

        {/* {data &&
          data.updateUserPassword.violations.map(item => {
            return <Alert variant="danger" value={item.message} />;
          })}
        {data && data.updateUserPassword.violations.length === 0 && (
          <Alert variant="info" value="Password successfully updated" />
        )} */}
        {(password || password2) && (
          <FormGroup className="mb-4">
            <Label>Password Match:</Label>
            <Label className="passwordStatus">
              <b>{passwordMatchStatus ? 'Yes' : 'No'}</b>
            </Label>
          </FormGroup>
        )}
        {message}
        <FormGroup className="mb-4">
          <Button className="ml-auto" color="danger" type="button" onClick={this.updatePassword}>
            {loading && <Spinner size="sm" className="spinner-login" />}
            {!loading && 'Change Password'}
          </Button>
        </FormGroup>
      </div>
    );
  }
}

export default withUpdateMutation(CHANGEPASSWORD_REQUEST, PasswordForm);
