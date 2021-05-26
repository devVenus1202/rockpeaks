import * as React from 'react';
import { shallow } from 'enzyme';

import StatsGrid from '../../ContentSelectPanel/StatsGrid';

describe('StatsGrid Component', () => {
  let component;

  beforeEach(() => {
    component = shallow(<StatsGrid />);
  });

  it('renders Total information div', () => {
    expect(component.find('div.total-information')).toHaveLength(1);
  });

  it('renders 4 cells', () => {
    expect(component.find('div.total-information-cell')).toHaveLength(4);
  });
});
