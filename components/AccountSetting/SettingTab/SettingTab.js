import React, { Component } from 'react';
import { AppConsumer } from '@components/AppContext';

import PropTypes from 'prop-types';
import { Mutation, graphql, withApollo } from 'react-apollo';
import { get } from 'lodash';
import CURRENTUSER_REQUEST from '@graphql/user/currentUserContext.graphql';
import UPLOADAVATAR_REQUEST from '@graphql/user/uploadAvatar.graphql';
import UPDATEPROFILE_REQUEST from '@graphql/user/updateProfile.graphql';
import USERINFO_REQUEST from '@graphql/user/userInfoById.graphql';

import { Row, Col, Form, FormGroup, CustomInput, Input, Button, Label, ModalFooter, Spinner } from 'reactstrap';
import DefaultAvatar from '@static/images/default-avatar.jpg';
import { getUserAvatar } from '../../../helpers/auth';
import Alert from '../../Utilities/Alert';
import PasswordForm from './PasswordForm';
import { getProfileLink } from '@helpers/urlHelper';

class SettingTab extends Component {
  state = {
    isRendered: false,
  };

  UNSAFE_componentWillReceiveProps(props) {
    const { user } = props;
    if (user) {
      const userData = {
        name: get(user, 'name', ''),
        email: get(user, 'mail', ''),
        avatar: get(user, 'reverseUidProfile.entities.0.avatarImage.url', DefaultAvatar),
        fbLink: get(user, 'reverseUidProfile.entities.0.fbProfileLink.uri', ''),
        twitterLink: get(user, 'reverseUidProfile.entities.0.twitterProfileLink.uri', ''),
        themeState: get(user, 'reverseUidProfile.entities.0.themeSelectionState', ''),
      };
      this.setState({ userData });
    }
  }
  onFileLoad = (e, file) => console.log(e.target.result, file.name);

  // async uploadAvatar(file) {
  //   // /const { file } = this.state;
  //   const response = await this.props.client.mutate({
  //     mutation: UPLOADAVATAR_REQUEST,
  //     variables: {
  //       file,
  //     },
  //   });
  // }

  onChangeTwitterLink = e => {
    this.setState({ twitterLink: e.target.value });
  };

  onChangeFacebookUrl = e => {
    this.setState({ fbLink: e.target.value });
  };

  reload = () => {
    const { isRendered } = this.state;
    this.setState({ isRendered: !isRendered });
  };

  updateProfile = (updateMutation, variables) => {
    updateMutation(variables);
  };

  updateProfileState = (uid, setUser) => {
    getUserAvatar(this.props.client, uid).then(res => {
      setUser(res);
    });
  };

  updateUserInformation = () => {};

