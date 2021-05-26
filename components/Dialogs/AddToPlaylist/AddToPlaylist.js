import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import Alert from '@components/Utilities/Alert';
import { withContext } from '@components/HOC/withContext';
import ModalThumbnail from '@static/images/icons/svg/Add-to-playlist-Button.svg';

// import GetSubscriptionsRequest from '@graphql/playlist/GetUserSubscriptions.graphql';
import GetAllPlaylist from '@graphql/playlist/GetAllPlaylist.graphql';

import PlaylistContainer from './PlaylistContainer';
import CreatePlaylistForm from './CreatPlaylistForm';

import './AddToPlaylist.style.scss';

class AddToPlaylist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlists: props.playlists,
      showMessage: false,
      message: '',
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      playlists,
      watchPlaylist,
      historyPlaylist,
      favouritesPlaylist,
    } = nextProps;
    this.setState({
      playlists,
      watchPlaylist,
      historyPlaylist,
      favouritesPlaylist,
    });
  }

  onCreatNewPlaylist = data => {
    this.setState(prevState => {
      const { playlists } = prevState;
      playlists.push({
        entityId: data.entityId,
        title: data.entityLabel,
        isNew: true,
        entity: {
          clipsCount: data.clips.length,
          clips: data.clips,
        },
      });
      return { playlists };
    });
  };

  onUpdated = () => {
    this.setState({ showMessage: true, message: 'Updated successfully' });
  };

  render() {
    const { isOpen, onToggle, theme = 'dark', clip, user } = this.props;
    const {
      playlists,
      watchPlaylist,
      historyPlaylist,
      favouritesPlaylist,
      showMessage,
      message,
    } = this.state;
    return (
      <Modal
        className={`curate-modal theme-${theme}`}
        isOpen={isOpen}
        toggle={onToggle}
      >
        <ModalHeader toggle={onToggle}>
          <img className="modal-title-icon" src={ModalThumbnail} alt="" />
          Add to Playlist
        </ModalHeader>
        <ModalBody className="p-0">
          <div className="tab-content dropdown-tab-content p-0">
            <div className="narrow-container text-muted p-2rem all-width">
              <CreatePlaylistForm
                onCreated={this.onCreatNewPlaylist}
                clip={clip}
              />
            </div>
            <hr className="m-0" />
            <div className="narrow-container text-muted p-2rem all-width">
              <div className="playlist-container">
                <PlaylistContainer
                  playlists={playlists}
                  watchPlaylist={watchPlaylist}
                  historyPlaylist={historyPlaylist}
                  favouritesPlaylist={favouritesPlaylist}
                  clip={clip}
                  uid={user.user_id}
                  onUpdated={this.onUpdated}
                />
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="mb-5">
            {showMessage && <Alert variant="primary" value={message} />}
          </div>
        </ModalFooter>
      </Modal>
    );
  }
}

AddToPlaylist.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  theme: PropTypes.string.isRequired,

  clip: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  playlists: PropTypes.object.isRequired,
  watchPlaylist: PropTypes.object.isRequired,
  historyPlaylist: PropTypes.object.isRequired,
  favouritesPlaylist: PropTypes.object.isRequired,

  onToggle: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
};

const withGraphql = graphql(GetAllPlaylist, {
  options: props => ({
    variables: {
      type: ['playlist'],
      uid: props.user.user_id,
      sortField: 'created',
      sortDirection: 'DESC',
    },
  }),
  props: ({
    data: {
      userPlaylist,
      watchPlaylist,
      historyPlaylist,
      favouritesPlaylist,
      refetch,
    },
  }) => {
    const playlists = userPlaylist || [];
    return {
      playlists,
      watchPlaylist,
      historyPlaylist,
      favouritesPlaylist,
      refetch,
    };
  },
});

export default withContext(withGraphql(AddToPlaylist));
