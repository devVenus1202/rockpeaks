import * as React from 'react';
import { shallow } from 'enzyme';

import ContentNavbar from '../../ContentSelectPanel/ContentNavbar';

describe('ContentNavbar Component', () => {
  let component;

  beforeEach(() => {
    component = shallow(<ContentNavbar />);
  });

  it('renders Navbar', () => {
    expect(component.find('Navbar')).toBeTruthy();
  });

  it('renders Nav', () => {
    expect(component.find('Nav')).toBeTruthy();
  });

  it('renders NavItem', () => {
    expect(component.find('NavItem')).toBeTruthy();
  });

  it('renders NavLink', () => {
    expect(component.find('NavLink')).toBeTruthy();
  });
});
