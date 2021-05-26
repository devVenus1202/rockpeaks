import * as React from 'react';
import { shallow } from 'enzyme';
import Show from '@components/AddClipForms/Show';

describe('Show Component', () => {
  let component;
  const props = {
    onNext: jest.fn(),
    onBack: jest.fn(),
    setClipField: jest.fn(),
  };

  beforeEach(() => {
    component = shallow(<Show {...props} />);
  });

  it('renders Form', () => {
    expect(component.find('Form')).toHaveLength(1);
  });

  it('renders 4 Rows', () => {
    expect(component.find('Row')).toHaveLength(4);
  });

  it('renders 5 texts', () => {
    expect(component.find('p.text-muted')).toHaveLength(5);
  });

  it('renders Next and Prev Buttons', () => {
    expect(component.find('Button')).toHaveLength(2);
  });
});
