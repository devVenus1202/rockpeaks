import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CheckedIcon from '@static/images/icons/svg/Checked-Circle-Icon-Normal.svg';
import CloseIcon from '@static/images/icons/svg/Close-Circle-Icon-Normal.svg';

const videoTypes = ['Public', 'Personal', 'Archive'];

class VideoTypeComponent extends Component {
  static propTypes = {
    type: PropTypes.number.isRequired,
    isPublished: PropTypes.bool.isRequired,
    isArchived: PropTypes.bool.isRequired,
    isPersonal: PropTypes.bool.isRequired,
    onChangeType: PropTypes.object.isRequired,
    selectedType: PropTypes.number.isRequired,
    showArchive: PropTypes.bool.isRequired,
  };

  state = {
    type: '',
  };

  handleChangeType = type => () => {
    const { onChangeType } = this.props;
    onChangeType(type);
  };

  render() {
    const {
      isPublished,
      isPersonal,
      isArchived,
      selectedType,
      showArchive,
    } = this.props;
    const imgStyle = isPublished ? 'smaller' : 'cloce-icon';
    return (
      <ul className="list-icon-item right-icon">
        <li
          className={`${selectedType === 1 ? 'smaller active' : 'cloce-icon'} `}
          key={1}
          onClick={this.handleChangeType(1)}
        >
          <a href="#" className={isPublished ? 'checkedIcon' : 'closeIcon'}>
            Public
          </a>
        </li>
        <li
          className={`${selectedType === 2 ? 'smaller active' : 'cloce-icon'} `}
          key={2}
          onClick={isPersonal ? this.handleChangeType(2) : null}
        >
          <a href="#" className={isPersonal ? 'checkedIcon' : 'closeIcon'}>
            Personal
          </a>
        </li>
        {showArchive && (
          <li
            className={`${
              selectedType === 3 ? 'smaller active' : 'cloce-icon'
            } `}
            key={3}
            onClick={isArchived ? this.handleChangeType(3) : null}
          >
            <a href="#" className={isArchived ? 'checkedIcon' : 'closeIcon'}>
              Archive
            </a>
          </li>
        )}
      </ul>
    );
  }
}

export default VideoTypeComponent;
