import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Row, Col } from 'reactstrap';
import ModalThumbnail from '@static/images/icons/svg/Vitals-This-Artist.svg';
import PieChart from '@components/Utilities/Charts/PieChart';
import BarChart from '@components/Utilities/Charts/BarChart';

class VitalsDialog extends Component {
  render() {
    const { isOpen, onToggle, theme = 'dark', title } = this.props;

    return (
      <Modal className={`vitals-modal theme-${theme}`} isOpen={isOpen} toggle={onToggle}>
        <ModalHeader toggle={onToggle}>
          <img className="modal-title-icon" src={ModalThumbnail} alt="" />
          {title}
        </ModalHeader>
        <ModalBody className="p-0">
          <div className="d-flex align-items-center justify-content-center flex-wrap">
            <div className="narrow-container p-2rem all-width d-flex">
              <Row>
                <Col md={5}>
                  <PieChart />
                </Col>
                <Col md={5}>
                  <div className="mt-3">
                    <BarChart />
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          {/* <Button className="ml-auto" color="danger" type="submit">
            Submit
          </Button>
          <Button color="danger" type="button" outline>
            Cancel
          </Button> */}
        </ModalFooter>
      </Modal>
    );
  }
}

VitalsDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default VitalsDialog;
