import * as React from 'react';
import { shallow } from 'enzyme';
import Artist from '@components/AddClipForms/Artist';

describe('Artist Component', () => {
  let component;
  const props = {
    onNext: jest.fn(),
    onBack: jest.fn(),
    setClipField: jest.fn(),

  };

  beforeEach(() => {
    component = shallow(<Artist {...props} />);
  });

  it('renders Form', () => {
    expect(component.find('Form')).toHaveLength(1);
  });

  it('renders FormGroup', () => {
    expect(component.find('FormGroup')).toHaveLength(1);
  });

  it('renders Next and Back Button', () => {
    expect(component.find('Button')).toHaveLength(2);
  });
});
