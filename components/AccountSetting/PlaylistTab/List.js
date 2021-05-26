import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DragList from '@components/Utilities/DragList';

class List extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    clips: PropTypes.object.isRequired,
    onRemove: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const { clips } = props;
    this.state = {
      clips,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { clips } = nextProps;
    // this.state = {
    //   clips,
    // };
  }

  handleRemoveItem = index => {
    const { onRemove } = this.props;
    const { clips } = this.state;

    onRemove(clips, index);
    clips.splice(index, 1);
    this.setState({ clips });
  };

  handleChangeItems = clips => {
    const { onUpdate } = this.props;
    this.setState({ clips });
    onUpdate(clips);
  };

  render() {
    const { text } = this.props;
    const { clips } = this.state;
    return (
      <div>
        <DragList
          title={text}
          items={clips}
          onRemove={this.handleRemoveItem}
          onChange={this.handleChangeItems}
          divider
        />
      </div>
    );
  }
}

export default List;
