import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';

const text1 =
  'If it is a commercial release and there is an official blurb or overview, feel free to paste in that text, or write your own if you prefer. For trade-friendly discs and playlists that you are converting, please write a few sentences describing the contents of this disc.';
const text2 =
  'if you can locate artwork for this disc, please upload it at the highest resolution available.';

function buildFileSelector(changeHandler) {
  const fileSelector = document.createElement('input');
  fileSelector.setAttribute('type', 'file');
  fileSelector.setAttribute('accept', 'image/*');
  fileSelector.setAttribute('multiple', 'multiple');
  fileSelector.onchange = changeHandler;
  // fileSelector.onclick = changeHandler;
  return fileSelector;
}

class EnterMetadata extends Component {
  constructor(props) {
    super(props);
    const {
      metaData: { title, description, artworkPreview },
    } = props;
    this.state = {
      title,
      description,
      file: '',
      imagePreviewUrl: artworkPreview,
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
    console.log(e.target.files);

    e.preventDefault();
    if (e.target.files.length === 0) return '';
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result,
      });
    };

    reader.readAsDataURL(file);
  };

  handleRemoveFile = () => {
    this.setState({ file: '', imagePreviewUrl: '' });
    this.fileSelector.value = '';
  };

  handleNext = () => {
    const { onNext, setDiscData } = this.props;
    const { title, description, imagePreviewUrl, file } = this.state;
    setDiscData('metaData', {
      title,
      description,
      artworkPreview: imagePreviewUrl,
      file,
    });
    onNext();
  };

  handleChange = value => e => {
    this.setState({ [value]: e.target.value });
  };

  render() {
    const { onNext, onBack } = this.props;
    const { imagePreviewUrl, title, description } = this.state;
    return (
      <React.Fragment>
        <Form>
          <div className="narrow-container">
            <p className="text-muted lead">
              If you’re building out a disc based on a well-known music film,
              concert, documentary or TV episode, please use that title here.
              <br />
              Otherwise, give your disc a short descriptive title.
            </p>
            <FormGroup>
              <Input
                type="text"
                placeholder="Title"
                required
                value={title}
                onChange={this.handleChange('title')}
              />
            </FormGroup>
            <p className="text-muted lead">{text1}</p>
            <FormGroup>
              {/* <Label>Enter a description for this disc.:</Label> */}
              <Input
                type="textarea"
                rows={4}
                placeholder="Description"
                required
                value={description}
                onChange={this.handleChange('description')}
              />
            </FormGroup>
            <p className="text-muted lead mb-4">{text2}</p>
            <div className="artwork-upload d-flex">
              <div>
                <Button
                  className="mb-4 upload-btn mr-4"
                  type="button"
                  color="danger"
                  onClick={this.handleFileSelect}
                  style={{ width: '100%' }}
                >
                  UPLOAD ARTWORK
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

              <img className="prevewImage ml-4" src={imagePreviewUrl} alt="" />
            </div>
          </div>
        </Form>
        <div className="text-center text-md-right">
          <Button
            className="m-4 m-sm-0"
            type="button"
            onClick={onBack}
            color="danger"
            outline
          >
            Back
          </Button>
          <Button
            className="mx-4 ml-sm-4 mr-sm-0"
            type="button"
            onClick={this.handleNext}
            color="danger"
            disabled={!title || !description}
          >
            next
          </Button>
        </div>
      </React.Fragment>
    );
  }
}

EnterMetadata.propTypes = {
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  metaData: PropTypes.object.isRequired,
};

export default EnterMetadata;