  render() {
    const { active } = this.props;
    const style = active ? 'tab-pane fade show active' : 'tab-pane fade';
    return (
      <AppConsumer>
        {status => {
          const { user: userData, setTheme, setUser, theme } = status;
          return (
            <div className={style}>
              <Mutation
                mutation={UPDATEPROFILE_REQUEST}
                onCompleted={() => {
                  this.updateProfileState(userData.user_id, setUser);
                }}
              >
                {(updateRPProfile, { loading, error, data }) => (
                  <Form
                    onSubmit={e => {
                      e.preventDefault();
                      // this.updateProfile(updateRPProfile, { variables: userData });
                      updateRPProfile({ variables: userData });
                      setTheme(userData.themeState);
                    }}
                  >
                    <div className="narrow-container text-muted p-2rem pb-0">
                      <Row>
                        <Col md={3} lg={2}>
                          <div className="setting-avatar">
                            <img src={userData.user_avatar} alt="" />
                          </div>
                        </Col>
                        <Col md={9} lg={10}>
                          {/* <FormGroup className="mb-3">
                            <CustomInput
                              id="setting-picture-checkbox"
                              type="checkbox"
                              label="Check this box to delete your current picture"
                            />
                          </FormGroup> */}
                          <p className="h6 mb-3">Upload a new picture</p>
                          <Row>
                            <Col md={4} lg={3}>
                              <Mutation
                                mutation={UPLOADAVATAR_REQUEST}
                                onCompleted={() => {
                                  this.updateProfileState(userData.user_id, setUser);
                                }}
                              >
                                {(fileUpload, { data, loading }) => {
                                  return loading ? (
                                    <Spinner size="md" className="spinner-login" />
                                  ) : (
                                    <input
                                      accept="image/*"
                                      id="raised-button-file"
                                      type="file"
                                      onChange={({
                                        target: {
                                          validity,
                                          files: [file],
                                        },
                                      }) => {
                                        validity.valid && fileUpload({ variables: { file } });
                                      }}
                                    />
                                  );
                                }}
                              </Mutation>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </div>
                    <hr className="m-0" />
                    <div className="narrow-container text-muted p-2rem smaller-width">
                      <FormGroup className="mb-4">
                        <Label for="settingInput">Name:</Label>
                        <Input type="text" name="name" id="settingName" required value={userData.user_name} />
                      </FormGroup>
                      <FormGroup className="mb-4">
                        <Label for="settingInput">Email:</Label>
                        <Input type="email" name="email" id="settingEmail" required value={userData.user_email} />
                      </FormGroup>
                    </div>
                    <hr className="m-0" />
                    <PasswordForm
                      user={userData}
                      onCompleted={() => {
                        this.updateProfileState(userData.user_id, setUser);
                      }}
                    />
                    <hr className="m-0" />
                    <div className="narrow-container text-muted p-2rem">
                      <div className="form-group row">
                        <Label className="col-md-4 col-form-label" for="settingsInput5">
                          Your public profile page on RockPeaks:
                        </Label>
                        <div className="col-md-8">
                          {/* <Input
                            type="text"
                            placeholder="https://test.rockpeaks.com/members/IraKravchenko"
                            defaultValue={`${window.location.origin}${userData.profileLink}/${
                              userData.user_id
                            }`}
                            readOnly
                          /> */}
                          <a
                            className="profile-link"
                            target="_blank"
                            href={`${window.location.origin}${getProfileLink(userData.user_name, userData.user_id)}`}
                          >
                            {`${window.location.origin}${getProfileLink(userData.user_name, userData.user_id)}`}
                          </a>
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-md-4">
                          <Row>
                            <div className="col-6">
                              <p className="mb-0 text-left pt-2">Facebook:</p>
                            </div>
                            <div className="col-6">
                              <p className="pt-2">
                                <Button className="text-capitalize" color="danger" type="button" size="sm">
                                  <a target="_blank" href={userData.fbLink}>
                                    Connect
                                  </a>
                                </Button>
                              </p>
                            </div>
                          </Row>
                        </div>
                        <div className="col-md-8">
                          <Input
                            type="text"
                            placeholder=""
                            defaultValue={userData.fbLink}
                            onChange={e => {
                              userData.fbLink = e.target.value;
                            }}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-md-4">
                          <Row>
                            <div className="col-6">
                              <p className="mb-0 text-left pt-2">Twitter:</p>
                            </div>
                            <div className="col-6">
                              <p className="pt-2">
                                <Button className="text-capitalize" color="danger" type="button" size="sm">
                                  <a target="_blank" href={userData.twitterLink}>
                                    Connect
                                  </a>
                                </Button>
                              </p>
                            </div>
                          </Row>
                        </div>
                        <div className="col-md-8">
                          <Input
                            type="text"
                            placeholder=""
                            defaultValue={userData.twitterLink}
                            onChange={e => {
                              userData.twitterLink = e.target.value;
                            }}
                          />
                        </div>
                      </div>
                      {data &&
                        data.updateRPProfile.violations.map(item => (
                          <>
                            <Alert variant="primary" value={item.message} />
                            <br />
                          </>
                        ))}
                    </div>
                    <ModalFooter>
                      <div className="theme-selector ">
                        <FormGroup className="mb-0 " tag="fieldset" key={userData.themeState}>
                          <CustomInput
                            type="radio"
                            label="Dark Theme"
                            id="dark_theme"
                            name="theme"
                            inline
                            value="dark"
                            defaultChecked={theme === 'dark'}
                            onChange={e => {
                              userData.themeState = e.target.value;
                              updateRPProfile({ variables: userData });
                              setTheme(userData.themeState);
                            }}
                          />
                          <CustomInput
                            type="radio"
                            label="Light Theme"
                            id="light_theme"
                            name="theme"
                            inline
                            value="light"
                            defaultChecked={theme === 'light'}
                            onChange={e => {
                              userData.themeState = e.target.value;
                              updateRPProfile({ variables: userData });
                              setTheme(userData.themeState);
                            }}
                          />
                        </FormGroup>
                      </div>
                      {/* <Button
                        className="ml-auto"
                        color="danger"
                        type="submit"
                        onClick={this.updateProfile}
                      >
                        {loading && <Spinner size="sm" className="spinner-login" />}
                        {!loading && 'Submit'}
                      </Button>
                      <Button color="danger" type="button" outline onClick={this.props.toggle}>
                        Cancel
                      </Button> */}
                    </ModalFooter>
                  </Form>
                )}
              </Mutation>
            </div>
          );
        }}
      </AppConsumer>
    );
  }
}

SettingTab.propTypes = {
  active: PropTypes.bool.isRequired,
};

// const withData = graphql(USERINFO_REQUEST, {
//   options: ({ userInfo: { user_id: userID } }) => ({
//     variables: {
//       uid: userID,
//     },
//   }),
//   props: ({ data: { userById, loading } }) => ({
//     user: userById,
//   }),
// });

export default withApollo(SettingTab);
