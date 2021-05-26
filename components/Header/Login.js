import React, { Component } from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import Sign from '../Sign';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      opened: false,
      toggle: true,
      type: 0,
    };
  }

  toggle = toggle => () => {
    this.setState(prevState => ({
      [toggle]: !prevState[toggle],
    }));
  };

  changeType = type => {
    this.setState({ opened: false }, () => {
      setTimeout(() => {
        this.setState({ type, opened: true });
      }, 200);
    });
  };

  openLogin = () => {
    this.setState({ type: 0, opened: true });
  };

  render() {
    const { opened, type } = this.state;
    const { theme, isSso } = this.props;
    return (
      <React.Fragment>
        <Nav className="navbar-nav">
          <NavItem>
            <NavLink onClick={this.openLogin}>Login</NavLink>
          </NavItem>
        </Nav>
        <Sign
          isOpen={opened}
          toggle={this.toggle}
          changeType={this.changeType}
          type={type}
          theme={theme}
          isSso={isSso}
        />
      </React.Fragment>
    );
  }
}

export default Login;
