import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { ICONS } from '@lib/icons';
import Icon from '.';
import AllIcons from './AllIcons';

import './Icon.style.scss';


storiesOf('Icon', module)
  .add('default',  () => (
    <AllIcons />
  ));

Object.keys(ICONS).forEach(key => (
  storiesOf('Icon/List', module)
    .addDecorator(story => (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        {story()}
      </div>
    ))
    .add(key, withInfo()(() => (
      <div>
        <Icon icon={ICONS[key]} size="64" color="white" />
        <p>&nbsp;</p>
        <p>import Icon from &#39;@components/Icon&#39;;</p>
        <p>import &#123; ICONS &#125; from &#39;@lib/icons&#39;;</p>
        <p>&nbsp;</p>
        <p>
          &lt;Icon icon=&#123;ICONS.
          {key}
          &#125; size=&#34;64&#34; color=&#34;white&#34; /&gt;
        </p>
      </div>
    )))
));
