import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import apolloStorybookDecorator from 'apollo-storybook-react';
import { text, boolean, select } from '@storybook/addon-knobs/react';

import Sign from './Sign';
import SocialButtons from './SocialButtons';
import './Sign.style.scss';

const mockHandler = () => { };

const typeDefs = `
  type Query {
    helloWorld: String
  }

  schema {
    query: Query
  }
`;

const resolveThemeKnobValue = () => {
  const typeValue = select('Theme', ['dark', 'light'], 'dark');
  return typeValue;
};

const mocks = {
  Query: () => {
    return {
      helloWorld: () => {
        return 'Hello from Apollo!!';
      },
    };
  },
};

storiesOf('Sign', module)
  .addDecorator(
    apolloStorybookDecorator({
      typeDefs,
      mocks,
    }),
  )
  .add('Sign In', () => {
    // const theme = boolean('type', false, false);
    return (
      <Sign
        toggle={mockHandler}
        changeType={mockHandler}
        type={0}
        isOpen
        theme={resolveThemeKnobValue()}
      />
    );
  })
  .add(
    'Register',
    withInfo()(() => {
      // const theme = boolean('type', false, false);
      return (
        <Sign
          toggle={mockHandler}
          changeType={mockHandler}
          type={1}
          isOpen
          theme={resolveThemeKnobValue()}
        />
      );
    }),
  )
  .add(
    'Password Forgot',
    withInfo()(() => {
      // const theme = boolean('type', false, false);
      return (
        <Sign
          toggle={mockHandler}
          changeType={mockHandler}
          type={2}
          isOpen
          theme={resolveThemeKnobValue()}
        />
      );
    }),
  );

storiesOf('Sign/SocialButtons', module).add('default', () => (
  <SocialButtons type={0} theme={resolveThemeKnobValue()} />
));
