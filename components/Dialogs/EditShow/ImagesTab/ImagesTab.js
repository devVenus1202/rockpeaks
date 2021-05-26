import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup,
  Input,
  Label,
  Row,
  Col,
  ModalFooter,
  Button,
} from 'reactstrap';
import InputRange from 'react-input-range';

import GET_ARTIST_DETAIL from '@graphql/artist/ArtistDetails.graphql';
import UPDATE_ARTIST_SCREEN from '@graphql/artist/UpdateScreenPercentage.graphql';

import GET_SHOW_DETAIL from '@graphql/show/ShowDetails.graphql';
import UPDATE_SHOW_SCREEN from '@graphql/show/UpdateScreenPercentage.graphql';

import { withContext } from '@components/HOC/withContext';
import { withApollo } from 'react-apollo';

const updateQueries = {
  artist: UPDATE_ARTIST_SCREEN,
  show: UPDATE_SHOW_SCREEN,
};
class ImagesTab extends Component {
  constructor(props) {
    super(props);
    const { data, screenPercentage: storedPercentage } = this.props;
    const { screenPercentage } = data;
    this.state = {
      opacity: screenPercentage || 0,
    };
  }

  handleUpdate = () => {
    const { opacity } = this.state;
    const { client, data, setScreenPercentage } = this.props;
    const {
      nid,
      type: { targetId },
    } = data;
    console.log(targetId);
    setScreenPercentage(opacity);
    client
      .mutate({
        mutation: UPDATE_ARTIST_SCREEN,
        variables: { nid, screenPercentage: Number(opacity) },
        refetchQueries: [
          {
            query: GET_ARTIST_DETAIL,
            variables: {
              nid,
            },
          },
        ],
      })
      .then(data => {});
  };

  handleScreenPercentage = value => {
    const { client, data, setScreenPercentage } = this.props;
    const {
      nid,
      type: { targetId },
    } = data;
    setScreenPercentage(value);
    client.mutate({
      mutation: updateQueries[targetId],
      variables: { nid, screenPercentage: Number(value) },
    });
  };

  render() {
    console.log(this.props);
    const { active, data, setScreenPercentage } = this.props;
    const { opacity } = this.state;
    const style = active ? 'tab-pane fade show active' : 'tab-pane fade';

    return (
      <div>
        <div className={style}>
          <div
            className="narrow-container text-muted p-2rem "
            style={{ textAlign: 'center', width: '50%' }}
          >
            <InputRange
              maxValue={100}
              minValue={0}
              value={opacity}
              onChange={value => {
                this.setState({ opacity: value });
                this.handleScreenPercentage(value);
              }}
            />
            {/* <p className="text-muted p-4 text-left">
              Please click Submit button in order to preserve this value.
            </p> */}
          </div>
          <hr className="m-0" />
          <div className="narrow-container text-muted p-2rem all-width">
            <p className="h6 mb-4">
              Two different images are required to complete an Show Profile:
            </p>
            <p className="h6 mb-4">
              (1) Show Inset Image - 16 x 9 image that represents the show, can
              be a logo, a grab from the opening titles, or a representative
              performances image.
            </p>
            <p className="h6">
              (2) Show Background Image - 16 x 9 wide shot image that captures
            </p>
          </div>
          <hr className="m-0" />

          <div className="narrow-container text-muted p-2rem all-width">
            <h5 className="text-white mb-4">Show Inset Image</h5>
            <p className="h6 mb-4">
              After uploading the image, please add a descriptive caption in the
              Title field below. The caption will appear right-aligned, below
              the image.
            </p>
            <p className="h6 mb-0">Current Image: OGWTjpg</p>
          </div>
          <div className="narrow-container text-muted p-2rem pt-0 smaller-width">
            <img
              className="mb-4 img-full-width"
              src="https://via.placeholder.com/525x394"
              alt=""
            />
          </div>
          <div className="narrow-container text-muted p-2rem">
            <FormGroup>
              <Label for="text">
                <strong>Alternate text: </strong>
                Used by screen readers, search engines, or when the image cannot
                be loaded
              </Label>
              <Input
                type="text"
                name="text"
                id="text"
                placeholder="The OGWT logo from the show’s opening title sequence"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="title">
                <strong>Title text: </strong>
                Displayed on mouse over
              </Label>
              <Input
                type="text"
                name="title"
                id="title"
                placeholder="The OGWT logo from the show’s opening title sequence"
                required
              />
            </FormGroup>
            <p className="h6 mb-4">
              Upload a new image: (allowed extensions: jpg jpeg png gif)
            </p>
            <Row>
              <Col md={3}>
                <div className="custom-file mb-4">
                  <input
                    className="custom-file-input"
                    id="customFile"
                    type="file"
                  />
                  <label className="custom-file-label" for="customFile">
                    Choose file
                  </label>
                </div>
              </Col>
              <Col md={9}>
                <span className="pt-2 d-inline-block mb-4">
                  No file selected.
                </span>
              </Col>
            </Row>
            <Button className="mb-4" color="danger" type="submit">
              Submit
            </Button>
            <p className="h6 mb-0">
              If a new image is chosen, the current image will be replaced when
              you press submit.
            </p>
          </div>
          <hr className="m-0" />
          <div className="narrow-container text-muted p-2rem all-width">
            <h5 className="text-white mb-4">Show Background Image</h5>
            <p className="h6 mb-0">
              Current Image: nydolls-ogwt-bg.jpg (1920 x 1080)
            </p>
          </div>
          <div className="narrow-container text-muted p-2rem pt-0 pb-0 smaller-width">
            <img
              className="mb-4 img-full-width"
              src="https://via.placeholder.com/525x394"
              alt=""
            />
          </div>
          <div className="narrow-container text-muted p-2rem">
            <p className="h6 mb-4">
              Upload a new image: (allowed extensions: jpg jpeg png gif)
            </p>
            <Row>
              <Col md={3}>
                <div className="custom-file mb-4">
                  <input
                    className="custom-file-input"
                    id="customFile"
                    type="file"
                  />
                  <label className="custom-file-label" for="customFile">
                    Choose file
                  </label>
                </div>
              </Col>
              <Col md={9}>
                <span className="pt-2 d-inline-block mb-4">
                  No file selected.
                </span>
              </Col>
            </Row>
            <Button
              className="mb-4"
              color="danger"
              type="submit"
              onClick={this.handleUpdate}
            >
              Submit
            </Button>
            <p className="h6 mb-0">
              If a new image is chosen, the current image will be replaced when
              you press submit.
            </p>
          </div>
        </div>
        <ModalFooter>
          <Button
            className="ml-auto"
            color="danger"
            type="submit"
            onClick={this.handleUpdate}
          >
            Submit
          </Button>
          <Button color="danger" type="button" outline>
            Cancel
          </Button>
        </ModalFooter>
      </div>
    );
  }
}

ImagesTab.propTypes = {
  active: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired,
  setScreenPercentage: PropTypes.func.isRequired,
};

export default withApollo(withContext(ImagesTab));
