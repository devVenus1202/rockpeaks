import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { text } from '@storybook/addon-knobs/react';
import MediaBox from './MediaBox';
import MediaLoader from './MediaLoader';

storiesOf('Medias/MediaBox', module)
  .add('default', withInfo()(() => {
    const dateTime = text('dateTime', 'Tuesday, September 15, 2016');
    const artist = text('artist', 'Guy Clark Jr');
    const show = text('show', 'Promo Videos from 2016');
    const title = text('title', 'Lorem ipsum dolor sit amet, consectetur adipisicing.');

    return (
      <MediaBox
        imgUrl={null}
        dateTime={dateTime}
        artist={artist}
        show={show}
        title={title}
      />
    );
  }));


  storiesOf('Medias/MediaBox', module)
  .add('MediaLoader', () => (
    <MediaLoader />
  ));
