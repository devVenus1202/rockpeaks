import React from 'react';
import App from '@components/App';
import Tour from '@components/Dialogs/Tour';
import ApolloConsumer, { AppConsumer } from '@components/AppContext';
import './Match.style.scss';

class Match extends React.Component {
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
      <AppConsumer>
        {({ theme }) => (
          <App pageClass="match-page" page="match" headerType>
            <section className="section  poster-section poster-bg-1 m-0">
              <div className="gradient-vertical-black-transparent section section-hero">
                <div className="container" />
              </div>
            </section>
            <section className="clearfix container-info-bloks">
              <div className="secondary-info clearfix">
                <div className="container">
                  <div className="secondary-info-text">
                    <div className="sub-section text-left">
                      <h4>PLUG IN</h4>
                      <p className="mb-2rem">
                        <small>
                          Below is a zip file containing the two plug-ins you’ll need to connect your media centre
                          software to RockPeaks. Right now only Plex is supported, but plug-ins for Kodi are coming
                          soon.
                        </small>
                      </p>
                      <a
                        className="btn btn-warning"
                        href="https://s3.amazonaws.com/downloads.rockpeaks/RockPeaks_Plex_Plugins/releases/latest/RockPeaks_Plex_Plugins.zip"
                      >
                        download
                      </a>
                    </div>
                    <p>
                      <small>
                        Included in the Zip file is a PDF that describes how your files should be named for optimal
                        matching.
                        <br />
                        If you have further questions, head on over to this section of the discussion forum.
                      </small>
                    </p>
                  </div>
                </div>
              </div>
              <div className="main-info clearfix gradient-vertical-black-blue">
                <div className="container">
                  <div className="sub-section">
                    <h2 className="section-title text-left text-capitalize">Match</h2>
                  </div>
                  <p className="lead">
                    RockPeaks allows you to match your personal collection of music videos to our database of clip
                    information. Why would you want to do this?
                  </p>
                  <p className="lead">Two reasons, basically:</p>
                  <ul>
                    <li className="lead">
                      If you use media center software to view your videos, you can automatically download metadata
                      (text and images) that will help keep your local collection organized and up-to-date.
                    </li>
                    <li className="lead">
                      If you use Plex as your media center, you can link your Plex account to RockPeaks and play back
                      videos from your local library right here on our site. (This is helpful when a clip is missing
                      from YouTube).
                    </li>
                  </ul>
                  <p className="lead">
                    To the left is a download link to a zip file containing the two plug-ins you’ll need to connect your
                    media center software to RockPeaks. Right now only Plex is supported, but plug-ins for Kodi are
                    coming soon.
                  </p>
                  <p className="lead">
                    You’ll first need to sign up for a RockPeaks account, and then grab the plug-in at left and follow
                    the instructions. Once installed, you’ll need to log in to the site from your media centre in order
                    to fetch metadata.
                  </p>
                  <p className="lead">
                    In order to playback videos from your library on the site, go to the Personal Media tab in your
                    Account area and follow the instructions there.
                  </p>
                  <p className="lead mb-5">
                    We’ve also prepared a guided tour that walks you through the process in more detail.
                  </p>
                  <div className="text-center">
                    <a
                      className="btn btn-danger"
                      tabIndex="0"
                      onClick={this.handleToggleModal('tour')}
                      role="button"
                      onFocus={() => { }}
                    >
                      Take tour
                    </a>
                    <Tour
                      isOpen={name === 'tour' && status === true}
                      onToggle={this.handleToggleModal('tour')}
                      theme={theme}
                      activeTab={1}
                    />
                  </div>
                </div>
              </div>
            </section>
          </App>
        )}
      </AppConsumer>
    );
  }
}

export default Match;
