import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, boolean } from '@storybook/addon-knobs/react';
import apolloStorybookDecorator from 'apollo-storybook-react';

import Profile from '.';
import ContactForm from './ContactForm';

const typeDefs = `
  type Query {
    name: String
  }

  schema {
    query: Query
  }
`;

const mocks = {
  Query: () => {
    return {
      userById: () => {
        return { name: 'RP Contributor', mail: '' };
      },
    };
  },
};
storiesOf('Profile', module)
  .addDecorator(
    apolloStorybookDecorator({
      typeDefs,
      mocks,
    }),
  )
  .add('default', () => {
    const userId = text('user', 'User', 'user');
    return <Profile userInfo={{ userInfo: { user_id: '124' } }} />;
  })
  .add('ContactForm', () => {
    const isLight = boolean('isLight', false, false);
    const userId = text('user', 'User', 'user');
    return (
      <div className={`theme-${isLight ? 'light' : 'dark'}`}>
        <ContactForm />
      </div>
    );
  });
