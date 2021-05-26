import React from 'react';
import { storiesOf } from '@storybook/react';
import Tree from '.';

const data = {
  name: 'root',
  toggled: true,
  children: [
    {
      name: 'parent',
      children: [
        { name: 'child1' },
        { name: 'child2' },
      ],
    },
    {
      name: 'loading parent',
      loading: true,
      children: [],
    },
    {
      name: 'parent',
      children: [
        {
          name: 'nested parent',
          children: [
            { name: 'nested child 1' },
            { name: 'nested child 2' },
          ],
        },
      ],
    },
  ],
};

const onToggle = (node, toggled) => {
  if (this.state.cursor) { this.state.cursor.active = false; }
  const nodeMod = node;
  nodeMod.active = true;
  if (nodeMod.children) { nodeMod.toggled = toggled; }
  this.setState({ cursor: nodeMod });
};

storiesOf('Tree', module)
  .add('default', () => {
    return <Tree data={data} onToggle={onToggle} />;
  });
