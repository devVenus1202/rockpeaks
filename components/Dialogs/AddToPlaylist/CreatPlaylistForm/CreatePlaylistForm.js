import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, FormGroup } from 'reactstrap';
import { get } from 'lodash';

import { withCreateMutation } from '@components/HOC/withCreateMutation';

import CreatePlaylistRequest from '@graphql/playlist/CreatePlaylist.graphql';
// import UpdatePlaylistRequest from '@graphql/playlist/UpdatePlaylist.graphql';

import './CreatePlaylistForm.scss';

class CreatePlaylistForm extends Component {
  static propTypes = {
    createAction: PropTypes.func.isRequired,
    onCreated: PropTypes.func.isRequired,
  };

  state = {
    isInput: false,
    isValidTitle: false,
    isLoading: false,
    currentTitle: '',
  };

  constructor(props) {
    super(props);
    this.input = React.createRef();
  }

  componentDidUpdate() {
    const { isInput } = this.state;
    if (isInput) {
      this.input.current.focus();
    }
  }

  onInitInput = () => {
    this.setState({ isInput: true });
  };

  handlerChangeTitle = e => {
    this.setState({
      currentTitle: e.target.value,
      isValidTitle: !!e.target.value,
    });
  };

  handlerAdd = () => {
    const { createAction, onCreated, clip } = this.props;
    const { currentTitle } = this.state;
    createAction({ variables: { title: currentTitle, clips: [clip] } }).then(({ data }) => {
      const newPlaylist = get(data, 'createPlaylist.entity', {});
      if (onCreated) {
        onCreated(newPlaylist);
      }
    });
    this.initForm();
  };

  handlerCancel = () => {
    this.initForm();
  };

  initForm = () => {
    this.setState({ isInput: false, currentTitle: '', isValidTitle: false });
  };

  render() {
    const { isInput, currentTitle, isValidTitle } = this.state;
    return (
      <div>
        {isInput ? (
          <>
            <FormGroup className="mb-2 add-playlist">
              <Input
                type="text"
                placeholder="Enter new playlist name"
                defaultValue={currentTitle}
                onChange={this.handlerChangeTitle}
                className="playlist-input"
                innerRef={this.input}
              />
              <Button size="sm" onClick={this.handlerAdd} disabled={!isValidTitle}>
                Add
              </Button>
              <Button size="sm" onClick={this.handlerCancel}>
                Cancel
              </Button>
            </FormGroup>
          </>
        ) : (
          <Button onClick={this.onInitInput}>Add to New Playlist</Button>
        )}
      </div>
    );
  }
}

export default withCreateMutation(CreatePlaylistRequest, CreatePlaylistForm);
