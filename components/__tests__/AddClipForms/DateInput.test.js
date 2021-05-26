import * as React from 'react';
import { shallow } from 'enzyme';
import DateInput from '@components/AddClipForms/DateInput';

describe('DateInput Component', () => {
  let component;
  const props = {
    onBack: jest.fn(),
    onNext: jest.fn(),
    videoURL: 'url',

  };

  beforeEach(() => {
    component = shallow(<DateInput {...props} />);
  });

  it('renders Form', () => {
    expect(component.find('Form')).toHaveLength(1);
  });

  it('renders 3 FormGroup', () => {
    expect(component.find('FormGroup')).toHaveLength(3);
  });

  it('renders Next and Prev Buttons', () => {
    expect(component.find('Button')).toHaveLength(2);
  });
});
