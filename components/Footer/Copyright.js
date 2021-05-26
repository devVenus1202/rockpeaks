import React, { Component } from 'react';

const getYear = () => new Date().getFullYear();

class Copyright extends Component {
  render() {
    return (
      <div className="footer-bottom">
        <div className="container">
          <p className="copyright">&copy; RockPeaks, {getYear()}. All Rights Reserved.</p>
        </div>
      </div>
    );
  }
}

export default Copyright;
