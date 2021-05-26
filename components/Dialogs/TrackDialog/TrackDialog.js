import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, CustomInput } from 'reactstrap';
import { withApollo, Query } from 'react-apollo';
import { get } from 'lodash';

import { ICONS } from '@lib/icons';

import { withContext } from '@components/HOC/withContext';
import ModalThumbnail from '@static/images/icons/svg/Track-This-Artist-icon.svg';
import ShowIcon from '@static/images/icons/svg/Show-Icon.svg';
import ArtistIcon from '@static/images/icons/svg/Artist-Icon-nav.svg';

import { setFlagEntity, unsetFlagEntity } from '../../../lib/mutations';
import GetTrackingList from '../../../graphql/tracking/GetTrackingList.graphql';
import Icon from '../../Icon';

class TrackDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      isTracking: '',
    };
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    const { nid, client } = nextProps;
    if (nid && client) {
      const response = await client.query({
        query: GetTrackingList,
      });
      const trackingList = get(response, 'data.getUserSubscriptions', []);
      const isTracking = trackingList.some(item => Number(item.nid) === nid);
      this.setState({ isTracking });
    }
  }

  handleCancel = event => {
    this.props.onCancel(event);
  };

  handleSubmit = evnet => {
    this.props.onSubmit(event);
  };

  handleTrackState = event => {
    const state = event.target.checked;
    const { nid, brand } = this.props;
    const handleResponse = res => {
      const errors = get(res, state ? 'data.flagEntity.errors' : 'data.unflagEntity.errors', '');
      if (errors.length === 0) {
        this.setState({
          message: '',
          isTracking: state,
        });
      } else {
        this.setState({ message: errors[0], isTracking: state });
      }
    };
    if (state) {
      setFlagEntity(this.props.client, nid).then(handleResponse);
    } else {
      unsetFlagEntity(this.props.client, nid).then(handleResponse);
    }
  };

  render() {
    const { isOpen, nid, brand, type, onToggle, theme } = this.props;
    const { message, isTracking } = this.state;
    return (
      <Modal className={`track-modal theme-${theme}`} isOpen={isOpen} toggle={onToggle}>
        <ModalHeader toggle={onToggle}>
          <img className="modal-title-icon" src={ModalThumbnail} alt="" />
          {brand}
        </ModalHeader>
        <ModalBody className="p-0">
          <div className="narrow-container p-2rem all-width text-center text-muted">
            <div className="mb-4">
              {type === 'artist' ? (
                <Icon size={32} icon={ICONS.ARTIST} color={theme === 'dark' ? '#b9c5d8' : '#374355'} />
              ) : (
                <Icon size={32} icon={ICONS.TV} color={theme === 'dark' ? '#b9c5d8' : '#374355'} />
              )}
            </div>
            <p className="h6 mb-4">
              {!isTracking ? `You are not currently tracking ${brand}` : `You are tracking ${brand}`}
            </p>
            <Form className="mb-0">
              <FormGroup className="mb-0">
                <CustomInput
                  id="track-checkbox"
                  type="checkbox"
                  label={isTracking ? 'Stop tracking' : 'Start tracking'}
                  defaultChecked={isTracking}
                  onChange={this.handleTrackState.bind(this)}
                />
                {message}
              </FormGroup>
            </Form>
          </div>
        </ModalBody>
        <ModalFooter>
          {/* <Button
            className="ml-auto"
            color="danger"
            type="submit"
            onClose={this.handleSubmit}
          >
            Submit
          </Button>
          <Button
            color="danger"
            type="button"
            outline
            onClick={this.handleCancel}
          >
            Cancel
          </Button> */}
        </ModalFooter>
      </Modal>
    );
  }
}

TrackDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  brand: PropTypes.string,
  nid: PropTypes.string,
  type: PropTypes.string,
  message: PropTypes.string,
  onToggle: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChangeTrackingState: PropTypes.func.isRequired,
};
TrackDialog.defaultProps = {
  brand: '',
  type: 'artist',
  message: '',
  nid: '',
};

export default withApollo(withContext(TrackDialog));
