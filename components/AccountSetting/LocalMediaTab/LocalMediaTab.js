import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import AlertBox from '@components/Utilities/AlertBox';
import GetPlexAccount from '@graphql/plex/GetPlexAccount.graphql';

import Connect from './Connect';
import Initializing from './Initializing';
import Overview from './Overview';
import Choose from './Choose';
import Matching from './Matching';
import { graphql } from 'react-apollo';

class LocalMediaTab extends Component {
  state = {
    step: 0,
    connected: false,
    plexAccountData: null,
    plexMediaCount: 0,
    alertType: 'success',
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { plexData = {} } = nextProps;
    if (plexData.plexAccount) {
      this.setState({ connected: true, plexAccountData: plexData.plexAccount });
    } else {
      this.setState({ connected: false, plexAccountData: null });
    }
  }

  closeAlert = () => {
    this.setState({ message: '' });
  };

  showMessage = (alertType, message) => {
    this.setState({ alertType, message });
  };

  gotoBackStep = step => {
    this.setState({ step });
  };

  gotoStep = step => () => {
    this.setState({ step });
  };

  disconnect = () => {
    this.setState({ connected: false });
  };

  setInfo = (field, value) => {
    this.setState({ [field]: value });
  };

  render() {
    const { active } = this.props;
    const { message, step, connected, plexAccountData, plexMediaCount, alertType } = this.state;
    const style = active ? 'show active' : '';

    return (
      <div
        className={`tab-pane fade setting-localmedia-tab ${style}`}
        id="nav-localmedia"
        role="tabpanel"
        aria-labelledby="nav-localmedia-tab"
      >
        {step === 0 && !connected && <Connect onShowMessage={this.showMessage} onNext={this.gotoStep(1)} />}
        {step === 1 && <Choose onNext={this.gotoStep(2)} />}
        {step === 2 && <Matching onNext={this.gotoStep(3)} />}
        {step === 3 && <Initializing onNext={this.gotoStep(4)} plexAccount={plexAccountData} setInfo={this.setInfo} />}
        {(step === 4 || (step === 0 && connected)) && (
          <Overview
            onNext={this.gotoStep(0)}
            gotoStep={this.gotoBackStep}
            disconnect={this.disconnect}
            plexAccount={plexAccountData}
            plexMediaCount={plexMediaCount}
            setMessage={this.showMessage}
          />
        )}
        <Modal className={`alert-modal theme-dark`} isOpen={!!message}>
          <AlertBox type={alertType} text={message} onClose={this.closeAlert} />
        </Modal>
      </div>
    );
  }
}

LocalMediaTab.propTypes = {
  active: PropTypes.bool.isRequired,
};

const withPlexAccount = graphql(GetPlexAccount, {
  props: ({ data: { getPlexAccount, loading } }) => {
    return {
      loading,
      plexData: getPlexAccount,
    };
  },
});
export default withPlexAccount(LocalMediaTab);
