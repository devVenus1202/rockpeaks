import * as React from 'react';
import { shallow } from 'enzyme';

import DateSwitch from '../DateSwitch';

describe('DateSwitch Component', () => {
  let component;
  const props = {
    value: 'time value',
  };

  beforeEach(() => {
    component = shallow(<DateSwitch {...props} />);
  });

  it('renders ButtonGroup', () => {
    expect(component.find('ButtonGroup')).toHaveLength(1);
  });

  it('renders 3 Buttons', () => {
    expect(component.find('Button')).toHaveLength(3);
  });
});
