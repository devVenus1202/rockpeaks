import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Form, FormGroup, Input, Label, Button, Modal, Spinner } from 'reactstrap';
import ConnectPlexAccount from '@graphql/plex/ConnectPlexAccount.graphql';
import { withMutation } from '@components/HOC/withMutation';
import { get } from 'lodash';
import AlertBox from '@components/Utilities/AlertBox';

class Connect extends Component {
  state = {
    username: '',
    password: '',
    isLoading: false,
  };

  handleChangeUsername = e => {
    this.setState({ username: e.target.value });
  };

  handleChangePassword = e => {
    this.setState({ password: e.target.value });
  };

  connectToPlex = () => {
    const { username, password } = this.state;
    const { mutate, onShowMessage, onNext } = this.props;
    this.setState({ isLoading: true });
    mutate({ variables: { username, password } }).then(data => {
      this.setState({ isLoading: false });
      if (data.errors) {
        onShowMessage('warning', data.errors[0].message);
      } else {
        const connectPlex = get(data, 'data.connectPlexAccount', null);
        const plexAccount = get(connectPlex, 'plexAccount', null);
        if (plexAccount) {
          onNext();
        } else {
          onShowMessage('warning', connectPlex.message);
        }
        if (connectPlex.message) {
          // onShowMessage(connectPlex.message);
          //
        }
      }
    });
  };

  render() {
    const { username, password, isLoading } = this.state;
    return (
      <React.Fragment>
        <div className="narrow-container text-muted p-2rem all-width pb-0">
          <h2 className="smaller mb-4 text-white">Connect your Plex Account</h2>
          <p className="lead mb-4">
            RockPeaks can connect to your personal library of music videos, provided they are accessible on a Plex Media
            server and named to our guidelines. Once connected, RockPeaks will give playback priority to your personal
            videos over copies that are available via streaming services like YouTube or Vimeo.
          </p>
          <p className="lead mb-4">
            Personal Media playback of your Plex music video library means that your media will always be available on
            this site at its original quality and resolution, without advertising, and not subject to copyright blocking
            or takedown notices.
          </p>
          <p className="lead mb-4">
            You'll also be able to download metadata from RockPeaks to your Plex Media Server, so that when you browse
            your music video content there, you'll have top quality artwork and information.
          </p>
        </div>
        <div className="narrow-container text-muted p-2rem smaller-width pt-0">
          <p className="lead mb-4">To start, connect your Plex.tv account:</p>
          <Form>
            <FormGroup className="mb-4">
              <Label className="lead" for="media-email">
                Plex.tv Username or Email:
              </Label>
              <Input
                type="email"
                id="media-email"
                placeholder=""
                value={username}
                required
                onChange={this.handleChangeUsername}
              />
            </FormGroup>
            <FormGroup className="mb-4">
              <Label className="lead" for="media-password">
                Plex.tv Username or Email:
              </Label>
              <Input
                type="password"
                id="media-password"
                required
                value={password}
                onChange={this.handleChangePassword}
              />
            </FormGroup>

            <Button type="button" color="danger" onClick={this.connectToPlex}>
              {isLoading && <Spinner size="sm" />}
              {!isLoading && <span>Connect</span>}
            </Button>
          </Form>
        </div>
      </React.Fragment>
    );
  }
}
Connect.propTypes = {
  mutate: PropTypes.func.isRequired,
};
export default withMutation(ConnectPlexAccount, Connect);
