import * as React from 'react';
import { shallow } from 'enzyme';

import ContentSelectPanel from '../../ContentSelectPanel';

describe('ContentSelectPanel Component', () => {
  let component;

  beforeEach(() => {
    component = shallow(<ContentSelectPanel />);
  });

  it('renders secondary-nav-section', () => {
    expect(component.find('div.secondary-nav-section')).toHaveLength(1);
  });

  it('renders container', () => {
    expect(component.find('div.container')).toHaveLength(1);
  });

  it('renders panel', () => {
    expect(component.find('div.panel')).toHaveLength(1);
  });

  it('renders ContentNavbar', () => {
    expect(component.find('div.ContentNavbar')).toBeTruthy();
  });

  it('renders StatsGrid', () => {
    expect(component.find('div.StatsGrid')).toBeTruthy();
  });

  it('renders SwitchType', () => {
    expect(component.find('div.SwitchType')).toBeTruthy();
  });
});
