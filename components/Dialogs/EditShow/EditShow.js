import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import ModalThumbnail from '@static/images/icons/svg/Edit-Clip-Button-Normal.svg';
import ModalNav from '../../ModalNav';
import MainTab from './MainTab';
import ImagesTab from './ImagesTab';
import './EditShow.style.scss';
import DiscsTab from './DiscsTab';

const tabs = ['main', 'images', 'discs'];

class EditShow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 0,
    };
  }

  handleChangeTab = activeTab => () => {
    this.setState({ activeTab });
  };

  render() {
    const { isOpen, onToggle, theme = 'dark', data } = this.props;
    const { activeTab } = this.state;

    return (
      <Modal
        className={`edit-show-modal theme-${theme}`}
        isOpen={isOpen}
        toggle={onToggle}
      >
        <ModalHeader toggle={onToggle}>
          <img className="modal-title-icon" src={ModalThumbnail} alt="" />
          Edit Show
        </ModalHeader>
        <ModalBody className="p-0">
          <ModalNav
            tabs={tabs}
            curTab={activeTab}
            onChange={this.handleChangeTab}
          />
          <div className="tab-content dropdown-tab-content p-0">
            <MainTab active={activeTab === 0} />
            <ImagesTab active={activeTab === 1} data={data} />
            <DiscsTab active={activeTab === 2} />
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

EditShow.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

export default EditShow;
