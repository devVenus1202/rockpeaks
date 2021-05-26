import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button } from 'reactstrap';
import { get as _get } from 'lodash';
import { withApollo } from 'react-apollo';
import VerticalCard from '@components/Utilities/VerticalCard';
import { getDateFromClipNode } from '@helpers/dateTimeHelper';
import UploadStillImage from '@graphql/clip/UploadStillImage.graphql';
import { withUpdateMutation } from '@components/HOC/withUpdateMutation';
import { decodeHtmlSpecialChars } from '@helpers/stringHelper';

const text1 =
  'If the still image belonging to this clip is missing, or if you have a superior alternate to the one at right, you may upload it here. Please be sure it is from the exact same video.';
const text2 =
  'Stills should be 4 x 3 aspect ratio, 640 x 480 pixels in size. If the source video has different dimensions or is a different aspect ratio, crop the image first, being sure to keep areas of interest visible in the frame.';
const text3 =
  'Avoid overly dark or blurry images, cross-dissolves, black borders, edge noise, closed captioning squares, logos and typography wherever possible.';
const text4 =
  'Look for stills where the subject is in focus, with their eyes open, nicely centred in the frame. Group shots are fine, provided there is enough detail and interest.';

function buildFileSelector(changeHandler) {
  const fileSelector = document.createElement('input');
  fileSelector.setAttribute('type', 'file');
  fileSelector.setAttribute('accept', 'image/*');
  fileSelector.setAttribute('multiple', 'multiple');
  fileSelector.onchange = changeHandler;
  return fileSelector;
}

class StillImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewImage: '',
    };
  }

  componentDidMount() {
    this.fileSelector = buildFileSelector(this.handleFileChange);
  }

  handleFileSelect = e => {
    e.preventDefault();
    this.fileSelector.click();
  };

  handleFileChange = e => {
    e.preventDefault();
    if (e.target.files.length === 0) return '';
    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file,
        previewImage: reader.result,
      });
    };

    reader.readAsDataURL(file);
    return null;
  };

  handleRemoveFile = () => {
    this.setState({ file: '', previewImage: '' });
    this.fileSelector.value = '';
  };

  submit = () => {
    const { file } = this.state;
    const { client, data, updateAction, onEndSubmit } = this.props;
    const clipNid = _get(data, 'nid', '');
    const variables = {
      file,
      entity_type: 'node',
      entity_bundle: 'clip',
      field_name: 'field_still_image',
      entity_id: clipNid,
    };

    updateAction({
      variables,
    })
      .then(({ data }) => {
        if (data.uploadFile.violations.length > 0) {
          onEndSubmit(
            'warning',
            <span
              dangerouslySetInnerHTML={{
                __html: decodeHtmlSpecialChars(
                  data.uploadFile.violations[0].message,
                ),
              }}
            />,
          );
        } else if (data.uploadFile.errors.length > 0) {
          onEndSubmit('warning', data.uploadFile.errors[0]);
        } else {
          onEndSubmit('success', 'Updated Successfully');
        }
      })
      .catch(err => {
        onEndSubmit('warning', 'Falied ');
      });
  };

  getImage = (data, fields) => {
    for (let i = 0; i < fields.length; i++) {
      const img = _get(data, fields[i]);
      if (typeof img !== 'undefined') {
        return img;
      }
    }
    return 'https://rockpeaksassets.s3.amazonaws.com/placeholders/clip-default-still-graphic.png';
  };

  render() {
    const { active, data } = this.props;
    const { previewImage } = this.state;
    const style = active ? 'tab-pane fade show active' : 'tab-pane fade';

    const clipNid = _get(data, 'nid', '');
    const clipTitle = _get(data, 'clipTitle', '');
    const clipArtist = _get(data, 'artist.entity.title', '');
    const clipArtistNid = _get(data, 'artist.entity.nid', null);
    const clipShowNid = _get(data, 'show.entity.nid', null);
    const clipShowTitle = _get(data, 'show.entity.title', null);
    const date = getDateFromClipNode(data);
    const playerImgURL = this.getImage(data, [
      'smartStillImage640x480.uri',
      'fieldStillImage.url',
      'legacyImage.url.path',
    ]);
    return (
      <div className={style}>
        <div className="text-muted  ">
          <Row className="m-4 ">
            <Col md={8} className="still-image">
              <p className="mb-4">{text1}</p>
              <p className="mb-4">{text2}</p>
              <p className="mb-4">{text3}</p>
              <p className="mb-3">{text4}</p>
            </Col>
            <Col md={3} className="offset-1">
              <div>
                <VerticalCard
                  clip={{
                    nid: clipNid,
                    title: clipTitle,
                    show: { nid: clipShowNid, title: clipShowTitle },
                    artist: { nid: clipArtistNid, title: clipArtist },
                    thumbnail: playerImgURL,
                    fieldYear: data.fieldYear,
                    fieldMonth: data.fieldMonth,
                    fieldDay: data.fieldDay,
                    date,
                  }}
                />
              </div>
            </Col>
          </Row>
          <Row className="m-4">
            <Col md={8}>
              <div className="artwork-upload d-flex mt-2">
                <div className="mr-5">
                  <Button
                    className="mb-4 upload-btn mr-4"
                    type="button"
                    color="danger"
                    onClick={this.handleFileSelect}
                    style={{ width: '100%' }}
                  >
                    UPLOAD
                  </Button>
                  <br />
                  <Button
                    className="mb-4 upload-btn mr-4"
                    type="button"
                    color="danger"
                    onClick={this.handleRemoveFile}
                    outline
                    style={{ width: '100%' }}
                  >
                    Remove
                  </Button>
                </div>

                <img className="prevewImage ml-4" src={previewImage} alt="" />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

StillImage.propTypes = {
  active: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired,
};

// export default withApollo(StillImage);
export default withUpdateMutation(UploadStillImage, StillImage);
