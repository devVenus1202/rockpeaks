import React, { Component } from 'react';
import Link from 'next/link';
import { withRouter } from 'next/router';

import { NavItem } from 'reactstrap';

class FooterMenu extends Component {
  render() {
    return (
      <div className="row">
        <div className="col-lg-2 order-lg-2">
          <Link href="/" passHref>
            <a className="footer-logo">
              <div className="logo-image" />
            </a>
          </Link>
        </div>
        <div className="col-lg-5 col-md-6 order-lg-1">
          <ul className="list-inline">
            <NavItem className="list-inline-item">
              <Link href="/contact" passHref>
                <a>Contact</a>
              </Link>
            </NavItem>
            <NavItem className="list-inline-item">
              <Link href="/about" passHref>
                <a>About</a>
              </Link>
            </NavItem>
            <NavItem className="list-inline-item">
              <Link href="/termsofuse" as="/terms-of-use" passHref>
                <a>Terms of Use</a>
              </Link>
            </NavItem>
          </ul>
        </div>
        <div className="col-lg-5 col-md-6 order-lg-3">
          <ul className="list-inline">
            <NavItem className="list-inline-item">
              <Link href="/api" passHref>
                <a>API</a>
              </Link>
            </NavItem>
            <NavItem className="list-inline-item">
              <Link href="/legal" passHref>
                <a>Legal</a>
              </Link>
            </NavItem>
            <NavItem className="list-inline-item">
              <Link href="/privacypolicy" as="/privacy-policy" passHref>
                <a>Privacy Policy</a>
              </Link>
            </NavItem>
          </ul>
        </div>
      </div>
    );
  }
}

export default withRouter(FooterMenu);
