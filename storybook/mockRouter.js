import Router from 'next/router';
import { action } from '@storybook/addon-actions';

const actionWithPromise = () => {
  action('clicked link')();
  // we need to return promise because it is needed by Link.linkClicked
  return new Promise((resolve, reject) => reject());
};

const mockedRouter = {
  push: actionWithPromise,
  replace: actionWithPromise,
  prefetch: () => {},
};

Router.router = mockedRouter;
