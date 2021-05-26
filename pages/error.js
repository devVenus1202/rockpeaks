import React from 'react';
import App from '@components/App';
import PropTypes from 'prop-types';

import ErrorMessage from '@lib/ErrorMessage';
import { Link, withRouter } from 'next/router';

class ErrorPage extends React.Component {
  static propTypes = {
    errorCode: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
  };

  // static getInitialProps({ res, xhr }) {
  //   const errorCode = res ? res.statusCode : xhr ? xhr.status : null;
  //   return { errorCode };
  // }

  render() {
    console.log(this.props);
    let messageText = '';
    if (typeof window !== 'undefined') {
      const sessionText = window.sessionStorage.getItem('errorMessage');
      if (sessionText) {
        messageText = sessionText;
      }
    }
    const message = messageText;
    return (
      <App>
        {messageText.trim() !== '' ? (
          <article>
            <h1>Error</h1>
            <ErrorMessage message={message} />
          </article>
        ) : (
          <article className="text-center mt-5 mb-5" style={{ minHeight: '500px' }}>
            <h1>404 Error</h1>
            <p>Page not Found</p>
            <a href="/" className="text-muted">
              Go to first page
            </a>
          </article>
        )}
      </App>
    );
  }
}

export default withRouter(ErrorPage);
