import React, { Component } from 'react';
import { Query, withApollo } from 'react-apollo';
import { get as _get } from 'lodash';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Row, Col, Input, Spinner } from 'reactstrap';
import Login from '@components/Header/Login';
import AlertBox from '@components/Utilities/AlertBox';

import GET_SHOW_WIKI from '@graphql/show/ShowWiki.graphql';
import GET_ARTIST_WIKI from '@graphql/artist/ArtistWiki.graphql';

import UPDATE_ARTIST from '@graphql/artist/UpdateArtist.graphql';
import UPDATA_SHOW from '@graphql/show/UpdateShow.graphql';

import ModalThumbnail from '@static/images/icons/svg/Wikipedia-Button.svg';

import WikiLoader from './WikiLoader';
import './WikiDialog.style.scss';

const queries = {
  clip: GET_ARTIST_WIKI,
  show: GET_SHOW_WIKI,
  artist: GET_ARTIST_WIKI,
};

const mutations = {
  clip: UPDATE_ARTIST,
  show: UPDATA_SHOW,
  artist: UPDATE_ARTIST,
};

class WikiDialog extends Component {
  state = {
    wikiUrl: '',
    submitAvailable: false,
    isUpdating: false,
  };

  constructor(props) {
    super(props);
    this.login = React.createRef();
  }

  renderLoader = () => {
    const { isOpen, onToggle, theme = 'dark', nid, type, title } = this.props;
    return (
      <>
        <ModalHeader toggle={this.onToggle}>
          <img className="modal-title-icon" src={ModalThumbnail} alt="" />
          Wikipedia
        </ModalHeader>
        <ModalBody className="p-0">
          <WikiLoader />
        </ModalBody>
      </>
    );
  };

  changeUrl = e => {
    this.setState({ wikiUrl: e.target.value, submitAvailable: e.target.value.trim() ? true : false });
  };

  onToggle = () => {
    const { onToggle } = this.props;
    onToggle();
  };

  renderWikiPage = url => {
    const { theme = 'dark', nid, type, title, user } = this.props;
    const { isUpdating } = this.state;
    return (
      <>
        <ModalHeader toggle={this.onToggle}>
          <img className="modal-title-icon" src={ModalThumbnail} alt="" />
          Wikipedia
        </ModalHeader>
        <ModalBody className="p-0">
          <div className="narrow-container p-2rem all-width pb-0">
            <h2 className="text-muted">{title}</h2>
          </div>
          <div className="narrow-container p-2rem all-width ">
            <div className="pb-4">We have a Wikipedia page in our system for {title}</div>
            <div className="">
              <a href={url} target="_blank" className="text-muted">
                {url}
              </a>
            </div>
          </div>
          <div className="narrow-container p-2rem all-width ">
            <div className="pb-4">If you change, past new URL in the field below.</div>
            <div className="col-md-8 pr-5 pl-0">
              <Input type="text" id="media-url" required onChange={this.changeUrl} />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button className="ml-auto" color="danger" type="button" outline onClick={this.onToggle}>
            Cancel
          </Button>
          <Button color="danger" type="submit" onClick={this.handleSubmit} disabled={!this.state.submitAvailable}>
            {!isUpdating && 'Submit'}
            {isUpdating && <Spinner size="sm" className="spinner-login" />}
          </Button>
        </ModalFooter>
      </>
    );
  };

