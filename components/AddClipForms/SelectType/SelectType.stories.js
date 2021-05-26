import React from 'react';
import { ApolloProvider } from 'react-apollo';
import cookie from 'cookie';
import initApollo from '@lib/initApollo';
import { storiesOf } from '@storybook/react';
import SelectType from './SelectType';

function parseCookies(req, options = {}) {
  return cookie.parse(
    req ? req.headers.cookie || '' : document.cookie,
    options
  );
}

const apolloClient = initApollo({}, {
  getToken: req => parseCookies(req).token,
});

const mockHandler = () => {};

storiesOf('AddClipForm/SelectType', module)
  .add('default', () => {
    const videoInfo = {
      thumbnail: 'https://picsum.photos/200/300/?random',
      description: 'The Cure -British Summer - yde Park -7 july 2018 : Full show (40th Anniversary Concert) Retrouvez toutes mes vidéos de The Cure ici : https://www.facebook.com/the.cure.video/ Find all my videos of The Cure here: https://www.facebook.com/the.cure.video/',
    };
    return (
      <ApolloProvider client={apolloClient}>
        <SelectType
          videoInfo={videoInfo}
          setMusicType={mockHandler}
          setClipField={mockHandler}
          onNext={mockHandler}
          onBack={mockHandler}
        />
      </ApolloProvider>
    );
  });
