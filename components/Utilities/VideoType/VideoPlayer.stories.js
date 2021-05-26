import React from 'react';
import { storiesOf } from '@storybook/react';
import VideoType from './VideoType';

storiesOf('Utilities', module)
  .add('VideoType', () => {
    
    return <VideoType type={0} />
  });
