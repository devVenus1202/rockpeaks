import React from 'react';
import PropTypes from 'prop-types';
import App from '@components/App';

import { Router } from '@root/routes.esm';

class Drupal extends React.Component {
  componentDidMount() {
    const { url : { path } } = this.props;
    if (path.startsWith('/shows/')) {
      Router.replaceRoute('/show', { path });
    } else if (path.startsWith('/artists/')) {
      Router.replaceRoute('/artist', { path });
    } else {
      if (window) {
        window.sessionStorage.setItem('errorMessage', 'Wrong Drupal route');
      }
      Router.pushRoute({ pathname: '/error' });
    }
  }

  render() {
    return (
      <App>
        <article>
          <div>Loading...</div>
        </article>
      </App>

    );
  }
}


Drupal.propTypes = {
  url: PropTypes.element.isRequired,
};

export default Drupal;