  renderContentWithNoData = () => {
    const { isOpen, onToggle, theme = 'dark', nid, type, title, user } = this.props;
    const { isUpdating } = this.state;
    return (
      <>
        <ModalHeader toggle={this.onToggle}>
          <img className="modal-title-icon" src={ModalThumbnail} alt="" />
          Wikipedia
        </ModalHeader>
        <ModalBody className="p-0">
          <div className="narrow-container p-2rem all-width pb-0">
            <h2 className="text-muted">{title}</h2>
          </div>
          {/* <h3 className="ml-4">No Result</h3> */}
          <div className="narrow-container p-2rem all-width pb-0">
            <div className="pb-4">We don't have a Wikipedia page in our system for {title}.</div>
            <Button type="button" color="danger" onClick={this.search}>
              search
            </Button>
          </div>
          {!user.user_id && (
            <div className="narrow-container p-2rem all-width ">
              <div className="pb-4">Please log-in if you've located this page on Wikipedia and want to add it.</div>
              <Button type="button" color="danger" onClick={this.toLogin}>
                log in
              </Button>
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
          )}

          {user.user_id && (
            <div className="narrow-container p-2rem all-width ">
              <div className="pb-4">If you locate one, past URL in the field below.</div>
              <div className="col-md-8 pr-5 pl-0">
                <Input type="text" id="media-url" required onChange={this.changeUrl} />
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button className="ml-auto" color="danger" type="button" outline onClick={this.onToggle}>
            Cancel
          </Button>
          <Button color="danger" type="submit" onClick={this.handleSubmit} disabled={!this.state.submitAvailable}>
            {!isUpdating && 'Submit'}
            {isUpdating && <Spinner size="sm" className="spinner-login" />}
          </Button>
        </ModalFooter>
      </>
    );
  };

  search = () => {
    const { title } = this.props;
    window.open(
      `https://en.wikipedia.org/w/index.php?sort=relevance&search=${title}&title=Special%3ASearch&profile=advanced&fulltext=1&advancedSearch-current=%7B%7D&ns0=1`,
      '_blank', // <- This is what makes it open in a new window.
    );
  };

  toLogin = () => {
    this.login.openLogin();
  };

  closeAlert = () => {
    const { showSuccess } = this.props;
    this.setState({ showSuccess: false, showFailed: false }, () => {
      if (showSuccess) window.location.reload();
    });
  };

  handleSubmit = () => {
    const { onToggle, nid, type } = this.props;
    const { wikiUrl } = this.state;
    if (wikiUrl) {
      this.setState({ isUpdating: true });
      this.props.client
        .mutate({
          mutation: mutations[type],
          variables: {
            nid,
            wikiUrl,
          },
        })
        .then(({ data }) => {
          onToggle();
          if (data) {
            const errors = type === 'show' ? data.updateShow.errors : data.updateArtist.errors;
            const violations = type === 'show' ? data.updateShow.violations : data.updateArtist.violations;
            if (errors.length === 0 && violations.length === 0) {
              this.setState({ showSuccess: true, isUpdating: false });
            } else {
              this.setState({ showFailed: true, isUpdating: false });
            }
          } else {
            this.setState({ showFailed: true, isUpdating: false });
          }
        });
    }
  };

  render() {
    const { isOpen, onToggle, theme = 'dark', nid, type, title } = this.props;
    const { showSuccess, showFailed, isUpdating } = this.state;
    return (
      <>
        <Modal className={`curate-modal theme-${theme}`} isOpen={isOpen} toggle={this.onToggle}>
          <Query query={queries[type]} variables={{ nid }}>
            {({ loading, error, data }) => {
              if (loading || error) return this.renderLoader();

              const wikiPage =
                type !== 'show' ? _get(data, 'nodeById.artistWikipediaPage') : _get(data, 'nodeById.showWikipediaPage');
              const wikiData =
                type !== 'show'
                  ? _get(data, 'nodeById.artistWikipediaBody.processed')
                  : _get(data, 'nodeById.wikipediaExcerpt.processed');
              const summaryData =
                type !== 'show'
                  ? _get(data, 'nodeById.artistWikipediaBody.bodySummary')
                  : _get(data, 'nodeById.wikipediaExcerpt.bodySummary');

              if (!wikiData) {
                if (!wikiPage) return this.renderContentWithNoData();
                return this.renderWikiPage(wikiPage);
              }
              return (
                <>
                  <ModalHeader toggle={this.onToggle}>
                    <img className="modal-title-icon" src={ModalThumbnail} alt="" />
                    Wikipedia (Retrieved from Wikipedia: 1 year 12 weeks ago)
                  </ModalHeader>
                  <ModalBody className="p-0">
                    <React.Fragment>
                      <div className="narrow-container p-2rem all-width pb-0">
                        <h2 className="text-muted">{title}</h2>
                      </div>

                      <Row>
                        <Col lg={8}>
                          <div
                            className="narrow-container text-muted p-2rem all-width wiki-content"
                            dangerouslySetInnerHTML={{ __html: wikiData || '' }}
                          />
                        </Col>
                        <Col lg={4}>
                          <div className="narrow-container text-muted p-2rem all-width">
                            <p className="h6 mb-4">
                              <a
                                className="text-warning "
                                href={`https://en.wikipedia.org/wiki/${wikiPage}`}
                                target="_blank"
                              >
                                Read the original article on Wikipedia
                              </a>
                            </p>
                            <div dangerouslySetInnerHTML={{ __html: summaryData || '' }} />
                          </div>
                        </Col>
                      </Row>
                    </React.Fragment>
                  </ModalBody>
                  <ModalFooter />
                </>
              );
            }}
          </Query>
        </Modal>
        <Modal className={`alert-modal theme-${theme}`} isOpen={showSuccess || showFailed}>
          {showSuccess && <AlertBox type="success" text="Update Successful" onClose={this.closeAlert} />}
          {showFailed && <AlertBox type="warning" text="Update Failed" onClose={this.closeAlert} />}
        </Modal>
      </>
    );
  }
}

WikiDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  nid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  theme: PropTypes.string.isRequired,
};

export default withApollo(WikiDialog);
