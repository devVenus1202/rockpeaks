import React from 'react';
import ContentLoader from 'react-content-loader';

const MyLoader = props => (
  <div style={{ height: '280px', width: '250px' }}>
    <ContentLoader height={300} width={250} speed={4} {...props}>
      <rect x="5" y="15" rx="2" ry="2" width="22" height="22" />
      <rect x="35" y="15" rx="2" ry="2" width="180" height="22" />
      <rect x="5" y="55" rx="2" ry="2" width="22" height="22" />
      <rect x="35" y="55" rx="2" ry="2" width="180" height="22" />
      <rect x="5" y="95" rx="2" ry="2" width="22" height="22" />
      <rect x="35" y="95" rx="2" ry="2" width="180" height="22" />
      <rect x="5" y="135" rx="2" ry="2" width="22" height="22" />
      <rect x="35" y="135" rx="2" ry="2" width="180" height="22" />
      <rect x="5" y="175" rx="2" ry="2" width="22" height="22" />
      <rect x="35" y="175" rx="2" ry="2" width="180" height="22" />
      <rect x="5" y="215" rx="2" ry="2" width="22" height="22" />
      <rect x="35" y="215" rx="2" ry="2" width="180" height="22" />
    </ContentLoader>
  </div>
);

export default MyLoader;
