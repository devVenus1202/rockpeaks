import * as React from 'react';
import { shallow } from 'enzyme';
import Tags from '@components/AddClipForms/Tags';

describe('Tags Component', () => {
  let component;
  const props = {
    onNext: jest.fn(),
    onBack: jest.fn(),
    setClipField: jest.fn(),
  };

  beforeEach(() => {
    component = shallow(<Tags {...props} />);
  });

  it('renders Form', () => {
    expect(component.find('Form')).toHaveLength(1);
  });

  it('renders AddBadge', () => {
    expect(component.find('AddBadge')).toHaveLength(1);
  });

  it('renders 3 texts', () => {
    expect(component.find('p.text-muted')).toHaveLength(3);
  });

  it('renders Next and Prev Buttons', () => {
    expect(component.find('Button')).toHaveLength(2);
  });
});
