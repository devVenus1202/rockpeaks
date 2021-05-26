import * as React from 'react';
import { shallow } from 'enzyme';
import SingleSongSequence from '@components/AddClipForms/SingleSongSequence';

describe('SingleSongSequence Component', () => {
  let component;
  const props = {
    onNext: jest.fn(),
    onBack: jest.fn(),
    setClipField: jest.fn(),
    videoInfo: {},
  };

  beforeEach(() => {
    component = shallow(<SingleSongSequence {...props} />);
  });

  it('renders Form', () => {
    expect(component.find('Form')).toHaveLength(1);
  });

  it('renders 2 FormGroups', () => {
    expect(component.find('FormGroup')).toHaveLength(2);
  });

  it('renders 2 Rows', () => {
    expect(component.find('Row')).toHaveLength(2);
  });

  it('renders 3 texts', () => {
    expect(component.find('p.text-muted')).toHaveLength(3);
  });

  it('renders Next and Prev Buttons', () => {
    expect(component.find('Button')).toHaveLength(2);
  });
});
