import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from '@root/routes.esm';
import { Button } from 'reactstrap';
import Login from '@components/Header/Login';
import { withContext } from '@components/HOC/withContext';

class Contribute extends Component {
  static propTypes = {
    theme: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.login = React.createRef();
  }

  handleAddClip = () => {
    this.login.openLogin();
  };

  render() {
    const { theme, user } = this.props;
    return (
      <div className="text-center mb-5">
        {user.user_id ? (
          <>
            <Link route="/addclip">
              <Button className="mx-4 mb-4" type="button" color="warning">
                add clip
              </Button>
            </Link>
            <Link route="/adddisc">
              <Button className="mx-4 mb-4" type="button" color="warning">
                add disc
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Button className="mx-4 mb-4" type="button" color="warning" onClick={this.handleAddClip}>
              add clip
            </Button>
            <Button className="mx-4 mb-4" type="button" color="warning" onClick={this.handleAddClip}>
              add disc
            </Button>
          </>
        )}
        <div style={{ display: 'none' }}>
          <Login
            theme={theme}
            ref={component => {
              if (component) {
                this.login = component;
              }
            }}
          />
        </div>
      </div>
    );
  }
}

export default withContext(Contribute);
