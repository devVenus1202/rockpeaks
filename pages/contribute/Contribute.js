import React from 'react';
import App from '@components/App';
import { Link } from '@root/routes.esm';
import { Button } from 'reactstrap';
import Tour from '@components/Dialogs/Tour';
import ContributeLinks from '@components/ContributeLinks';
import './Contribute.style.scss';

class Contribute extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpened: {
        name: 'tour',
        status: false,
      },
    };
  }

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
      <App pageClass="contribute-page" page="contribute" headerType>
        <section className="poster-section poster-bg-2 m-0">
          <div className="gradient-vertical-black-transparent section section-hero">
            <div className="container" />
          </div>
        </section>

        <section className="clearfix container-info-bloks">
          <div className="secondary-info clearfix">
            <div className="container">
              <div className="secondary-info-text">
                <div className="sub-section text-left">
                  <h4 className="mb-5">BADGES</h4>
                  <div className="sub-section">
                    <h4 className="sub-section-title text-uppercase">CONTRUBUTOR</h4>
                    <p>Track artists, build playlists, add clips and discs.</p>
                  </div>
                  <div className="sub-section">
                    <h4 className="sub-section-title text-uppercase">REVIEWER</h4>
                    <p>Write clip reviews and submit featured playlists.</p>
                  </div>
                  <div className="sub-section">
                    <h4 className="sub-section-title text-uppercase">CURATOR</h4>
                    <p>Manage Artists and show pages.</p>
                  </div>
                  <div className="sub-section mb-5">
                    <h4 className="sub-section-title text-uppercase">EDITOR</h4>
                    <p>All of the above, plus other sites privileges</p>
                  </div>
                  <p>
                    <small>
                      Creating an account on Rockpeaks automatically makes you a Contributor. When you write your first
                      review you'll earn to the Reviewer badge; signing on to curate an artist or shows nets you the
                      Curator badge.Exceptional contributors graduate to become site Editors.
                    </small>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="main-info clearfix gradient-vertical-black-blue">
            <div className="container">
              <div className="sub-section">
                <h2 className="section-title text-left text-capitalize">Contribute</h2>
              </div>
              <p className="lead">
                When we started RockPeaks, our goal was a modest one: to organize and catalog the vast amount of live
                music video that began popping up on the web after the launch of YouTube in 2005.
              </p>
              <p className="lead">
                We’re about 255,000 clips in, but there are always more videos to add, review and share, and that’s
                where we could use your help.
              </p>
              <p className="lead">
                When you Sign Up for an account, you automatically become a&nbsp;
                <a className="text-warning" href="#0">
                  Contributor.
                  {' '}
                </a>
                This lets you track artists and shows, build playlists and add clips and discs to the system.
              </p>
              <p className="lead mb-5">If you’ve Signed Up and want to Add a Clip or Disc, you can do so below.</p>
              <ContributeLinks />
              <p className="lead">
                Plus, as a&nbsp;
                <a className="text-warning" href="#0">
                  Contributor
                </a>
                , you can also use our&nbsp;
                <a className="text-warning" href="#0">
                  Match plugin
                  {' '}
                </a>
                to connect our metadata to your collection. More about that over here.
              </p>
              <p className="lead">
                <a className="text-warning" href="#0">
                  Curators
                  {' '}
                </a>
                &nbsp;have all of the above privileges, but can also manage artist and show pages, and submit reviews
                for Clips and Discs.
              </p>
              <p className="lead">
                At the top of the heap is the&nbsp;
                <a className="text-warning" href="#0">
                  Editor
                  {' '}
                </a>
                role, reserved for super curators, and allows for full site privileges.
              </p>
              <p className="lead mb-5">
                If you want to dive right in, register for an account from the upper right and start exploring. Or take
                the guided tour below to learn more about contributing to RockPeaks.
              </p>
              <div className="text-center">
                <Button type="button" color="danger" onClick={this.handleToggleModal('tour')}>
                  take tour
                </Button>
              </div>
            </div>
          </div>
        </section>
        <Tour isOpen={name === 'tour' && status === true} onToggle={this.handleToggleModal('tour')} activeTab={2} />
      </App>
    );
  }
}

export default Contribute;
