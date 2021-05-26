import * as React from 'react';
import { shallow } from 'enzyme';

import { HeaderMenu } from '../../Header/HeaderMenu';

describe('HeaderMenu Component', () => {
  let component;
  const props = {
    router: jest.mock('next/router'),
  };

  beforeEach(() => {
    component = shallow(<HeaderMenu {...props} />);
  });

  it('renders Header', () => {
    expect(component.find('Navbar')).toBeTruthy();
  });

  it('renders Brand', () => {
    expect(component.find('Brand')).toHaveLength(1);
  });

  it('renders Icon', () => {
    expect(component
      .find('NavbarToggler')
      .children()
      .find('Icon'))
      .toHaveLength(1);
  });
});
