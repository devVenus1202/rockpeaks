import * as React from 'react';
import { shallow } from 'enzyme';

import DatePicker from '../../DatePicker';

describe('DatePicker Component', () => {
  let component;

  beforeEach(() => {
    component = shallow(<DatePicker />);
  });

  it('renders Card', () => {
    expect(component.find('div.secondary-card')).toHaveLength(1);
  });

  it('renders DatePickerHeader', () => {
    expect(component.find('DatePickerHeader')).toHaveLength(1);
  });

  it('renders Form', () => {
    expect(component.find('Form')).toHaveLength(1);
  });

  it('renders Input', () => {
    expect(component.find('Input')).toHaveLength(2);
  });

  it('renders Calendar', () => {
    expect(component.find('Calendar')).toHaveLength(1);
  });
});
