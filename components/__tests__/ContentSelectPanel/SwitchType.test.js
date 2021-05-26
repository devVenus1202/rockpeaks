import * as React from 'react';
import { shallow } from 'enzyme';

import SwitchType from '../../ContentSelectPanel/SwitchType';

describe('SwitchType Component', () => {
  let component;
  const props = {
    type: true,
    onChange: jest.fn(),
  };

  beforeEach(() => {
    component = shallow(<SwitchType {...props} />);
  });

  it('renders switch type div', () => {
    expect(component.find('div.switch-type')).toHaveLength(1);
  });

  it('renders ButtonGroup', () => {
    expect(component.find('ButtonGroup')).toHaveLength(1);
  });

  it('renders 2 Buttons', () => {
    expect(component.find('Button')).toHaveLength(2);
  });
});
