import * as React from 'react';
import { shallow, describe } from 'enzyme';
import Review from '@components/AddClipForms/Review';

describe('Review Component', () => {
  let component;
  const props = {
    onNext: jest.fn(),
    onBack: jest.fn(),
    clipData: {},
    videoInfo: {},

  };

  beforeEach(() => {
    component = shallow(<Review {...props} />);
  });

  it('renders Form', () => {
    expect(component.find('Form')).toHaveLength(1);
  });

  it('renders ImageBox', () => {
    expect(component.find('ImageBox')).toHaveLength(1);
  });

  it('renders Next and Prev Buttons', () => {
    expect(component.find('Button')).toHaveLength(2);
  });
});
