import React, { Component } from 'react';
import { withRouter } from 'next/router';
import FooterMenu from './FooterMenu';
import SocialLinks from './SocialLinks';
import Copyright from './Copyright';
import './Footer.style.scss';

// const Header = ({ router: { pathname } }) => (
class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <div className="footer-top">
          <div className="container">
            <FooterMenu />
            <SocialLinks />
          </div>
        </div>
        <Copyright />
      </footer>
    );
  }
}


export default withRouter(Footer);
