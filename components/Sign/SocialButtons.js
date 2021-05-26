import React, { Component } from 'react';
import { Button } from 'reactstrap';

export default class SocialButtons extends Component {
  render() {
    const { type } = this.props;
    return (
      <div className="login-social-btn-container">
        <Button className="btn btn-lg btn-facebook">
          <i className="fa fa-facebook social-btn-icon" aria-hidden="true" />
          {type === 0 ? 'Log In ' : 'Sign Up '}
          {' '}
with Facebook
        </Button>
        <Button className="btn btn-lg btn-twitter">
          <i className="fa fa-twitter social-btn-icon" aria-hidden="true" />
          {type === 0 ? 'Log In ' : 'Sign Up '}
          {' '}
with Twitter
        </Button>
        {/* <Button className="btn btn-lg btn-google-plus">
          <i
            className="fa fa-google-plus social-btn-icon"
            aria-hidden="true"
          />
          Log In with Google+
        </Button> */}
      </div>
    );
  }
}
