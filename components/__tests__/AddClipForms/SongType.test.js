import * as React from 'react';
import { shallow } from 'enzyme';
import SongType from '@components/AddClipForms/SongType';

describe('SongType Component', () => {
  let component;
  const props = {
    onNext: jest.fn(),
    onBack: jest.fn(),
    setClipField: jest.fn(),
    videoInfo: {},
  };

  beforeEach(() => {
    component = shallow(<SongType {...props} />);
  });

  it('renders Form', () => {
    expect(component.find('Form')).toHaveLength(1);
  });

  it('renders 2 FormGroups', () => {
    expect(component.find('FormGroup')).toHaveLength(2);
  });

  it('renders 2 CustomInputs', () => {
    expect(component.find('CustomInput')).toHaveLength(2);
  });

  it('renders Row', () => {
    expect(component.find('Row')).toHaveLength(1);
  });

  it('renders ImageBox', () => {
    expect(component.find('ImageBox')).toHaveLength(1);
  });

  it('renders 2 texts', () => {
    expect(component.find('p.text-muted')).toHaveLength(2);
  });

  it('renders Next and Prev Buttons', () => {
    expect(component.find('Button')).toHaveLength(2);
  });
});
