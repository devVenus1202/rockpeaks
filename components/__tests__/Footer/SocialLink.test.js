import * as React from 'react';
import { shallow } from 'enzyme';

import SocialLinks from '../../Footer/SocialLinks';

describe('SocialLinks Component', () => {
  it('renders 3 links', () => {
    const socialLinks = shallow(<SocialLinks />);
    expect(socialLinks.find('li')).toHaveLength(2);
  });

  it('renders Facebook', () => {
    const socialLinks = shallow(<SocialLinks />);

    expect(socialLinks
            .find('a')
            .at(0)
            .children()
            .find('Icon'))
            .toBeTruthy();
  });

  it('renders Twitter', () => {
    const socialLinks = shallow(<SocialLinks />);

    expect(socialLinks
            .find('a')
            .at(1)
            .children()
            .find('Icon'))
            .toBeTruthy();
  });
});
