import React from 'react';
import PropTypes from 'prop-types';
import DiscDetail from './DiscDetail';

import { CarouselLoader, PageContentLoader } from '../Loader';

class DiscDetailCheck extends React.Component {
  static propTypes = {
    nidLoaded: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.bool.isRequired]),
  };

  static defaultProps = {
    nidLoaded: false,
  };

  render() {
    const { nidLoaded } = this.props;

    if (nidLoaded) {
      return <DiscDetail nid={nidLoaded} />;
    }
    return (
      <div className="pl-4 pr-4">
        <div style={{ maxWidth: '600px', marginBottom: '60px' }}>
          <PageContentLoader />
        </div>
        <div style={{ maxWidth: '768px', marginBottom: '4em' }}>
          <CarouselLoader />
        </div>
      </div>
    );
  }
}

export default DiscDetailCheck;
