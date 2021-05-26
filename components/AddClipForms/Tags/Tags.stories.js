import React from 'react';
import { storiesOf } from '@storybook/react';
import Tags from './Tags';

const mockHandler = () => {};

storiesOf('AddClipForm/Tags', module)
  .add('default', () => {
    return (
      <Tags
        setClipField={mockHandler}
        onNext={mockHandler}
        onBack={mockHandler}
      />
    );
  });
