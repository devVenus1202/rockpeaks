import * as React from 'react';
import { shallow } from 'enzyme';

import App from '../App';

describe('App Component', () => {
  it('renders a', () => {
    const app = shallow(<App><a>App</a></App>);
    expect(app.find('a')).toHaveLength(1);
  });
});
