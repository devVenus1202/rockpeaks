import React from 'react';
import { storiesOf } from '@storybook/react';
import EmbedCode from './EmbedCode';

const mockHandler = () => {};

storiesOf('AddClipForm/EmbedCode', module)
  .add('default', () => (
    <EmbedCode
      videoURL=""
      onChangeURL={mockHandler}
      onNext={mockHandler}
    />
  ));
