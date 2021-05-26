import * as React from 'react';
import { shallow } from 'enzyme';
import SingleSongName from '@components/AddClipForms/SingleSongName';

describe('SingleSongName Component', () => {
  let component;
  const props = {
    onNext: jest.fn(),
    onBack: jest.fn(),
    setClipField: jest.fn(),
  };

  beforeEach(() => {
    component = shallow(<SingleSongName {...props} />);
  });

  it('renders Form', () => {
    expect(component.find('Form')).toHaveLength(1);
  });

  it('renders FormGroup', () => {
    expect(component.find('FormGroup')).toHaveLength(1);
  });

  it('renders Next and Prev Buttons', () => {
    expect(component.find('Button')).toHaveLength(2);
  });
});
