import React from 'react';
import { storiesOf } from '@storybook/react';
import apolloStorybookDecorator from 'apollo-storybook-react';
import { text } from '@storybook/addon-knobs/react';
import AppContext from '@components/AppContext';
import SecondaryNav from './SecondaryNav';
import './SecondaryNav.style.scss';

const typeDefs = `
  type Query {
    helloWorld: String
  }

  schema {
    query: Query
  }
`;

const mocks = {
  Query: () => {
    return {
      helloWorld: () => {
        return 'Hello from Apollo!!';
      },
    };
  },
};

const authentication = {
  userInfo: { name: 'XX', email: 'xxx' },
  isLogin: true,
};

storiesOf('SecondaryNav', module)
  .addDecorator(
    apolloStorybookDecorator({
      typeDefs,
      mocks,
    }),
  )
  .addDecorator(getStory => {
    return <AppContext authentication={authentication}>{getStory()}</AppContext>;
  })
  .add('default', () => {
    const brand = text('brand', 'Show Name', 'brand');
    const theme = text('theme', 'dark', 'theme');
    return (
      <div className={`theme-${theme}`}>
        <SecondaryNav brand={brand} type="clip" theme={theme} />
      </div>
    );
  });
