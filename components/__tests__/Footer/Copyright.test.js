import * as React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import Copyright from '../../Footer/Copyright';

describe('Copyright Component', () => {
  let snapshot;

  it('renders copyright', () => {
    const app = shallow(<Copyright />);
    expect(app.find('p').text()).toBeTruthy();
  });

  it('renders correctly', () => {
    snapshot = renderer.create(<Copyright />);
  });

  it('matches snapshot', () => {
    const tree = snapshot.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
