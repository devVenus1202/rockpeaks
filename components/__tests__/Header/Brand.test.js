import * as React from 'react';
import { shallow } from 'enzyme';

import Brand from '../../Header/Brand';

describe('Brand Component', () => {
  let component;

  beforeEach(() => {
    component = shallow(<Brand />);
  });

  it('renders img', () => {
    expect(component.find('img')).toHaveLength(1);
  });
});
