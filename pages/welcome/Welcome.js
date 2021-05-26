import React, { Component } from 'react';
import { Button } from 'reactstrap';
import App from '@components/App';
import Tour from '@components/Dialogs/Tour';

import './Welcome.style.scss';

export default class Welcome extends Component {
  static propTypes = {};

  state = {
    modalOpened: {
      name: 'tour',
      status: false,
    },
  };

  handleToggleModal = name => () => {
    const { modalOpened } = this.state;

    let nextStatus;
    if (modalOpened.name && modalOpened.status) {
      nextStatus = !modalOpened.status;
    } else {
      nextStatus = true;
    }
    this.setState({
      modalOpened: {
        name,
        status: nextStatus,
      },
    });
  };

  render() {
    const {
      modalOpened: { name, status },
    } = this.state;
    return (
      <App pageClass="profile-page" page="profile">
        <div className="welcome">
          <div className="welcome-mask">
            <div>
              <h2 className="section-title text-shadow-1">WELCOME!</h2>
              <p className="lead text-shadow-1">
                We’re really glad you’ve decided to join our community. We’ve created a short tour
                to orient new users to the site. If you’re not into guides, feel free to jump right
                in and start exploring by clicking on any of the links on this page. You can check
                out the tour at any time from either the MATCH or the CONTRIBUTE links above. Happy
                travels!
              </p>

              <Button type="button" color="danger" onClick={this.handleToggleModal('tour')}>
                take tour
              </Button>
              <Tour
                isOpen={name === 'tour' && status === true}
                onToggle={this.handleToggleModal('tour')}
                activeTab={0}
              />
            </div>
          </div>
        </div>
      </App>
    );
  }
}
