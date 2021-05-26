import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { text, boolean, select } from '@storybook/addon-knobs/react';

import Footer from '.';
import Copyright from './Copyright';
import FooterMenu from './FooterMenu';
import SocialLinks from './SocialLinks';

import './Footer.style.scss';

storiesOf('Footer', module)
  .add('default', () => {
    const theme = boolean('LightTheme', false, false);
    return (
      <div className={theme ? 'theme-light' : 'theme-dark'}>
        <Footer />
      </div>
    );
  })
  .add('default with info', withInfo()(() => <Footer />));

storiesOf('Footer/Components/Copyright', module).add('default', () => <Copyright />);

storiesOf('Footer/Components/FooterMenu', module).add('default', () => <FooterMenu />);

storiesOf('Footer/Components/SocialLinks', module).add('default', () => <SocialLinks />);
