import React from 'react';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs/react';
import VideoPlayer from './VideoPlayer';


storiesOf('Utilities', module)
  .add('VideoPlayer', () => {
    const url = text('srcURL', 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4', 'srcURL');

    return <VideoPlayer srcURL={url} />
  });
