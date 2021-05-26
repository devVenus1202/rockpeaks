import React from 'react';
import { storiesOf } from '@storybook/react';
import SingleSongName from './SingleSongName';

const mockHandler = () => {};

storiesOf('AddClipForm/SingleSongName', module)
  .add('default', () => {
    return (
      <SingleSongName
        setClipField={mockHandler}
        onNext={mockHandler}
        onBack={mockHandler}
      />
    );
  });
