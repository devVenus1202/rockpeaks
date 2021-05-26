import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';
import { getProfileLink } from '@helpers/urlHelper';
import { withContext } from '@components/HOC/withContext';
import { withApollo } from 'react-apollo';
import LogoutDiscourse from '@graphql/discourse/DiscourseLogout.graphql';

import { USER_NAME, USER_AVATAR, logout } from '@helpers/auth';
import DraftPanel from '@components/DraftPanel';
import AccountSetting from '../AccountSetting';

class User extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropDownOpen: false,
      showAccountModal: false,
    };
  }

  toggleModal() {
    this.setState({ showAccountModal: false });
  }

  showMyAccountSetting() {
    this.setState({
      showAccountModal: true,
    });
  }

  async onSignOut() {
    await this.props.client.mutate({ mutation: LogoutDiscourse });
    logout();
    window.location.reload();
  }

  toggle() {
    this.setState(prevState => ({
      dropDownOpen: !prevState.dropDownOpen,
    }));
  }

  goToProfile() {
    const { userInfo } = this.props;
    // window.location.href = `${userInfo.profileLink}/${userInfo.user_id}`;
    window.open(
      getProfileLink(userInfo.user_name, userInfo.user_id),
      '_blank', // <- This is what makes it open in a new window.
    );
  }

  render() {
    const { dropDownOpen, showAccountModal } = this.state;
    const { userInfo } = this.props;
    return (
      <>
        <Dropdown
          isOpen={dropDownOpen}
          toggle={this.toggle}
          className="navbar-nav ml-auto navbar-user"
        >
          <DropdownToggle tag="div" nav caret>
            <span className="user-img">
              <img src={userInfo[USER_AVATAR]} alt="" />
            </span>
            <span>{userInfo[USER_NAME]}</span>
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={this.showMyAccountSetting.bind(this)}>
              My Account
            </DropdownItem>
            <DropdownItem onClick={this.goToProfile.bind(this)}>
              My Public Profile
            </DropdownItem>
            <DropdownItem divider />
            <DropdownItem onClick={this.onSignOut.bind(this)}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <AccountSetting
          isOpen={showAccountModal}
          userInfo={userInfo}
          onToggle={this.toggleModal.bind(this)}
        />
      </>
    );
  }
}
User.propTypes = {
  userInfo: PropTypes.object.isRequired,
};
export default withContext(withApollo(User));
