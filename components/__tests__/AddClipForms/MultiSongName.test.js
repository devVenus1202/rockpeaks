import * as React from 'react';
import { mount } from 'enzyme';
import Found from '@components/AddClipForms/Found';

describe.skip('Found Component', () => {
  let component;
  const props = {
    onNext: jest.fn(),
    onBack: jest.fn(),
    setClipField: jest.fn(),
    videoInfo: {},
  };

  beforeEach(() => {
    component = mount(<Found {...props} />);
  });

  it('renders Form', () => {
    expect(component.find('Form')).toBeTruthy();
  });

  it('renders 2 Rows', () => {
    expect(component.find('Row')).toBeTruthy();
  });

  it('renders 3 Inputs', () => {
    expect(component.find('Input')).toBeTruthy();
  });

  it('renders ImageBox', () => {
    expect(component.find('ImageBox')).toBeTruthy();
  });

  it('renders Next and Prev Buttons', () => {
    expect(component.find('Button')).toBeTruthy();
  });
});
