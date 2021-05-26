import * as React from 'react';
import { shallow } from 'enzyme';

import SocialButtons from '../../Sign/SocialButtons';

describe('SocialButtons Component', () => {
  let component;

  beforeEach(() => {
    component = shallow(<SocialButtons />);
  });

  it('renders Button', () => {
    expect(component.find('Button')).toBeTruthy();
  });

  it('renders 3 icons', () => {
    expect(component.find('i')).toHaveLength(3);
  });
});
