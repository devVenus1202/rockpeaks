import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { text } from '@storybook/addon-knobs/react';
import MediaActivity from './MediaActivity';
import MediaLoader from './MediaLoader';

storiesOf('Medias/MediaActivity', module)
  .add('default', withInfo()(() => {
    const dateTime = text('dateTime', 'Tuesday, September 15, 2016');
    const artist = text('artist', 'Guy Clark Jr');
    const show = text('show', 'Promo Videos from 2016');
    const title = text('title', 'Lorem ipsum dolor sit amet, consectetur adipisicing.');

    return (
      <MediaActivity
        imgUrl={null}
        dateTime={dateTime}
        artist={artist}
        show={show}
        title={title}
      />
    );
  }));


  storiesOf('Medias/MediaActivity', module)
  .add('MediaLoader', () => (
    <MediaLoader />
  ));
