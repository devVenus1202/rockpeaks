import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import MediaTableBox from './MediaTableBox';
import MediaTableBoxLoader from './MediaTableBoxLoader';

storiesOf('Medias/MediaTableBox', module)
  .add('default', withInfo()(() => {
    return (
      <MediaTableBox
        type="clip"
        data={{
          artist: 'artist',
          show: 'show',
          date: '2000 06-11',
        }}
      />
    );
  }));


  storiesOf('Medias/MediaTableBox', module)
  .add('MediaTableBoxLoader', () => (
    <MediaTableBoxLoader />
  ));
