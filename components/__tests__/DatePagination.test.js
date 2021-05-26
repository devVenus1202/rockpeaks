import * as React from 'react';
import { mount } from 'enzyme';
import moment from 'moment';
import DatePagination from '../DatePagination';

describe('DatePagination Component', () => {
  let component;
  const props = {
    onChange: jest.fn(),
    count: 10,
    value: moment(),
  };

  beforeEach(() => {
    component = mount(<DatePagination {...props} />);
  });

  it('renders nav', () => {
    expect(component.find('nav')).toHaveLength(1);
  });

  it('renders ul', () => {
    expect(component.find('ul')).toHaveLength(1);
  });

  it('renders items', () => {
    expect(component.find('li')).toHaveLength(props.count * 2);
  });
});
