import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { graphql, Query } from 'react-apollo';

import { AppConsumer } from '@components/AppContext';
import AvatarImg from '@static/images/icons/svg/avatar-icon.svg';
import GetPlexAccount from '@graphql/plex/GetPlexAccount.graphql';

import ModalNav from '../ModalNav';
import SettingTab from './SettingTab';
import PlaylistTab from './PlaylistTab';
import TrackingTab from './TrackingTab';
import ReviewedTab from './ReviewedTab';
import CuratingTab from './CuratingTab';
import LocalMediaTab from './LocalMediaTab';
import { isSubArray } from '../../helpers/arrayHelper';
import './AccountSetting.style.scss';

import { USER_NAME, USER_AVATAR, USER_ROLE } from '../../helpers/auth';
import { forEach } from 'iterall';

const tabs = [
  { name: 'settings', roles: ['rp_contributor'] },
  { name: 'playlists', roles: ['rp_contributor'] },
  { name: 'tracking', roles: ['rp_contributor'] },
  { name: 'reviewed', roles: ['rp_reviewer'] },
  { name: 'curating', roles: ['rp_curator'] },
  { name: 'personal media', roles: ['rp_contributor'], isPlexItem: true },
];

class AccountSetting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 0,
      isOpen: false,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.isOpen) this.setState({ isOpen: true });
  }

  handleChangeTab = activeTab => () => {
    this.setState({ activeTab });
  };

  toggle = () => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen,
    }));
    this.props.onToggle();
  };

  render() {
    const { isOpen, onToggle, userInfo } = this.props;
    const { activeTab } = this.state;
    const { plexData } = this.props;
    // Test for user role

    return (
      <AppConsumer>
        {state => {
          let { theme } = state;
          if (!theme) {
            theme = this.props.theme;
          }
          const { userInfo } = state.authentication;
          tabs.forEach((item, i) => {
            if (!userInfo.user_roles) {
              return;
            }
            const hasRole = isSubArray(userInfo.user_roles, item.roles);
            if (hasRole) {
              tabs[i].disabled = false;
            } else {
              tabs[i].disabled = true;
            }
          });

          return (
            <Modal
              className={`account-setting-modal theme-${theme}`}
              isOpen={this.props.isOpen}
              toggle={this.toggle}
            >
              <ModalHeader toggle={this.toggle}>
                <img className="modal-title-icon" src={AvatarImg} alt="" />
                My Account
              </ModalHeader>
              <ModalBody className="p-0">
                <Query query={GetPlexAccount}>
                  {({ data, loading, error }) => {
                    const { getPlexAccount } = data;
                    return (
                      <ModalNav
                        tabs={tabs}
                        curTab={activeTab}
                        onChange={this.handleChangeTab}
                        plexAccount={
                          getPlexAccount ? getPlexAccount.plexAccount : null
                        }
                      />
                    );
                  }}
                </Query>

                <div className="tab-content dropdown-tab-content p-0">
                  {activeTab === 0 && (
                    <SettingTab
                      active={activeTab === 0}
                      userInfo={userInfo}
                      toggle={this.toggle}
                    />
                  )}
                  {activeTab === 1 && <PlaylistTab active={activeTab === 1} />}
                  {activeTab === 2 && <TrackingTab active={activeTab === 2} />}
                  {activeTab === 3 && (
                    <ReviewedTab
                      active={activeTab === 3}
                      onCancel={this.toggle}
                    />
                  )}
                  {activeTab === 4 && <CuratingTab active={activeTab === 4} />}
                  {activeTab === 5 && (
                    <LocalMediaTab active={activeTab === 5} />
                  )}
                  {/* <PlaylistTab active={activeTab === 1} />
                  <TrackingTab active={activeTab === 2} />
                  <ReviewedTab active={activeTab === 3} />
                  <CuratingTab active={activeTab === 4} />
                  <LocalMediaTab active={activeTab === 5} /> */}
                </div>
              </ModalBody>
            </Modal>
          );
        }}
      </AppConsumer>
    );
  }
}

AccountSetting.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  userInfo: PropTypes.object.isRequired,
};

const withPlexAccount = graphql(GetPlexAccount, {
  props: ({ data: { getPlexAccount, loading } }) => {
    return {
      loading,
      plexData: getPlexAccount,
    };
  },
});
export default AccountSetting;
