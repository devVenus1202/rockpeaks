import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

import DragList from '@components/Utilities/DragList';
import { withMutation } from '@components/HOC/withMutation';

import GetClipRequest from '@graphql/playlist/GetClips.graphql';
import UpdateOrderRequest from '@graphql/playlist/UpdatePlaylist.graphql';

class ClipList extends Component {
  static propTypes = {
    playlist: PropTypes.object.isRequired,
    removeAction: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      items: [],
    };
  }

  UNSAFE_componentWillReceiveProps(nexProps) {
    const { playlist } = nexProps;
    const { playlist: currentPlaylist } = this.props;
    const clips = playlist ? playlist.clips : [];

    if (currentPlaylist !== playlist) {
      const items = [];
      clips.forEach((clip, index) => {
        items.push({ entityId: index, flaggedEntity: clip });
      });
      this.setState({ items });
    }
  }

  handleChangeOrder = newItems => {
    const { mutate, targetId, title, mutateState } = this.props;
    const clips = [];

    this.setState({ items: newItems });
    newItems.forEach(item => {
      clips.push(item.id);
    });
    mutate({ variables: { id: targetId, title, clips } }).then(res => {
      const { mutateState } = this.props;
      // mutateState.client.cache.writeQuery({
      //   query: GetClipRequest,
      //   data: { nodeById: res.nodeById },
      // });
    });
  };

  handleRemoveItem = index => {
    const { removeAction, onRemove } = this.props;
    const { clips } = this.state;
    removeAction({ variables: { entityId: clips[index].flaggedEntity.entity.entityId } }).then(res => {
      clips.splice(index, 1);
      this.setState({ clips });
      onRemove();
    });
  };

  render() {
    const { text, loading } = this.props;
    const { items } = this.state;
    return (
      <div>
        {!loading && items.length > 0 && (
          <DragList title={text} items={items} onRemove={this.handleRemoveItem} onChange={this.handleChangeOrder} />
        )}
      </div>
    );
  }
}

const withData = graphql(GetClipRequest, {
  options: ({ targetId }) => ({
    variables: {
      targetId,
    },
    fetchPolicy: 'network-only',
  }),
  props: ({ data: { nodeById, loading } }) => {
    return {
      loading,
      playlist: nodeById,
    };
  },
});

export default withData(withMutation(UpdateOrderRequest, ClipList));
