import * as React from 'react';
import { shallow } from 'enzyme';

import Login from '../../Header/Login';

describe('Login Component', () => {
  let component;

  beforeEach(() => {
    component = shallow(<Login />);
  });

  it('renders NavItem', () => {
    expect(component.find('NavItem')).toHaveLength(1);
  });

  it('renders Login Navlink', () => {
    const name = 'Login';

    expect(component.find('NavLink').children().text()).toEqual(name);
  });
});
