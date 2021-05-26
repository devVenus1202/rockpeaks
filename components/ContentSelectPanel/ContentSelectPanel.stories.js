import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { select } from '@storybook/addon-knobs/react';
import cookie from 'cookie';
import { ApolloProvider } from 'react-apollo';
import initApollo from '@lib/initApollo';
import ContentSelectPanel from './ContentSelectPanel';
import ContentNavbar from './ContentNavbar';
import StatsGrid from './StatsGrid';
import SwitchType from './SwitchType';
import './ContentSelectPanel.style.scss';

function parseCookies(req, options = {}) {
  return cookie.parse(req ? req.headers.cookie || '' : document.cookie, options);
}

const apolloClient = initApollo(
  {},
  {
    getToken: req => parseCookies(req).token,
  },
);

const mockHandler = () => {};

storiesOf('ContentSelectPanel', module).add('default', () => {
  const categories = ['all', 'clip', 'disc', 'artist', 'show'];
  const category = select('category', categories, 'clip', 'category');

  return (
    <ApolloProvider client={apolloClient}>
      <ContentSelectPanel
        category={category}
        onSelectCategory={mockHandler}
        view={1}
        onChangeView={mockHandler}
      />
    </ApolloProvider>
  );
});

storiesOf('ContentSelectPanel/ContentNavbar', module).add('default', () => (
  <ContentNavbar value="clip" selectCategory={mockHandler} selectable={1} />
));

storiesOf('ContentSelectPanel/StatsGrid', module).add(
  'default',
  withInfo()(() => {
    return (
      <ApolloProvider client={apolloClient}>
        <StatsGrid />
      </ApolloProvider>
    );
  }),
);

storiesOf('ContentSelectPanel/SwitchType', module).add('default', () => (
  <SwitchType type={1} onChange={mockHandler} />
));
