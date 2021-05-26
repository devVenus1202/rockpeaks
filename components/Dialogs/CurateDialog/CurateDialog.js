import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Button,
  Label,
  Input,
} from 'reactstrap';
import ModalThumbnail from '@static/images/icons/svg/Curate-This-Artist.svg';
import './CurateDialog.style.scss';

const GET_ENTITY_BY_ID = gql`
  query getEntityById($nid: String!) {
    node:nodeById(id: $nid) {
      ... on Node {
        nid
        uid {
          entity {
            entityId
            entityLabel
          }
        }
        entityBundle
        title
        entityUrl {
          path
        }
        ...on NodeArtist {
          curator {
            entity {
              ...on User {
                uid
                name
              }
            }
          }
        }
        ...on NodeShow {
          curator {
            entity {
              ...on User {
                uid
                name
              }
            }
          }
        }
      }
    }
  }
`;

const SEND_REQUEST = gql`
  mutation createCurationRequest($nid: Int!, $message: String!) {
    request:createCurationRequest(
      entity: $nid,
      body: $message
    ) {
      entity {
        ... on NodeCurationRequest {
          nid
          uid {
            entity {
              entityId
              entityLabel
            }
          }
          title
          entity {
            entity {
              entityId
              entityLabel
              entityBundle
            }
          }
          body {
            value
          }
        }
      }
      violations {
        message
      }
      errors
    }
  }
`;

const GET_REQUEST = gql`
  query getRequest(
    $uid: String
    $nid: String
  ) {
    request:nodeQuery(
      filter: {
        conditions: [
          {
            field: "type"
            value: "curation_request"
            operator: EQUAL
          },
          {
            field: "uid"
            value: [$uid]
            operator: EQUAL
          },
          {
            field: "entity"
            value: [$nid]
            operator: EQUAL
          }
        ]
      }
    ) {
      entities {
        ...on NodeCurationRequest {
          uid {
            entity {
              entityId
              entityLabel
            }
          }
          nid
          entity {
            entity {
              entityId
              entityType
              entityBundle
              entityLabel
            }
          }
        }
      }
    }
  }
`;

class CurateDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      message: '',
      error: false,
      submitRequest: false,
      requestSent: false,
      isPageCurator: false,
    };
    this.form = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    const { uid, nid } = this.props;
    const { client } = this.props;
    try {
      var entity = await client.query({
        query: GET_ENTITY_BY_ID,
        variables: { nid: nid }
      })

      if (entity.data.node === null) {
        throw "Error: node not found"
      }

      let isPageCurator = false
      if (entity.data.node.curator !== null) {
        isPageCurator = entity.data.node.curator.entity.uid == uid
        this.setState({isPageCurator: isPageCurator})
      }

      let requestSent = false
      if (!isPageCurator) {
        // Check if request already sent.
        var request = await client.query({
          query: GET_REQUEST,
          variables: {nid: nid, uid: uid}
        })

        if (request.data.request === null) {
          throw "Error: request not found"
        }

        if (request.data.request.entities.length === 0) {
          throw "Error: request not found"
        }

        requestSent = request.data.request.entities[0].uid.entity.entityId == uid
        this.setState({requestSent: requestSent})
      }

      this.setState({entityTitle: entity.data.node.title})
    }
    catch (e) {
      console.log(e)
    }
  }

  handleChange(event) {
    this.setState({message: event.target.value});
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const { uid, nid } = this.props;
    const { message } = this.state;
    const { client } = this.props;
    try {
      var response = await client.mutate({
        mutation: SEND_REQUEST,
        variables: { nid: nid, message: message }
      })

      if (typeof response.data === 'undefined') {
        throw "Error: service unavaiable"
      }

      if (response.data.request === null) {
        throw "Error: service unavaiable"
      }

      if (typeof response.data.request.violations !== 'undefined' && response.data.request.violations instanceof Array) {
        if (response.data.request.violations.length > 0) {
          throw response.data.request.violations[0]
        }
      }

      if (typeof response.data.request.errors !== 'undefined' && response.data.request.errors instanceof Array) {
        if (response.data.request.errors.length > 0) {
          throw response.data.request.errors[0]
        }
      }

      if (response.data.request.entity === null) {
        throw "Error: could not send the request"
      }

      const request = response.data.request.entity
      alert("Request was sent")
    }
    catch (e) {
      console.log(e)
      alert(e)
    }
  }

  render() {
    const { isOpen, onToggle, theme = 'dark' } = this.props;
    const { uid, nid } = this.props;
    const { isPageCurator, requestSent } = this.state;
    const { entityTitle } = this.state;

    if (isPageCurator) {
      return (
        <Modal className={`curate-modal theme-${theme}`}
          isOpen={isOpen}
          toggle={onToggle}
          theme={theme}>
          <ModalHeader toggle={onToggle}>
            <img className="modal-title-icon" src={ModalThumbnail} alt="" />
            Curate {entityTitle}
          </ModalHeader>
          <ModalBody className="p-0">
            <div className="tab-content dropdown-tab-content p-0">
              <div className="narrow-container text-muted p-2rem all-width">
                <h6 className="text-white mb-4 text-uppercase">HEY!</h6>
                <p className="h6 mb-4">You already curate this page.</p>
              </div>
            </div>
          </ModalBody>
        </Modal>
      )
    }
    else if (requestSent) {
      return (
          <Modal className={`curate-modal theme-${theme}`}
        isOpen={isOpen}
        toggle={onToggle}
        theme={theme}>
          <ModalHeader toggle={onToggle}>
          <img className="modal-title-icon" src={ModalThumbnail} alt="" />
          Curate {entityTitle}
      </ModalHeader>
        <ModalBody className="p-0">
          <div className="tab-content dropdown-tab-content p-0">
          <div className="narrow-container text-muted p-2rem all-width">
          <h6 className="text-white mb-4 text-uppercase">HEY!</h6>
        <p className="h6 mb-4">You already sent the request to curate this page.</p>
        </div>
        </div>
        </ModalBody>
        </Modal>
      )
    }
    else {
      return (
        <Modal className={`curate-modal theme-${theme}`}
          isOpen={isOpen}
          toggle={onToggle}
          theme={theme}>
          <ModalHeader toggle={onToggle}>
            <img className="modal-title-icon" src={ModalThumbnail} alt="" />
            Curate {entityTitle}
          </ModalHeader>
          <ModalBody className="p-0">
            <div className="tab-content dropdown-tab-content p-0">
              <div className="narrow-container text-muted p-2rem all-width">
                <h6 className="text-white mb-4 text-uppercase">HEY!</h6>
                <p className="h6 mb-4">Really glad you're interested in helping out.</p>
                <p className="h6 mb-0">
                  Curating a page on RockPeaks is the coolest way to express your musical knowledge,
                  earn points and win prizes.
                </p>
              </div>
              <hr className="m-0" />
              <div className="narrow-container text-muted p-2rem all-width">
                <h6 className="text-white mb-4">Here's what you’ll be doing, should you accept this mission:</h6>
                <p className="h6 mb-4">
                  Review the clips that have already been added to the artist’s page. It’s quite
                likely several are “missing” — and finding other copies on the web is a fast way to
                get the artist’s stream ratio into better shape and earn quick points. More on
                matching missing clips here.
                </p>
                <p className="h6 mb-4">
                  Of course, there are also going to be performances, interviews and other documentary
                clips that are not on the site that you know about — they should be added using the
                Add Clip tool.
                </p>
                <p className="h6 mb-4">
                  It’s also quite possible that there are inconsistencies and misspellings among this
                artist’s titles. Eliminating duplicates, correcting show dates, and standardizing
                songs and show names will make the artist’s tree list much easier to read and cooler
                for visiting fans.
                </p>
                <p className="h6 mb-4">
                  As you’ll discover, there are many other pieces of information that can be
                associated with a particular clip — from genre designations to wikipedia links; from
                performance dates, to copyright holders. Enter as much info as you can — and leave
                what you don’t know for others.
                                        </p>
                <p className="h6 mb-4">
                  Clips are often collected on Discs, which come in two flavors: commercial and
                trade-friendly. Amazon is your friend in the first case, and Usenet and the live
                trading torrent trackers are useful for the unofficial releases. Making sure that
                there are complete entries for as many Discs as possible is an important role of the
                curator.
                </p>
                <p className="h6 mb-4">
                  You should write an Overview of the artist’s appearances on TV, Film and Video.
                  Don’t worry, this’ll be a breeze after you’ve watched the artist’s performances and
                you’re up on their history. Have a look at a couple of completed pages, like this
                one or this one, to get a feel for what it can look like.
                </p>
                <p className="h6 mb-4">That’s pretty much it. It goes wherever you take it.</p>
                <p className="h6 mb-3">
                  If you’re into it, drop us a line using the form below, telling us the name of the
                artist you’d like to curate, your familiarity level with them, as well as links to
                anything of yours on the web that we might get a kick out of. We’ll get back to you,
                  usually within 24 hours.
                </p>
              </div>
              <div className="narrow-container text-muted p-2rem pt-0">
                <Form ref={this.form} onSubmit={this.handleSubmit} >
                  <FormGroup className="mb-4">
                    <Input
                      type="hidden"
                      name="uid"
                      id="uid"
                      required
                      defaultValue={uid} />
                    <Input
                      type="hidden"
                      name="nid"
                      id="nid"
                      required
                      defaultValue={nid} />
                  </FormGroup>
                  <FormGroup className="mb-0">
                    <Label for="app">Application text:</Label>
                    <Input
                      type="textarea"
                      name="message"
                      rows={3}
                      onChange={this.handleChange}
                      placeholder="text" />
                  </FormGroup>
                </Form>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button className="ml-auto" color="danger" type="submit" onClick={this.handleSubmit}>Submit</Button>
            <Button color="danger" type="button" outline onClick={onToggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      )
    }
  }
}

CurateDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default withApollo(CurateDialog);
