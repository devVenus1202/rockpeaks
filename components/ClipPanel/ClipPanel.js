import React from 'react';
import PropTypes from 'prop-types';
import ClipDetail from './ClipDetail';

import {
  CarouselLoader,
  PageContentLoader,
} from '../Loader';

class ClipPanel extends React.Component {
  static defaultProps = {
    nidLoaded: false,
  }

  static propTypes = {
    nidLoaded: PropTypes.oneOfType([
      PropTypes.string.isRequired,
      PropTypes.bool.isRequired,
    ]),
  };

  render() {
    const { nidLoaded } = this.props;
    if (nidLoaded) {
      return <ClipDetail nid={nidLoaded} />;
    }
    return (
      <div className="pl-4 pr-4">
        <div style={{ maxWidth: '600px', marginBottom: '60px' }}><PageContentLoader /></div>
        <div style={{ maxWidth: '768px', marginBottom: '4em' }}><CarouselLoader /></div>
      </div>
    );
  }
}

export default ClipPanel;
