import React from 'react';
import ContentLoader from 'react-content-loader';

const MyLoader = props => {
  const { primaryColor, secondaryColor } = props;
  return (
    <div style={{ height: '86px', width: '500px' }}>
      <ContentLoader
        height={86}
        width={500}
        speed={4}
        primaryColor={primaryColor || '#3d4d65'}
        secondaryColor={secondaryColor || '#b9c5d8'}
        {...props}
      >
        <rect x="150" y="12" rx="4" ry="4" width="180" height="14" />
        <rect x="150" y="34" rx="3" ry="3" width="350" height="10" />
        <rect x="150" y="52" rx="3" ry="3" width="350" height="10" />
        <rect x="150" y="71" rx="3" ry="3" width="250" height="10" />
        <rect x="9.05" y="10.67" rx="0" ry="0" width="133" height="75" />
      </ContentLoader>
    </div>
  );
};

export default MyLoader;
