import * as React from 'react';
import { shallow } from 'enzyme';

import DatePickerHeader from '../../DatePicker/DatePickerHeader';

describe('DatePickerHeader Component', () => {
  let component;

  beforeEach(() => {
    component = shallow(<DatePickerHeader />);
  });

  it('renders Card Header', () => {
    expect(component.find('div.secondary-card-header')).toHaveLength(1);
  });

  it('renders Heading', () => {
    expect(component.find('h4')).toHaveLength(1);
  });

  it('renders Arrow image', () => {
    expect(component
      .find('a.calendar-btn')
      .children()
      .find('img')
    ).toHaveLength(1);
  });

  it('renders select text', () => {
    const text = 'Select a month, year and day:';
    expect(component
      .find('p')
      .children()
      .text()
    ).toBe(text);
  });
});
