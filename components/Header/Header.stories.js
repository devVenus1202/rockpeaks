import React from 'react';
import { storiesOf } from '@storybook/react';
import apolloStorybookDecorator from 'apollo-storybook-react';
import { text, boolean, select } from '@storybook/addon-knobs/react';

import Header from '.';
import './Header.style.scss';

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
storiesOf('Header', module)
  .addDecorator(
    apolloStorybookDecorator({
      typeDefs,
      mocks,
    }),
  )
  .add('default', () => {
    const theme = text('theme', 'dark', 'theme');
    const type = boolean('type', false, false);
    return <Header theme={theme} type={type} />;
  });
