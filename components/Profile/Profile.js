import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { get } from 'lodash';

import ModalNav from '@components/ModalNav';
import USERINFO_REQUEST from '@graphql/user/userInfoById.graphql';
import DefaultAvatar from '@static/images/default-avatar.jpg';
import './profile.scss';
import PlaylistTab from '@components/AccountSetting/PlaylistTab';
import ReviewedTab from '@components/AccountSetting/ReviewedTab';
import CuratingTab from '@components/AccountSetting/CuratingTab';
import AlertBox from '@components/Utilities/AlertBox';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import ClipList from './ClipList';
import ContactForm from './ContactForm';

const dummyUser = {
  name: 'test',
  mail: 'test@test.com',
  reverseUidProfile: {
    entities: [
      {
        avatarImage: { url: DefaultAvatar },
        fbProfileLink: { uri: 'https://facebook.com/xxx/xxx' },
        twitterProfileLink: { uri: 'https://twitter.com/xxxx/xxxx' },
        rp_user_public_profile_link: 'https://facebook.com/xxx/xxx',
      },
    ],
  },
};
const tabs = ['contact', 'playlists', 'reviews', 'curating'];
class Profile extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
      resetPassword: false,
      alertType: 'success',
    };
  }

  componentDidMount() {
    try {
      const urlParams = new URLSearchParams(location.search);
      if (urlParams.has('resetPassword')) {
        this.setState({ resetPassword: urlParams.get('resetPassword') });
      }
    } catch (err) {
      console.log(err);
    }
  }

  handleChangeTab = ind => () => {
    this.setState({ activeTab: ind });
  };

  render() {
    const { activeTab } = this.state;
    const { resetPassword } = this.state;
    const { alertType } = this.state;

    const { user = dummyUser, loading, error } = this.props;
    if (loading || error) {
      return '';
    }
    const {
      name,
      mail,
      roles,
      rpCustomerProfiles: { entity },
    } = user;

    const { avatarImage, themeSelectionState, fbProfileLink, twitterProfileLink } = entity;

    // Check if avatar exist.
    const avatarImageUrl = get(avatarImage, 'url', DefaultAvatar);

    return (
      <div className="profile-wrapper">
        <section className="clearfix container-info-bloks">
          <div className="info-nav clearfix">
            <div className="setting-avatar">
              <img src={avatarImageUrl} alt="" />
            </div>
            <div>Points:624,234</div>
            <ModalNav tabs={tabs} curTab={activeTab} onChange={this.handleChangeTab} type="vertical" />
          </div>
          <div className="main-info clearfix text-left ">
            <div className="mb-4 text-left ">
              <h1>{name}</h1>
              <p>Joined the site on June 14th,2010, and has earned the following badges:</p>
            </div>

            <div className="mb-4">
              {roles.map(role => (
                <div className="role alert alert-secondary alert-custom-sm mr-3" key={0} role="alert">
                  {role.entity.entityLabel}
                </div>
              ))}
            </div>
            {activeTab === 0 && <ContactForm user={name} mail={mail} />}
            {activeTab === 1 && <PlaylistTab active={activeTab === 1} type="profile" />}
            {activeTab === 2 && <ReviewedTab active={activeTab === 2} type="profile" />}
            {activeTab === 3 && <CuratingTab active={activeTab === 3} type="profile" />}
            <Modal className="alert-modal theme-dark" isOpen={resetPassword}>
              <AlertBox type={alertType} text="Your password has been successfully reset." onClose={() => { this.setState({ resetPassword: false }); }} />
            </Modal>
          </div>
        </section>
      </div>
    );
  }
}
const withData = graphql(USERINFO_REQUEST, {
  options: ({ uid }) => ({
    variables: {
      uid,
    },
  }),
  props: ({ data: { userById, loading, error } }) => ({
    user: userById,
    loading,
    error,
  }),
});
export default withData(Profile);
