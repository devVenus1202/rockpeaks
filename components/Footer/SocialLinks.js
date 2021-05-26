import React, { Component } from 'react';
import { ICONS } from '@lib/icons';
import Icon from '../Icon';

class SocialLinks extends Component {
  render() {
    return (
      <ul className="list-inline social-list mb-0">
        <li className="list-inline-item">
          <a className="facebook-link" href="https://facebook.com">
            <Icon size={16} icon={ICONS.FACEBOOK} />
          </a>
        </li>
        <li className="list-inline-item">
          <a className="twitter-link" href="https://twitter.com">
            <Icon size={16} icon={ICONS.TWITTER} />
          </a>
        </li>
      </ul>
    );
  }
}

export default SocialLinks;
