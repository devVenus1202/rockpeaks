import * as React from 'react';
import { shallow } from 'enzyme';
import EmbedCode from '@components/AddClipForms/EmbedCode';

describe('EmbedCode Component', () => {
  let component;
  const props = {
    onChangeURL: jest.fn(),
    onNext: jest.fn(),
    videoURL: 'url',

  };

  beforeEach(() => {
    component = shallow(<EmbedCode {...props} />);
  });

  it('renders Form', () => {
    expect(component.find('Form')).toHaveLength(1);
  });

  it('renders Input', () => {
    expect(component.find('Input')).toHaveLength(1);
  });

  it('renders Button', () => {
    expect(component.find('Button')).toHaveLength(1);
  });
});
