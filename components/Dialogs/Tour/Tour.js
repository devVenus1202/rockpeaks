import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalBody } from 'reactstrap';
import { withContext } from '@components/HOC/withContext';

import ModalNav from '../../ModalNav';
import TourContent from './TourContent';
import './Tour.style.scss';

const tabs = ['browse videos', 'match collection', 'become contributor'];

class Tour extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
    };
  }

  handleChangeTab = activeTab => () => {
    this.setState({ activeTab });
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { activeTab = 0 } = nextProps;
    this.setState({ activeTab });
  }

  render() {
    const { isOpen, onToggle, theme = 'dark', currentNav } = this.props;
    const { activeTab } = this.state;

    const content = tabs.map((val, ind) => (
      <TourContent key={ind} active={activeTab === ind} title={val} />
    ));

    return (
      <Modal className={`edit-show-modal theme-${theme}`} isOpen={isOpen} toggle={onToggle}>
        <ModalBody className="pt-0 pl-3 pr-3 pb-0">
          <Button onClick={onToggle} color="primary-outline" className="close mt-0">
            <span aria-hidden="true">×</span>
          </Button>
          <div className="row">
            <div className="col-lg-3">
              <ModalNav
                tabs={tabs}
                curTab={activeTab}
                onChange={this.handleChangeTab}
                type="vertical"
              />
            </div>
            <div className="col-lg-9">
              <div className="tab-content dropdown-tab-content p-0">{content}</div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

Tour.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  activeTab: PropTypes.number.isRequired,
};

export default withContext(Tour);
