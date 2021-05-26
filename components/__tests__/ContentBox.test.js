import * as React from 'react';
import { shallow } from 'enzyme';
import moment from 'moment';
import ContentBox from '../ContentBox';

describe('ContentBox Component', () => {
  let component;
  const props = {
    date: moment(),
    category: 'all',
    types: {},
  };

  beforeEach(() => {
    component = shallow(<ContentBox {...props} />);
  });

  it('renders content box', () => {
    expect(component.find('div.content-box')).toHaveLength(1);
  });

  it('renders content-scroll-box', () => {
    expect(component.find('div.content-scroll-box')).toHaveLength(2);
  });
});
