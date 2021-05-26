import React from 'react';
import { storiesOf } from '@storybook/react';
import ImageBox from './ImageBox';


storiesOf('Utilities/ImageBox', module)
  .add('default', () => (
    <ImageBox src="https://picsum.photos/200/300/?random" />
  ))
  .add('Image not provided', () => (
    <ImageBox src="" />
  ));
