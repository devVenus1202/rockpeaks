import React from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import Router from 'next/router';
import { get } from 'lodash';
import { Modal, Button, Form, FormGroup, Input, CustomInput, Spinner } from 'reactstrap';
import REQUEST_SIGNUP from '../../graphql/user/newUser.graphql';
import { login } from '../../helpers/auth';
import SocialButtons from './SocialButtons';
import Brand from '../Header/Brand';
import './Sign.style.scss';
import { Messages } from '../../locales/en/Messages';
import Alert from '../Utilities/Alert';
import ResetPasswordForm from './ResetPasswordForm';

class Sign extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: 'xxxx@mail.com',
      username: 'xxxx',
      password: 'xxxx',
      confirmPassword: '',
      loading: false,
      messages: [],
      loginMessage: [],
      signupMessage: [],
      fogotMessage: [],
    };
    this.loginEmailInput = React.createRef();
    this.signUpEmailInput = React.createRef();
  }

  onSign = () => {
    const { type } = this.props;
    const { loading } = this.state;
    if (loading) return;
    this.setState({ loading: true, signupMessage: [], loginMessage: [] });
    if (type === 0) {
      this.handleLogin();
      // Login Action
    } else if (type === 1) {
      this.handleSignup();
    } else {
      this.handleRetreivePassword();
    }
  };

  handleLogin = async () => {
    const { username, password } = this.state;
    const { isSso } = this.props;
    const response = await login(this.props.client, username, password);
    if (!response.error) {
      if (isSso) {
        window.location.href = 'https://forum.rockpeaks.com/session/sso';
      } else {
        window.location.reload();
      }
    } else {
      this.setState({ loading: false });
      const messages = [{ message: Messages.loginError }];
      this.setState({ loginMessage: messages });
    }
  };

  handleSignup = async () => {
    const { username, password, confirmPassword, email } = this.state;
    let signupMessage = [];
    let loginMessage = [];
    // if (password !== confirmPassword) {
    //   signupMessage = [{ message: 'Passwords are not matched.' }];
    //   this.setState({
    //     signupMessage,
    //     loading: false,
    //   });
    //   return;
    // }
    try {
      const response = await this.props.client.mutate({
        mutation: REQUEST_SIGNUP,
        variables: {
          name: username,
          mail: email,
          pass: password,
        },
      });
      signupMessage = get(response, 'data.createUser.violations', []);
    } catch (e) {
      signupMessage = [{ message: Messages.registerError }];
    }

    if (signupMessage.length === 0) {
      loginMessage = [
        {
          message: Messages.registerSuccess,
        },
      ];
      // this.toLoginForm();
      this.toEmailConfirmDialog();
    }
    this.setState({
      loginMessage,
      signupMessage,
      loading: false,
    });
  };

  onChangeUsername = e => {
    this.setState({ username: e.target.value });
  };

  onChangeEmail = e => {
    this.setState({ email: e.target.value });
  };

  onChangePassword = e => {
    this.setState({ password: e.target.value });
  };

  onChangeConfirmPassword = e => {
    this.setState({ confirmPassword: e.target.value });
  };

  onRetrevePassword = () => {
    const { email } = this.state;
    if (!email) {
      const fogotMessage = [{ message: 'Please input password' }];
      this.setState({ fogotMessage });
      return;
    }
    const loginMessage = [
      {
        message: 'You will receive an email with instructions about how to reset your password in a few minutes.',
      },
    ];

    this.setState({ loginMessage });
    this.toLoginForm();
  };

  onOpened = () => {
    if (this.loginEmailInput.current) {
      this.loginEmailInput.current.select();
      this.loginEmailInput.current.focus();
    }
    if (this.signUpEmailInput.current) {
      this.signUpEmailInput.current.select();
      this.signUpEmailInput.current.focus();
    }
  };

  switchDialog = () => {
    this.setState({ messages: [] });
    this.changeType();
  };

  changeType = () => {
    this.props.changeType();
  };

  toLoginForm = () => {
    this.props.changeType(0);
  };

  toSignupForm = () => {
    this.props.changeType(1);
  };

  toForgotForm = () => {
    this.props.changeType(2);
  };

  toEmailConfirmDialog = () => {
    this.props.changeType(3);
  };

  renderSingupForm = () => {
    const { loading } = this.state;
    return (
      <Form autoComplete="on" onSubmit={this.onSign}>
        <FormGroup>
          <Input
            type="email"
            id="email"
            placeholder="Email"
            autoFocus
            onChange={this.onChangeEmail}
            innerRef={this.signUpEmailInput}
            required
          />
        </FormGroup>
        <FormGroup>
          <Input type="text" id="userid" placeholder="Username" onChange={this.onChangeUsername} required />
        </FormGroup>

        {/* <FormGroup>
          <Input
            type="password"
            id="password"
            placeholder="Password"
            onChange={this.onChangePassword}
            required
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
        </FormGroup> */}
        <Button className="btn btn-danger mb-5" onClick={this.onSign} type="button">
          {loading && <Spinner size="sm" className="spinner-login" />}
          {!loading && 'Sign Up'}
        </Button>
      </Form>
    );
  };

  renderSigninForm = () => {
    const { loading } = this.state;
    return (
      <Form>
        <FormGroup>
          <Input
            type="text"
            id="userid"
            placeholder="Username or Email"
            onChange={this.onChangeUsername}
            required
            autoFocus
            defaultValue=""
            innerRef={this.loginEmailInput}
          />
        </FormGroup>
        <FormGroup>
          <Input
            type="password"
            id="password"
            placeholder="Password"
            onChange={this.onChangePassword}
            onKeyUp={e => {
              if (e.keyCode === 13) {
                this.onSign();
              }
            }}
            required
          />
        </FormGroup>
        <Button className="btn btn-danger mb-5" onClick={this.onSign} type="button">
          {loading && <Spinner size="sm" className="spinner-login" />}
          {!loading && 'Log In'}
        </Button>
      </Form>
    );
  };

  renderForgotPasswordForm() {
    const { loading, fogotMessage } = this.state;
    return (
      <ResetPasswordForm toLoginForm={this.toLoginForm.bind(this)} message={fogotMessage} />
      // <Form>
      //   <p className="mb-3 h6 text-center ">
      //     <a
      //       className="text-muted switch-link"
      //       aria-label="Fogot Password"
      //       onClick={this.toLoginForm.bind(this)}
      //     >
      //       Forgot Password?
      //     </a>
      //   </p>
      //   <FormGroup>
      //     <Input
      //       type="text"
      //       id="userid"
      //       placeholder="Email"
      //       onChange={this.onChangeUsername.bind(this)}
      //       required
      //     />
      //   </FormGroup>
      //   <div className="mb-5">
      //     {fogotMessage.map((item, key) => (
      //       <p className="mb-0 h6" dangerouslySetInnerHTML={{ __html: item.message }} />
      //     ))}
      //   </div>
      //   <Button className="btn btn-danger mb-5" onClick={this.onRetrevePassword} type="button">
      //     {loading && <Spinner size="sm" className="spinner-login" />}
      //     {!loading && 'EMAIL ME INSTRUCTIONS'}
      //   </Button>
      // </Form>
    );
  }

  renderEmailConfirm() {}

  renderingForm(type) {
    switch (type) {
      case 0:
        return this.renderSigninForm();
      case 1:
        return this.renderSingupForm();
      case 2:
        return this.renderForgotPasswordForm();
      case 3:
        return '';
      default:
        return '';
    }
  }

  renderingDialog(type) {
    const { signupMessage, loginMessage } = this.state;
    switch (type) {
      case 0:
        return (
          <>
            <div className="mb-5">
              {loginMessage.map((item, key) => (
                <Alert variant="primary" value={item.message} />
              ))}
            </div>
            <div className="login-delimiter mb-5">
              <span>or</span>
            </div>
            <SocialButtons type={type} />
            <React.Fragment>
              <p className="h6 mb-3 text-left pl-5">
                <a onClick={this.toSignupForm.bind(this)} className="text-muted switch-link" aria-label="Signup">
                  Don't have an account? Get started!
                </a>
              </p>
              <p className="mb-0 h6 text-left pl-5">
                <a
                  className="text-muted switch-link"
                  aria-label="Fogot Password"
                  onClick={this.toForgotForm.bind(this)}
                >
                  Forgot Password?
                </a>
              </p>
            </React.Fragment>
          </>
        );
      case 1:
        return (
          <>
            <div className="mb-5">
              {signupMessage.map((item, key) => (
                <Alert variant="primary" value={item.message} />
              ))}
            </div>
            <div className="login-delimiter mb-5">
              <span>or</span>
            </div>

            <SocialButtons type={type} />
            <p className="mb-0 h6">
              <a onClick={this.toLoginForm.bind(this)} className="text-muted switch-link" aria-label="Close">
                Alredy registered? Log In!
              </a>
            </p>
          </>
        );
      case 2:
        return <></>;
      case 3:
        return (
          <div className="mb-5">
            {loginMessage.map((item, key) => (
              <Alert variant="primary" value={item.message} />
            ))}
          </div>
        );
      default:
        return '';
    }
  }

  render() {
    const { isOpen, type, toggle, theme } = this.props;
    const { messages } = this.state;
    return (
      <Modal
        className={`sign-modal theme-${theme || 'dark'}`}
        isOpen={isOpen}
        toggle={toggle('opened')}
        onOpened={this.onOpened}
      >
        <div className="modal-header">
          <Brand className="brand" theme={theme} />
          <button className="close" onClick={toggle('opened')} type="button">
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className="modal-body text-center">
          <div className="mb-5" />
          {this.renderingForm(type)}
          {messages.length > 0 && (
            <div className="mb-5">
              {messages.map((item, key) => (
                <p className="mb-0 h6" dangerouslySetInnerHTML={{ __html: item.message }} />
              ))}
            </div>
          )}
          {this.renderingDialog(type)}
        </div>
      </Modal>
    );
  }
}

Sign.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  changeType: PropTypes.func.isRequired,
  type: PropTypes.number.isRequired,
  theme: PropTypes.string.isRequired,
};

export default withApollo(Sign);
