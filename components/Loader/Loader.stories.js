import React from 'react';
import { storiesOf } from '@storybook/react';
import {
  CarouselLoader,
  ListLoader,
  Loader,
  PageContentLoader,
  SecondaryNavLoader,
  SlideLoader,
} from '.';

storiesOf('Loader', module)
  .add('default', () => {
    return (
      <div style={{ width: '320px' }}>
        <Loader />
      </div>
    );
  })
  .add('SecondaryNavLoader', () => {
    return (
      <div style={{ width: '400px' }}>
        <SecondaryNavLoader />
      </div>
    );
  })
  .add('PageContentLoader', () => {
    return (
      <div style={{ width: '600px' }}>
        <PageContentLoader />
      </div>
    );
  })
  .add('ListLoader', () => {
    return (
      <div style={{ width: '280px' }}>
        <ListLoader />
      </div>
    );
  })
  .add('CarouselLoader', () => {
    return (
      <div style={{ width: '728px' }}>
        <CarouselLoader />
      </div>
    );
  })
  .add('SlideLoader', () => {
    return (
      <div style={{ width: '728px' }}>
        <SlideLoader />
      </div>
    );
  });
