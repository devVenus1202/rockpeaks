import * as React from 'react';
import { shallow } from 'enzyme';

import Sign from '../../Sign';

describe('Sign Component', () => {
  let component;
  const mockToggle = jest.fn();
  const mockChangeType = jest.fn();
  const props = {
    isOpen: true,
    type: true,
    toggle: mockToggle,
    changeType: mockChangeType,
  };

  beforeAll(() => {
    component = shallow(<Sign {...props} />);
  });

  it('renders Modal', () => {
    expect(component.find('Modal')).toBeTruthy();
  });

  it('renders Brand', () => {
    expect(component.find('Brand')).toBeTruthy();
  });

  it('renders SocialButtons', () => {
    expect(component.find('SocialButtons')).toBeTruthy();
  });

  it('renders Form', () => {
    expect(component.find('Form')).toBeTruthy();
  });

  it('renders FormGroup', () => {
    expect(component.find('FormGroup')).toBeTruthy();
  });

  it('renders close button', () => {
    expect(component.find('button.close')).toHaveLength(1);
  });

  it('renders OR divider', () => {
    expect(component
      .find('div.login-delimiter')
      .children()
      .find('span')
      .children()
      .text()
    ).toEqual('or');
  });

  it('calls changeType props function', () => {
    component.find('a.switch-link').simulate('click');
    expect(mockChangeType).toBeCalled();
  });

  it('calls toggle props function', () => {
    component.find('button.close').simulate('click');
    expect(mockToggle).toBeCalled();
  });

  it('render certain link', () => {
    const signinProps = {
      isOpen: true,
      type: true,
      toggle: mockToggle,
      changeType: mockChangeType,
    };

    const signupProps = {
      isOpen: true,
      type: false,
      toggle: mockToggle,
      changeType: mockChangeType,
    };

    const signIn = shallow(<Sign {...signinProps} />);
    const signInLink = 'Don\'t have an account? Get started!';
    expect(signIn
      .find('a.switch-link')
      .children()
      .text()
    ).toEqual(signInLink);

    const signUp = shallow(<Sign {...signupProps} />);
    const signUpLink = 'Alredy registered? Log In!';
    expect(signUp
      .find('a.switch-link')
      .children()
      .text()
    ).toEqual(signUpLink);
  });
});
