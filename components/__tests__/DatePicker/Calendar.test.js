import * as React from 'react';
import { shallow } from 'enzyme';

import Calendar from '../../DatePicker/Calendar';

describe('Calendar Component', () => {
  let component;
  const props = {
    date: 12312312,
    onChange: jest.fn(),
  };

  beforeEach(() => {
    component = shallow(<Calendar {...props} />);
  });

  it('renders calendar', () => {
    expect(component.find('div.calendar')).toHaveLength(1);
  });
});
