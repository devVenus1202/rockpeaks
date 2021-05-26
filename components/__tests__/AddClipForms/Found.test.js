import * as React from 'react';
import { shallow } from 'enzyme';
import Found from '@components/AddClipForms/Found';

describe.skip('Found Component', () => {
  let component;
  const props = {
    onNext: jest.fn(),
    onBack: jest.fn(),
    onResult: jest.fn(),
    onChangeURL: jest.fn(),
    videoURL: 'url',

  };

  beforeEach(() => {
    component = shallow(<Found {...props} />);
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
