import React from 'react';
import PropTypes from 'prop-types';

import AlbumTree from './AlbumTree';
import DateTree from './DateTree';
import SongTree from './SongTree';
import ShowTree from './ShowTree';

const TreeSwitcher = ({ activeTab, nid, addToPlaylist }) => {
  const components = {
    album: <AlbumTree nid={nid} addToPlaylist={addToPlaylist} />,
    date: <DateTree nid={nid} addToPlaylist={addToPlaylist} />,
    show: <ShowTree nid={nid} addToPlaylist={addToPlaylist} />,
    song: <SongTree nid={nid} addToPlaylist={addToPlaylist} />,
  };
  return components[activeTab];
};

TreeSwitcher.propTypes = {
  activeTab: PropTypes.string,
  nid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

TreeSwitcher.defaultProps = {
  activeTab: 'song',
};

export { TreeSwitcher };
