import React from 'react';
import { storiesOf } from '@storybook/react';
import Review from './Review';

const mockHandler = () => {};

storiesOf('AddClipForm/Review', module)
  .add('default', () => {
    const videoInfo = {
      thumbnail: 'https://picsum.photos/200/300/?random',
      description: 'The Cure -British Summer - yde Park -7 july 2018 : Full show (40th Anniversary Concert) Retrouvez toutes mes vidéos de The Cure ici : https://www.facebook.com/the.cure.video/ Find all my videos of The Cure here: https://www.facebook.com/the.cure.video/',
    };
    return (
      <Review
        clipData={{}}
        videoInfo={videoInfo}
        onNext={mockHandler}
        onBack={mockHandler}
      />
    );
  });
