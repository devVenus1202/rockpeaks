import React from 'react';
import ContentLoader from 'react-content-loader';

const MyLoader = props => (
  <div style={{ height: '470px', width: '600px' }}>
    <ContentLoader
      height={470}
      width={600}
      speed={4}
      primaryColor="#3d4d65"
      secondaryColor="#b9c5d8"
      {...props}
    >
      <rect x="9.05" y="10.67" rx="1" ry="1" width="133" height="75" />
      <rect x="150" y="30" rx="3" ry="3" width="250" height="13" />
      <rect x="150" y="54" rx="3" ry="3" width="150" height="10" />
      <rect x="310" y="54" rx="3" ry="3" width="110" height="10" />
      <rect x="430" y="54" rx="3" ry="3" width="110" height="10" />

      <rect x="9.05" y="135" rx="1" ry="1" width="133" height="75" />
      <rect x="150" y="155" rx="3" ry="3" width="250" height="13" />
      <rect x="150" y="180" rx="3" ry="3" width="150" height="10" />
      <rect x="310" y="180" rx="3" ry="3" width="110" height="10" />
      <rect x="430" y="180" rx="3" ry="3" width="110" height="10" />

      <rect x="9.05" y="260" rx="1" ry="1" width="133" height="75" />
      <rect x="150" y="280" rx="3" ry="3" width="250" height="13" />
      <rect x="150" y="305" rx="3" ry="3" width="150" height="10" />
      <rect x="310" y="305" rx="3" ry="3" width="110" height="10" />
      <rect x="430" y="305" rx="3" ry="3" width="110" height="10" />

      <rect x="9.05" y="385" rx="1" ry="1" width="133" height="75" />
      <rect x="150" y="405" rx="3" ry="3" width="250" height="13" />
      <rect x="150" y="430" rx="3" ry="3" width="150" height="10" />
      <rect x="310" y="430" rx="3" ry="3" width="110" height="10" />
      <rect x="430" y="430" rx="3" ry="3" width="110" height="10" />
    </ContentLoader>
  </div>
);

export default MyLoader;
