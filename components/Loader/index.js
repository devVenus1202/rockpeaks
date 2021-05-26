import React from 'react';

import ContentLoader, { Facebook } from 'react-content-loader';

const Loader = () => <Facebook />;

const SecondaryNavLoader = props => (
  <ContentLoader
    height={160}
    width={400}
    speed={1}
    primaryColor="#b9c5d8"
    secondaryColor="#6b6c6f"
    primaryOpacity={0.5}
    secondaryOpacity={0.5}
    {...props}
  >
    <rect x="0" y="4" rx="3" ry="3" width="218.45" height="23.36" />
    <rect x="0" y="51" rx="3" ry="3" width="350" height="6.4" />
    <rect x="0" y="71" rx="3" ry="3" width="380" height="6.4" />
    <rect x="0" y="91" rx="3" ry="3" width="201" height="6.4" />
    <rect x="0" y="111" rx="3" ry="3" width="350" height="6.4" />
    <rect x="0" y="131" rx="3" ry="3" width="380" height="6.4" />
    <rect x="0" y="151" rx="3" ry="3" width="201" height="6.4" />
  </ContentLoader>
);

const PageContentLoader = props => (
  <ContentLoader
    height={410}
    width={600}
    speed={1}
    primaryColor="#b9c5d8"
    secondaryColor="#ecebeb"
    primaryOpacity={0.5}
    secondaryOpacity={0.5}
    {...props}
  >
    <rect x="0" y="28" rx="3" ry="3" width="120" height="16" />
    <rect x="200" y="28" rx="3" ry="3" width="100" height="16" />
    <circle cx="180" cy="35" r="12" />
    <rect x="350" y="28" rx="3" ry="3" width="100" height="16" />
    <circle cx="330" cy="35" r="12" />
    <rect x="0" y="147" rx="3" ry="3" width="350" height="48" />
    <rect x="0" y="323" rx="3" ry="3" width="380" height="6.4" />
    <rect x="0" y="343" rx="3" ry="3" width="201" height="6.4" />
    <rect x="0" y="363" rx="3" ry="3" width="350" height="6.4" />
    <rect x="0" y="383" rx="3" ry="3" width="380" height="6.4" />
    <rect x="0" y="403" rx="3" ry="3" width="201" height="6.4" />
  </ContentLoader>
);

const ListLoader = props => (
  <ContentLoader
    height={185}
    width={280}
    speed={1}
    primaryColor="#b9c5d8"
    secondaryColor="#ecebeb"
    primaryOpacity={0.5}
    secondaryOpacity={0.5}
    {...props}
  >
    <rect x="24" y="22" rx="3" ry="3" width="215" height="16" />
    <rect x="24" y="64" rx="3" ry="3" width="215" height="16" />
    <rect x="24" y="106" rx="3" ry="3" width="215" height="16" />
  </ContentLoader>
);

const SlideLoader = props => {
  return (
    <ContentLoader
      height={420}
      width={1310}
      speed={1}
      primaryColor="#b9c5d8"
      secondaryColor="#ecebeb"
      primaryOpacity={0.5}
      secondaryOpacity={0.5}
      {...props}
    >
      <rect x="40" y="40" rx="3" ry="3" width="300" height="177" />
      <rect x="40" y="237" rx="3" ry="3" width="200" height="10" />
      <rect x="40" y="267" rx="3" ry="3" width="100" height="10" />
      <rect x="40" y="297" rx="3" ry="3" width="120" height="10" />

      <rect x="350" y="40" rx="3" ry="3" width="300" height="177" />
      <rect x="350" y="237" rx="3" ry="3" width="200" height="10" />
      <rect x="350" y="267" rx="3" ry="3" width="100" height="10" />
      <rect x="350" y="297" rx="3" ry="3" width="120" height="10" />

      <rect x="660" y="40" rx="3" ry="3" width="300" height="177" />
      <rect x="660" y="237" rx="3" ry="3" width="200" height="10" />
      <rect x="660" y="267" rx="3" ry="3" width="100" height="10" />
      <rect x="660" y="297" rx="3" ry="3" width="120" height="10" />

      <rect x="970" y="40" rx="3" ry="3" width="300" height="177" />
      <rect x="970" y="237" rx="3" ry="3" width="200" height="10" />
      <rect x="970" y="267" rx="3" ry="3" width="100" height="10" />
      <rect x="970" y="297" rx="3" ry="3" width="120" height="10" />
    </ContentLoader>
  );
};

const CarouselLoader = props => (
  <ContentLoader
    height={420}
    width={728}
    speed={1}
    primaryColor="#b9c5d8"
    secondaryColor="#ecebeb"
    primaryOpacity={0.5}
    secondaryOpacity={0.5}
    {...props}
  >
    <rect x="15" y="12" rx="3" ry="3" width="100" height="14" />
    <rect x="145" y="12" rx="3" ry="3" width="100" height="14" />
    <rect x="275" y="12" rx="3" ry="3" width="100" height="14" />
    <rect x="0" y="38" rx="0" ry="0" width="728" height="1" />
    <rect x="45" y="70" rx="3" ry="3" width="638" height="5.6" />
    <rect x="45" y="120" rx="3" ry="3" width="314" height="177" />
    <rect x="369" y="120" rx="3" ry="3" width="314" height="177" />
    <rect x="45" y="317" rx="3" ry="3" width="100" height="10" />
    <rect x="45" y="347" rx="3" ry="3" width="60" height="10" />
    <rect x="45" y="377" rx="3" ry="3" width="120" height="10" />
    <rect x="45" y="407" rx="3" ry="3" width="100" height="10" />
    <rect x="369" y="317" rx="3" ry="3" width="100" height="10" />
    <rect x="369" y="347" rx="3" ry="3" width="60" height="10" />
    <rect x="369" y="377" rx="3" ry="3" width="120" height="10" />
    <rect x="369" y="407" rx="3" ry="3" width="100" height="10" />
  </ContentLoader>
);

export default Loader;

export {
  CarouselLoader,
  ListLoader,
  Loader,
  SecondaryNavLoader,
  PageContentLoader,
  SlideLoader,
};
