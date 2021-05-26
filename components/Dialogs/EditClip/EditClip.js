import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
} from 'reactstrap';
import { withContext } from '@components/HOC/withContext';
import AlertBox from '@components/Utilities/AlertBox';
import Link from 'next/link';
import { get as _get } from 'lodash';

import ModalThumbnail from '@static/images/icons/svg/Edit-Clip-Button-Normal.svg';
import ModalNav from '../../ModalNav';
import VideoTab from './VideoTab';
import TitleTab from './TitleTab';
import DiscsTab from './DiscsTab';
import ArchieveFile from './ArchieveFile';
import ArtistShow from './ArtistShow';
import Categories from './Categories';
import StillImage from './StillImage';
import './EditClip.style.scss';

// const tabs = [
//   'video',
//   'title & date',
//   'artist & show',
//   'categories',
//   'still image',
//   'disc',
//   'archive file',
// ];
const tabs = ['general', 'video', 'still image'];

class EditClip extends Component {
  state = {
    activeTab: 0,
    alertType: 'success',
    message: '',
    showAlert: false,
    loading: false,
  };

  constructor(props) {
    super(props);
    this.generalTab = React.createRef();
    this.videoTab = React.createRef();
    this.stillImageTab = React.createRef();
  }

  handleChangeTab = activeTab => () => {
    this.setState({ activeTab });
  };

  handleSubmit = () => {
    const { activeTab } = this.state;
    if (activeTab === 0) {
      this.setState({ loading: true });
      this.generalTab.current.submit();
    }

    if (activeTab === 1) {
      this.setState({ loading: true });
      this.videoTab.current.submit();
    }
    if (activeTab === 2) {
      this.setState({ loading: true });
      this.stillImageTab.current.submit();
    }
  };

  handleSubmitEnd = (type, message) => {
    this.props.onToggle();
    this.setState({
      alertType: type,
      message,
      showAlert: true,
      loading: false,
    });
  };

  handleCancel = () => {};

  closeAlert = () => {
    const { alertType } = this.state;
    this.setState({ showAlert: false });
    if (alertType === 'success') window.location.reload(false); // Clip is updated refresh page.
  };

  render() {
    const { isOpen, onToggle, theme = 'dark', data, user } = this.props;
    const { activeTab, showAlert, alertType, message, loading } = this.state;
    const clipNid = _get(data, 'nid', '');
    const ableToEditHub = user.user_roles
      ? user.user_roles.includes('rp_editor')
      : false;
    return (
      <>
        <Modal
          className={`edit-show-modal theme-${theme}`}
          isOpen={isOpen}
          toggle={onToggle}
        >
          <ModalHeader toggle={onToggle}>
            <img className="modal-title-icon" src={ModalThumbnail} alt="" />
            Edit Details
            {ableToEditHub && (
              <span className="float-right">
                [
                <a
                  href={`https://hub.musicpeaks.com/node/${clipNid}/edit`}
                  target="_blank"
                >
                  <span className="edit-on-hub">edit on hub</span>
                </a>
                ]
              </span>
            )}
          </ModalHeader>
          <ModalBody className="p-0">
            <ModalNav
              tabs={tabs}
              curTab={activeTab}
              onChange={this.handleChangeTab}
            />
            <div className="tab-content dropdown-tab-content p-0">
              <TitleTab
                active={activeTab === 0}
                theme={theme}
                data={data}
                ref={this.generalTab}
                onEndSubmit={this.handleSubmitEnd}
              />
              <VideoTab
                active={activeTab === 1}
                theme={theme}
                data={data}
                ref={this.videoTab}
                onEndSubmit={this.handleSubmitEnd}
              />
              <StillImage
                active={activeTab === 2}
                theme={theme}
                data={data}
                ref={this.stillImageTab}
                onEndSubmit={this.handleSubmitEnd}
              />

              {/* <ArtistShow active={activeTab === 2} theme={theme} data={data} />
              <Categories active={activeTab === 3} theme={theme} data={data} />
              <StillImage active={activeTab === 4} theme={theme} data={data} />
              <DiscsTab active={activeTab === 5} theme={theme} data={data} />
              <ArchieveFile
                active={activeTab === 6}
                theme={theme}
                data={data}
              /> */}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              className="ml-auto"
              color="danger"
              outline
              onClick={onToggle}
            >
              Cancel
            </Button>
            <Button color="danger" type="submit" onClick={this.handleSubmit}>
              {loading && <Spinner size="sm" className="spinner-login" />}
              {!loading && 'Submit'}
            </Button>
          </ModalFooter>
        </Modal>
        <Modal className={`edit-show-modal theme-${theme}`} isOpen={showAlert}>
          <AlertBox type={alertType} text={message} onClose={this.closeAlert} />
        </Modal>
      </>
    );
  }
}

EditClip.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default withContext(EditClip);
