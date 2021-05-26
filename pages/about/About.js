import React from 'react';
import App from '@components/App';
import StaticPage from '@components/StaticPage';

const About = props => (
  <App>
    <article>
      <h1>About</h1>
      <StaticPage title="about" />
    </article>
  </App>
);

export default About;
