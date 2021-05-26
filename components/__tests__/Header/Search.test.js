import * as React from 'react';
import { shallow } from 'enzyme';

import Search from '../../Header/Search';

describe('Search Component', () => {
  let component;

  beforeEach(() => {
    component = shallow(<Search />);
  });

  it('renders form', () => {
    expect(component.find('form')).toHaveLength(1);
  });

  it('renders Dropdown', () => {
    expect(component.find('Dropdown')).toHaveLength(1);
  });

  it('renders DropdownMenu', () => {
    expect(component.find('DropdownMenu')).toHaveLength(1);
  });
});
