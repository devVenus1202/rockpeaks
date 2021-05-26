import * as React from 'react';
import { shallow } from 'enzyme';

import MediaBox from '../Medias/MediaBox';

describe('MediaBox Component', () => {
  let component;
  const props = {
    dateTime: 'time',
    artist: 'artist',
    show: 'show',
    title: 'title',
  };

  beforeEach(() => {
    component = shallow(<MediaBox {...props} />);
  });

  it('renders Media', () => {
    expect(component.find('Media')).toHaveLength(2);
  });

  it('renders img', () => {
    expect(component.find('img')).toHaveLength(1);
  });

  it('renders heading', () => {
    expect(component.find('h5')).toHaveLength(1);
  });

  it('renders properties', () => {
    expect(component.find('p')).toHaveLength(3);
  });
});
