import * as React from 'react';
import { shallow } from 'enzyme';

import User from '../../Header/User';

describe('User Component', () => {
  let component;

  beforeEach(() => {
    component = shallow(<User />);
  });

  it('renders Dropdown', () => {
    expect(component.find('Dropdown')).toHaveLength(1);
  });

  it('renders DropdownMenu', () => {
    expect(component.find('DropdownMenu')).toHaveLength(1);
  });

  it('renders User image', () => {
    expect(component
      .find('DropdownToggle')
      .children()
      .find('img'))
      .toHaveLength(1);
  });
});
