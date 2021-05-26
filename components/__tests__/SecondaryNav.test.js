import * as React from 'react';
import { shallow } from 'enzyme';

import SecondaryNav from '../SecondaryNav';

describe('SecondaryNav Component', () => {
  let component;

  beforeEach(() => {
    component = shallow(<SecondaryNav />);
  });

  it('renders Navbar', () => {
    expect(component.find('Navbar')).toHaveLength(1);
  });

  it('renders NavbarBrand', () => {
    expect(component.find('NavbarBrand')).toHaveLength(1);
  });

  it('renders Navbar', () => {
    expect(component.find('Navbar')).toHaveLength(1);
  });

  it('renders Nav', () => {
    expect(component.find('Nav')).toBeTruthy();
  });
});
