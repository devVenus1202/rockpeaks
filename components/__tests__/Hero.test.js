import * as React from 'react';
import { shallow } from 'enzyme';

import Hero from '../Hero';

describe('Hero Component', () => {
  let component;
  const props = {
    bgClass: 'class',
    title: 'title',
    body: 'body',
    url: 'url',
    nextSection: 'section',
    type: false,
  };

  beforeEach(() => {
    component = shallow(<Hero {...props} />);
  });

  it('renders section', () => {
    expect(component.find('section')).toHaveLength(1);
  });

  it('renders Learn more button', () => {
    const buttonText = 'LEARN MORE';

    expect(component
      .find('Link')
      .children()
      .find('a')
      .text())
      .toEqual(buttonText);
  });
});
