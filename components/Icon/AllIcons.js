import React, { Component } from 'react';
import { ICONS } from '@lib/icons';
import Icon from '.';

class AllIcons extends Component {
  render() {
    const Icons = Object.keys(ICONS).map(key => (
      <li key={key}>
        <Icon icon={ICONS[key]} size={64} color="white" />
        <span>{key}</span>
      </li>
)
    );
    return (
      <div>
        <ul>
          {Icons}
        </ul>
        <style>
          {`
            ul {
              list-style: none;
              padding: 1.5rem;
              margin: 0;
            }
            li {
              display: inline-block;
              list-style: none;
              padding: 1rem;
              margin: 0;
              text-align: center;
            }
            span {
              display: block;
              padding: 0.5rem;
            }
          `}
        </style>
      </div>
    );
  }
}

export default AllIcons;
