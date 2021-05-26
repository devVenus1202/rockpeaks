import * as React from 'react';
import { shallow } from 'enzyme';

import TypeBox from '../TypeBox';

describe('TypeBox Component', () => {
  let component;
  const props = {
    category: 'all',
    onChange: jest.fn(),
    types: {},
  };

  beforeEach(() => {
    component = shallow(<TypeBox {...props} />);
  });

  it('renders Card wrapper', () => {
    expect(component.find('div.secondary-card')).toHaveLength(1);
  });

  it('renders Card Header', () => {
    expect(component.find('div.secondary-card-header')).toHaveLength(1);
  });

  it('renders Card Body', () => {
    expect(component.find('div.secondary-card-body')).toHaveLength(1);
  });

  it('renders Card Footer', () => {
    expect(component.find('div.secondary-card-footer')).toHaveLength(1);
  });

  it('renders Header Text', () => {
    const text = 'TYPES';
    expect(
      component
      .find('div.secondary-card-header')
      .children()
      .find('h4')
      .children()
      .text()).toBe(text);
  });

  it('renders search component', () => {
    expect(
      component
      .find('div.secondary-card-footer')
      .children()
      .find('SearchForm')
    ).toHaveLength(1);
  });
});
