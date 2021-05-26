import React from 'react';
import PropTypes from 'prop-types';

import ArtistTree from './ArtistTree';
import DateTree from './DateTree';


const TreeSwitcher = ({ activeTab, nid }) => {
  const components = {
    artist:  <ArtistTree nid={nid} />,
    date:  <DateTree nid={nid} />,
  };
  return (
    components[activeTab]
  );
};

TreeSwitcher.propTypes = {
  activeTab: PropTypes.string,
  nid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

TreeSwitcher.defaultProps = {
  activeTab: 'date',
};

export { TreeSwitcher };
